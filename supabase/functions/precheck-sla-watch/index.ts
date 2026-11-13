/**
 * precheck-sla-watch
 *
 * Monitors SLA timers for DG Pre-Check orders and sends escalation emails.
 *
 * SLA alert tiers (using sla_alert_count for deduplication):
 *   - docs_received < 60 min without docs  AND sla_alert_count = 0  → alert (set count=1)
 *   - docs_received < 120 min without docs AND sla_alert_count = 1  → alert (set count=2)
 *   - paid without docs > 24h              AND sla_alert_count = 0  → alert (set count=1)
 *
 * FAIL CLOSED: PURGE_CRON_SECRET must be configured; missing = 503.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!
const _notifyRaw           = Deno.env.get('PRECHECK_NOTIFY_EMAIL') ?? 'antonio.perea@globalgatemexico.com'
const NOTIFY_EMAILS        = _notifyRaw.split(',').map(e => e.trim()).filter(Boolean)
const ACTION_SECRET        = Deno.env.get('PRECHECK_ACTION_SECRET') ?? ''
const SITE_URL             = Deno.env.get('PRECHECK_SITE_URL') ?? 'https://www.globalgatemexico.com'

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function bufToBase64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function generateActionToken(orderId: string): Promise<string | null> {
  if (!ACTION_SECRET) return null
  const exp        = Date.now() + 30 * 24 * 60 * 60 * 1000
  const payload    = JSON.stringify({ order_id: orderId, action: 'report_sent', exp })
  const payloadB64 = bufToBase64url(new TextEncoder().encode(payload))
  const keyData    = new TextEncoder().encode(ACTION_SECRET)
  const key        = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sigBuf     = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64))
  return `${payloadB64}.${bufToBase64url(sigBuf)}`
}

async function sendAlertEmail(
  order: Record<string, unknown>,
  alertType: 'docs_60min' | 'docs_120min' | 'paid_24h',
  actionToken: string | null
): Promise<void> {
  if (NOTIFY_EMAILS.length === 0) return

  const subjects: Record<string, string> = {
    docs_60min:  `⚠ [PRE-CHECK] SLA 60 min — sin documentos — ${order.reference} — ${order.company_name}`,
    docs_120min: `🚨 [PRE-CHECK] SLA 120 min — URGENTE — ${order.reference} — ${order.company_name}`,
    paid_24h:    `⚠ [PRE-CHECK] Pago sin documentos +24h — ${order.reference} — ${order.company_name}`,
  }

  const labels: Record<string, { badge: string; color: string; msg: string }> = {
    docs_60min: {
      badge: '⚠ 60 minutos transcurridos',
      color: '#f59e0b',
      msg:   'Han pasado 60 minutos desde la recepción de documentos sin que se haya enviado el reporte.',
    },
    docs_120min: {
      badge: '🚨 120 minutos — URGENTE',
      color: '#dc2626',
      msg:   'Han pasado 120 minutos. Acción inmediata requerida.',
    },
    paid_24h: {
      badge: '⚠ Pago sin documentos +24 horas',
      color: '#f59e0b',
      msg:   'El cliente pagó hace más de 24 horas y no ha subido sus documentos.',
    },
  }

  const { badge, color, msg } = labels[alertType]
  const actionLink = actionToken
    ? `${SITE_URL}/dg-pre-check/staff-action?token=${encodeURIComponent(actionToken)}`
    : null

  const actionBtn = actionLink
    ? `<div style="text-align:center;margin:24px 0;">
        <a href="${esc(actionLink)}" style="display:inline-block;background:#060e1c;color:#fff;padding:12px 24px;font-size:12px;font-weight:800;text-decoration:none;border-radius:3px;text-transform:uppercase;letter-spacing:0.08em;">Marcar reporte enviado →</a>
        <p style="font-size:11px;color:#6b7280;margin-top:8px;">Este enlace expira en 30 días.</p>
      </div>`
    : ''

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;"><!-- ignore-value overused-font Arial -->
      <div style="background:#060e1c;padding:20px 32px;border-bottom:3px solid ${esc(color)};">
        <p style="color:#fff;font-size:14px;font-weight:800;margin:0;">Alerta SLA — DG Pre-Check</p>
      </div>
      <div style="padding:24px;">
        <div style="background:${esc(color)}20;border-left:4px solid ${esc(color)};padding:12px 16px;margin-bottom:20px;">
          <p style="margin:0;font-size:14px;font-weight:800;color:#1f2937;">${esc(badge)}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#374151;">${esc(msg)}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:150px;">Folio</td><td style="font-size:13px;font-weight:800;">${esc(order.reference as string)}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Empresa</td><td style="font-size:13px;font-weight:600;">${esc(order.company_name as string)}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Email cliente</td><td><a href="mailto:${esc(order.buyer_email as string)}" style="color:#2563eb;font-size:13px;">${esc(order.buyer_email as string)}</a></td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Estado actual</td><td style="font-size:13px;">${esc(order.status as string)}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Creado</td><td style="font-size:13px;">${new Date(order.created_at as string).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</td></tr>
        </table>
        ${actionBtn}
      </div>
      <div style="background:#060e1c;padding:16px 32px;">
        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Global Gate México · ggm@globalgatemexico.com</p>
      </div>
    </div>`

  await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:    'GGM Pre-Check <noreply@globalgatemexico.com>',
      to:      NOTIFY_EMAILS,
      subject: subjects[alertType],
      html,
    }),
  }).catch(e => console.error('[precheck-sla-watch] email error:', e))
}

serve(async (req) => {
  // ── FAIL CLOSED: secret must be configured ───────────────────────────────
  const cronSecret = Deno.env.get('PURGE_CRON_SECRET')
  if (!cronSecret) {
    console.error('[precheck-sla-watch] PURGE_CRON_SECRET not configured — rejecting')
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
  const now       = Date.now()
  const ago60min  = new Date(now - 60  * 60 * 1000).toISOString()
  const ago120min = new Date(now - 120 * 60 * 1000).toISOString()
  const ago24h    = new Date(now - 24  * 60 * 60 * 1000).toISOString()

  const summary = { alerted: 0, errors: [] as string[] }

  try {
    // ── 1. docs_received orders (60-min tier) ────────────────────────────
    // Alert when docs_received but no report yet, 60+ min elapsed, count=0
    const { data: tier1, error: err1 } = await supabase
      .from('dg_precheck_orders')
      .select('id, reference, company_name, buyer_email, buyer_phone, status, sla_alert_count, created_at')
      .eq('status', 'docs_received')
      .eq('sla_alert_count', 0)
      .lt('created_at', ago60min)

    if (err1) throw err1

    for (const order of tier1 ?? []) {
      const token = await generateActionToken(order.id as string)
      await sendAlertEmail(order as Record<string, unknown>, 'docs_60min', token)
      await supabase.from('dg_precheck_orders')
        .update({ sla_alert_count: 1 })
        .eq('id', order.id)
        .eq('sla_alert_count', 0)  // prevent double-update race
      summary.alerted++
      console.log('[precheck-sla-watch] 60min alert sent for:', order.reference)
    }

    // ── 2. docs_received orders (120-min tier) ───────────────────────────
    // Alert when docs_received, 120+ min elapsed, count=1
    const { data: tier2, error: err2 } = await supabase
      .from('dg_precheck_orders')
      .select('id, reference, company_name, buyer_email, buyer_phone, status, sla_alert_count, created_at')
      .eq('status', 'docs_received')
      .eq('sla_alert_count', 1)
      .lt('created_at', ago120min)

    if (err2) throw err2

    for (const order of tier2 ?? []) {
      const token = await generateActionToken(order.id as string)
      await sendAlertEmail(order as Record<string, unknown>, 'docs_120min', token)
      await supabase.from('dg_precheck_orders')
        .update({ sla_alert_count: 2 })
        .eq('id', order.id)
        .eq('sla_alert_count', 1)
      summary.alerted++
      console.log('[precheck-sla-watch] 120min alert sent for:', order.reference)
    }

    // ── 3. paid orders without docs for 24h ──────────────────────────────
    const { data: tier3, error: err3 } = await supabase
      .from('dg_precheck_orders')
      .select('id, reference, company_name, buyer_email, buyer_phone, status, sla_alert_count, created_at')
      .eq('status', 'paid')
      .eq('sla_alert_count', 0)
      .lt('created_at', ago24h)

    if (err3) throw err3

    for (const order of tier3 ?? []) {
      await sendAlertEmail(order as Record<string, unknown>, 'paid_24h', null)
      await supabase.from('dg_precheck_orders')
        .update({ sla_alert_count: 1 })
        .eq('id', order.id)
        .eq('sla_alert_count', 0)
      summary.alerted++
      console.log('[precheck-sla-watch] 24h paid alert sent for:', order.reference)
    }

    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[precheck-sla-watch] Fatal error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Error interno', summary }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
