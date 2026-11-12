/**
 * purge-precheck-docs
 *
 * Deletes Storage objects and DB records for DG Pre-Check orders whose documents
 * are eligible for purge (90-day retention window). Intended to be invoked by a
 * cron job (e.g. Supabase Scheduled Functions or pg_cron) — NOT deployed yet.
 *
 * Eligible orders:
 *   - status = 'report_sent'  AND report_sent_at  < now() - 90 days
 *   - status = 'cancelled'    AND updated_at       < now() - 90 days
 *   - status = 'refunded'     AND updated_at       < now() - 90 days
 *   - status = 'paid' or 'docs_received' or 'in_review'
 *     AND created_at < now() - 90 days  (stale unpurged orders)
 *
 * Files are deleted first, then the dg_precheck_files rows, then order rows.
 * The function is idempotent: re-running after a partial failure is safe.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RETENTION_DAYS       = 90

serve(async (req) => {
  // Allow an optional bearer token for simple invocation auth
  const authHeader = req.headers.get('Authorization') ?? ''
  const cronSecret = Deno.env.get('PURGE_CRON_SECRET') ?? ''
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const cutoff   = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const summary = {
    ordersFound:        0,
    filesDeletedStorage: 0,
    filesDeletedDB:     0,
    ordersDeleted:      0,
    errors:             [] as string[],
  }

  try {
    // ── 1. Find eligible orders ────────────────────────────────────────────
    const { data: orders, error: ordersErr } = await supabase
      .from('dg_precheck_orders')
      .select('id, reference, status')
      .or(
        `and(status.eq.report_sent,report_sent_at.lt.${cutoff}),` +
        `and(status.eq.cancelled,updated_at.lt.${cutoff}),` +
        `and(status.eq.refunded,updated_at.lt.${cutoff}),` +
        `and(status.in.(paid,docs_received,in_review),created_at.lt.${cutoff})`
      )

    if (ordersErr) throw ordersErr
    if (!orders || orders.length === 0) {
      console.log('[purge-precheck-docs] No eligible orders to purge.')
      return new Response(JSON.stringify({ purged: 0 }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    summary.ordersFound = orders.length
    console.log(`[purge-precheck-docs] Found ${orders.length} order(s) to purge.`)

    for (const order of orders) {
      // ── 2. Get file records for this order ──────────────────────────────
      const { data: files } = await supabase
        .from('dg_precheck_files')
        .select('id, file_path')
        .eq('order_id', order.id)

      if (files && files.length > 0) {
        // ── 3. Delete from Storage ────────────────────────────────────────
        const paths = files.map(f => f.file_path as string)
        const { error: storageErr } = await supabase.storage
          .from('precheck-docs')
          .remove(paths)

        if (storageErr) {
          console.error(`[purge-precheck-docs] Storage delete error for order ${order.reference}:`, storageErr)
          summary.errors.push(`storage:${order.reference}:${storageErr.message}`)
        } else {
          summary.filesDeletedStorage += paths.length
        }

        // ── 4. Delete file DB records ─────────────────────────────────────
        const { error: filesDbErr } = await supabase
          .from('dg_precheck_files')
          .delete()
          .eq('order_id', order.id)

        if (filesDbErr) {
          summary.errors.push(`files_db:${order.reference}:${filesDbErr.message}`)
        } else {
          summary.filesDeletedDB += files.length
        }
      }

      // ── 5. Delete the order row ──────────────────────────────────────────
      const { error: orderErr } = await supabase
        .from('dg_precheck_orders')
        .delete()
        .eq('id', order.id)

      if (orderErr) {
        console.error(`[purge-precheck-docs] Order delete error ${order.reference}:`, orderErr)
        summary.errors.push(`order:${order.reference}:${orderErr.message}`)
      } else {
        summary.ordersDeleted++
        console.log(`[purge-precheck-docs] Purged order ${order.reference} (${order.status})`)
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
