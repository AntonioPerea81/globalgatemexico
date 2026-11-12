/**
 * purge-precheck-docs
 *
 * Deletes Storage objects and dg_precheck_files records for DG Pre-Check orders
 * whose documents are eligible for purge (90-day retention window). Marks each
 * purged order with files_purged_at. Order rows are NEVER deleted; only Storage
 * and file records are removed. Fiscal and payment data are retained per
 * accountant guidance.
 *
 * Also hard-deletes pending_payment orders older than 7 days (incomplete checkouts).
 * Also purges paypal_precheck_webhook_events rows older than 90 days.
 *
 * NOT deployed/scheduled — invoke manually or via cron (pg_cron / Supabase Scheduled).
 *
 * Eligible for file purge (non-pending_payment):
 *   - status = 'report_sent'  AND report_sent_at  < now() - 90 days
 *   - status = 'cancelled'    AND updated_at       < now() - 90 days
 *   - status = 'refunded'     AND updated_at       < now() - 90 days
 *   - status IN ('paid','docs_received','in_review') AND created_at < now() - 90 days
 *
 * Idempotent: re-running after a partial failure is safe.
 * FAIL CLOSED: PURGE_CRON_SECRET must be configured; missing secret = 503.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RETENTION_DAYS       = 90
const PENDING_EXPIRY_DAYS  = 7

serve(async (req) => {
  // ── FAIL CLOSED: secret must be configured ─────────────────────────────
  const cronSecret = Deno.env.get('PURGE_CRON_SECRET')
  if (!cronSecret) {
    console.error('[purge-precheck-docs] PURGE_CRON_SECRET not configured — rejecting')
    return new Response(
      JSON.stringify({ error: 'Función no configurada. Configure PURGE_CRON_SECRET.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const authHeader = req.headers.get('Authorization') ?? ''
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase  = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const cutoff90  = new Date(Date.now() - RETENTION_DAYS  * 24 * 60 * 60 * 1000).toISOString()
  const cutoff7   = new Date(Date.now() - PENDING_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const now       = new Date().toISOString()

  const summary = {
    ordersFilesPurged:    0,
    storageFilesDeleted:  0,
    dbFileRecordsDeleted: 0,
    pendingOrdersDeleted: 0,
    webhookEventsDeleted: 0,
    errors:               [] as string[],
  }

  try {
    // ── 1. Find orders eligible for file purge ─────────────────────────────
    // files_purged_at IS NULL ensures idempotency — already-purged orders are skipped
    const { data: orders, error: ordersErr } = await supabase
      .from('dg_precheck_orders')
      .select('id, reference, status')
      .is('files_purged_at', null)
      .or(
        `and(status.eq.report_sent,report_sent_at.lt.${cutoff90}),` +
        `and(status.eq.cancelled,updated_at.lt.${cutoff90}),` +
        `and(status.eq.refunded,updated_at.lt.${cutoff90}),` +
        `and(status.in.(paid,docs_received,in_review),created_at.lt.${cutoff90})`
      )

    if (ordersErr) throw ordersErr

    if (orders && orders.length > 0) {
      console.log(`[purge-precheck-docs] Found ${orders.length} order(s) eligible for file purge.`)

      for (const order of orders) {
        // ── 2. List Storage objects by prefix (authoritative source) ────────
        const { data: storageObjs, error: listErr } = await supabase.storage
          .from('precheck-docs')
          .list(order.id as string)

        if (listErr) {
          console.error(`[purge-precheck-docs] Storage list error for ${order.reference}:`, listErr)
          summary.errors.push(`storage_list:${order.reference}:${listErr.message}`)
          continue
        }

        const storagePaths = (storageObjs ?? []).map(
          (o: { name: string }) => `${order.id}/${o.name}`
        )

        if (storagePaths.length > 0) {
          // ── 3. Delete Storage objects ──────────────────────────────────
          const { error: removeErr } = await supabase.storage
            .from('precheck-docs')
            .remove(storagePaths)

          if (removeErr) {
            console.error(`[purge-precheck-docs] Storage delete error for ${order.reference}:`, removeErr)
            summary.errors.push(`storage_remove:${order.reference}:${removeErr.message}`)
            // Skip DB cleanup for this order — do not leave orphan DB records
            continue
          }

          summary.storageFilesDeleted += storagePaths.length

          // ── 4. Delete dg_precheck_files records (only after Storage success) ──
          const { data: deletedFiles, error: filesDbErr } = await supabase
            .from('dg_precheck_files')
            .delete()
            .eq('order_id', order.id)
            .select('id')

          if (filesDbErr) {
            console.error(`[purge-precheck-docs] DB files delete error for ${order.reference}:`, filesDbErr)
            summary.errors.push(`files_db:${order.reference}:${filesDbErr.message}`)
          } else {
            summary.dbFileRecordsDeleted += (deletedFiles ?? []).length
          }
        }

        // ── 5. Mark order as purged (order row is NOT deleted) ────────────
        const { error: markErr } = await supabase
          .from('dg_precheck_orders')
          .update({ files_purged_at: now })
          .eq('id', order.id)

        if (markErr) {
          console.error(`[purge-precheck-docs] Mark files_purged_at error for ${order.reference}:`, markErr)
          summary.errors.push(`mark_purged:${order.reference}:${markErr.message}`)
        } else {
          summary.ordersFilesPurged++
          console.log(`[purge-precheck-docs] Files purged for order ${order.reference} (${order.status})`)
        }
      }
    }

    // ── 6. Hard-delete pending_payment orders older than 7 days ──────────
    // These are incomplete checkouts; no files or fiscal data to retain.
    const { data: deletedPending, error: pendingErr } = await supabase
      .from('dg_precheck_orders')
      .delete()
      .eq('status', 'pending_payment')
      .lt('created_at', cutoff7)
      .select('id')

    if (pendingErr) {
      console.error('[purge-precheck-docs] Pending delete error:', pendingErr)
      summary.errors.push(`pending_orders:${pendingErr.message}`)
    } else {
      summary.pendingOrdersDeleted = (deletedPending ?? []).length
      if (summary.pendingOrdersDeleted > 0) {
        console.log(`[purge-precheck-docs] Deleted ${summary.pendingOrdersDeleted} expired pending_payment order(s).`)
      }
    }

    // ── 7. Purge webhook event log older than 90 days ─────────────────────
    const { data: deletedEvents, error: eventsErr } = await supabase
      .from('paypal_precheck_webhook_events')
      .delete()
      .lt('created_at', cutoff90)
      .select('id')

    if (eventsErr) {
      console.error('[purge-precheck-docs] Webhook events purge error:', eventsErr)
      summary.errors.push(`webhook_events:${eventsErr.message}`)
    } else {
      summary.webhookEventsDeleted = (deletedEvents ?? []).length
      if (summary.webhookEventsDeleted > 0) {
        console.log(`[purge-precheck-docs] Purged ${summary.webhookEventsDeleted} webhook event(s) > 90 days.`)
      }
    }

    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[purge-precheck-docs] Fatal error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Error interno', summary }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
})
