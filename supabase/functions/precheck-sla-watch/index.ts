/**
 * precheck-sla-watch
 *
 * Sends an alert email if any DG Pre-Check order has been in 'docs_received'
 * status for more than 60 minutes without progressing, but only during
 * business hours: Mon–Fri 09:00–17:00 CDMX (America/Mexico_City).
 *
 * NOT deployed/scheduled — invoke manually or schedule via cron.
 * Auth: same PURGE_CRON_SECRET as purge-precheck-docs (optional — if not set,
 * the endpoint is unprotected; configure in production).
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!
const _notifyRaw           = Deno.env.get('PRECHECK_NOTIFY_EMAIL') ?? 'antonio.perea@globalgatemexico.com'
const NOTIFY_EMAILS        = _notifyRaw.split(',').map(e => e.trim()).filter(Boolean)
const CRON_SECRET          = Deno.env.get('PURGE_CRON_SECRET') ?? ''

const SLA_MINUTES = 60
const CDMX_TZ     = 'America/Mexico_City'

function isBusinessHoursCDMX(): boolean {
  const now  = new Date()
  const cdmx = new Date(now.toLocaleString('en-US', { timeZone: CDMX_TZ }))
  const dow  = cdmx.getDay()   // 0=Sun … 6=Sat
  const hour = cdmx.getHours()
  return dow >= 1 && dow <= 5 && hour >= 9 && hour < 17
}

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

serve(async (req) => {
  if (CRON_SECRET) {
    const authHeader = req.headers.get('Authorization') ?? ''
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  if (!isBusinessHoursCDMX()) {
    return new Response(
      JSON.stringify({ skipped: 'Outside business hours (Mon–Fri 09:00–17:00 CDMX)' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const cutoff   = new Date(Date.now() - SLA_MINUTES * 60 * 1000).toISOString()

  const { data: staleOrders, error } = await supabase
    .from('dg_precheck_orders')
    .select('id, reference, company_name, origin, destination, updated_at')
    .eq('status', 'docs_received')
    .lt('updated_at', cutoff)
    .order('updated_at', { ascending: true })

  if (error) {
    console.error('[precheck-sla-watch] DB error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (!staleOrders || staleOrders.length === 0) {
    return new Response(
      JSON.stringify({ alertSent: false, stale: 0 }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  const rows = staleOrders.map(o => {
    const minAgo = Math.round((Date.now() - new Date(o.updated_at as string).getTime()) / 60_000)
    return `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;">${esc(o.reference as string)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;">${esc(o.company_name as string)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;">${esc(o.origin as string)} → ${esc(o.destination as string)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:800;color:#ef4444;">${minAgo} min</td>
    </tr>`
  }).join('')

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;"><!-- ignore-value overused-font Arial -->
      <div style="background:#991b1b;padding:24px 32px;">
        <p style="color:#fff;font-size:16px;font-weight:800;margin:0;">⚠ ALERTA DE SLA — DG Pre-Check</p>
        <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:4px 0 0;">${staleOrders.length} orden(es) en docs_received por más de ${SLA_MINUTES} minutos</p>
      </div>
      <div style="padding:24px;background:#fff;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f4f6f9;">
              <th style="padding:8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">Folio</th>
              <th style="padding:8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">Empresa</th>
              <th style="padding:8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">Ruta</th>
              <th style="padding:8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">Tiempo</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:20px;font-size:13px;color:#374151;">Accede al panel de Supabase para revisar y actualizar el estado de estas órdenes.</p>
      </div>
      <div style="background:#060e1c;padding:16px 32px;">
        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Global Gate México · ggm@globalgatemexico.com · +52 812 165 4040</p>
      </div>
    </div>`

  const emailRes = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:    'GGM Pre-Check <noreply@globalgatemexico.com>',
      to:      NOTIFY_EMAILS,
      subject: `⚠ [SLA] ${staleOrders.length} orden(es) pendiente(s) >${SLA_MINUTES} min — DG Pre-Check`,
      html,
    }),
  })

  if (!emailRes.ok) {
    const errText = await emailRes.text()
    console.error('[precheck-sla-watch] Email error:', errText)
    return new Response(
      JSON.stringify({ error: 'Email failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const refs = staleOrders.map(o => o.reference)
  console.log(`[precheck-sla-watch] Alert sent for ${staleOrders.length} order(s):`, refs)

  return new Response(
    JSON.stringify({ alertSent: true, stale: staleOrders.length, refs }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
