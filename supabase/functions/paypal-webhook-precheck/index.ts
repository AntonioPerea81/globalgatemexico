import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Pre-Check has its own PayPal credentials and webhook ID, isolated from training.
const PAYPAL_CLIENT_ID     = Deno.env.get('PRECHECK_PAYPAL_CLIENT_ID')!
const PAYPAL_CLIENT_SECRET = Deno.env.get('PRECHECK_PAYPAL_CLIENT_SECRET')!
const PAYPAL_ENV           = Deno.env.get('PRECHECK_PAYPAL_ENV') ?? 'sandbox'
const PAYPAL_WEBHOOK_ID    = Deno.env.get('PRECHECK_PAYPAL_WEBHOOK_ID')!
const PAYPAL_BASE          = PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'
const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!
const _notifyRaw           = Deno.env.get('PRECHECK_NOTIFY_EMAIL') ?? 'antonio.perea@globalgatemexico.com'
const NOTIFY_EMAILS        = _notifyRaw.split(',').map(e => e.trim()).filter(Boolean)
const _acctRaw             = Deno.env.get('PRECHECK_ACCOUNTING_EMAIL') ?? ''
const ACCOUNTING_EMAILS    = _acctRaw.split(',').map(e => e.trim()).filter(Boolean)
const PRECHECK_SITE_URL    = Deno.env.get('PRECHECK_SITE_URL') ?? 'https://www.globalgatemexico.com'

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

async function paypalAccessToken(): Promise<string> {
  const creds = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)
  const res   = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:  'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error('Unable to authenticate with PayPal Pre-Check credentials')
  return (await res.json()).access_token as string
}

async function sendAlertEmail(subject: string, body: string): Promise<void> {
  if (NOTIFY_EMAILS.length === 0) return
  await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:    'GGM Pre-Check <noreply@globalgatemexico.com>',
      to:      NOTIFY_EMAILS,
      subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><!-- ignore-value overused-font Arial --><div style="background:#991b1b;padding:16px 24px;"><p style="color:#fff;font-size:14px;font-weight:800;margin:0;">⚠ Alerta de Webhook — DG Pre-Check</p></div><div style="padding:24px;white-space:pre-wrap;font-size:13px;color:#374151;">${esc(body)}</div></div>`,
    }),
  }).catch(e => console.error('[paypal-webhook-precheck] alert email error:', e))
}

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  try {
    if (!PAYPAL_WEBHOOK_ID) {
      console.error('[paypal-webhook-precheck] PRECHECK_PAYPAL_WEBHOOK_ID not configured')
      return new Response('Webhook not configured', { status: 503 })
    }

    // Read body as text first (required for signature verification)
    const rawBody = await req.text()
    let event: Record<string, unknown>
    try {
      event = JSON.parse(rawBody)
    } catch {
      return new Response('Invalid JSON', { status: 400 })
    }

    // ── Verify PayPal webhook signature ─────────────────────────────────────
    const token = await paypalAccessToken()
    const verification = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo:         req.headers.get('paypal-auth-algo'),
        cert_url:          req.headers.get('paypal-cert-url'),
        transmission_id:   req.headers.get('paypal-transmission-id'),
        transmission_sig:  req.headers.get('paypal-transmission-sig'),
        transmission_time: req.headers.get('paypal-transmission-time'),
        webhook_id:        PAYPAL_WEBHOOK_ID,
        webhook_event:     event,
      }),
    })
    const verified = await verification.json()
    if (!verification.ok || verified.verification_status !== 'SUCCESS') {
      console.error('[paypal-webhook-precheck] Invalid signature:', verified)
      return new Response('Invalid signature', { status: 401 })
    }

    const admin     = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })
    const eventId   = event.id as string
    const eventType = event.event_type as string

    // ── Deduplication: read-only check BEFORE processing ──────────────────
    const { data: existingEvent } = await admin
      .from('paypal_precheck_webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .maybeSingle()

    if (existingEvent) {
      console.log('[paypal-webhook-precheck] Duplicate event, skipping:', eventId)
      return new Response('Already processed', { status: 200 })
    }

    // ── Handle PAYMENT.CAPTURE.COMPLETED ────────────────────────────────────
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource  = event.resource as Record<string, unknown>
      const captureId = resource.id as string
      const ppOrderId = (resource.supplementary_data as Record<string, unknown>)
        ?.related_ids?.order_id as string | undefined

      if (!ppOrderId) {
        console.warn('[paypal-webhook-precheck] No order_id in event resource')
      } else {
        const { data: order } = await admin
          .from('dg_precheck_orders')
          .select('id, reference, status, total_usd, buyer_email, buyer_name, company_name, billing_country, num_packages, buyer_phone, amount_usd, tax_rate, tax_amount_usd, checkout_session_token')
          .eq('paypal_order_id', ppOrderId)
          .maybeSingle()

        if (!order) {
          // Order not found — alert and return 200 to stop retries
          const alertMsg = `PayPal order ID no encontrado en la base de datos.\n\nevent_id: ${eventId}\npaypal_order_id: ${ppOrderId}\nreason: order_not_found`
          await sendAlertEmail(`⚠ [PRE-CHECK] Webhook: orden no encontrada — ${ppOrderId}`, alertMsg)
          console.warn('[paypal-webhook-precheck] Order not found for ppOrderId:', ppOrderId)
        } else {
          const capturedAmount   = Number((resource.amount as Record<string, string>)?.value ?? 0)
          const capturedCurrency = (resource.amount as Record<string, string>)?.currency_code
          const expectedAmount   = Number(order.total_usd)

          if (Math.abs(capturedAmount - expectedAmount) > 0.01) {
            const alertMsg = `Discrepancia de importe en webhook.\n\nevent_id: ${eventId}\npaypal_order_id: ${ppOrderId}\nfolio: ${order.reference}\ncapturado: ${capturedAmount} USD\nesperado: ${expectedAmount} USD\nreason: amount_mismatch`
            await sendAlertEmail(`⚠ [PRE-CHECK] Webhook: discrepancia de importe — ${order.reference}`, alertMsg)
            console.error('[paypal-webhook-precheck] Amount mismatch:', capturedAmount, 'expected', expectedAmount)
          } else if (capturedCurrency !== 'USD') {
            const alertMsg = `Moneda incorrecta en webhook.\n\nevent_id: ${eventId}\npaypal_order_id: ${ppOrderId}\nfolio: ${order.reference}\nmoneda: ${capturedCurrency}\nreason: currency_mismatch`
            await sendAlertEmail(`⚠ [PRE-CHECK] Webhook: moneda incorrecta — ${order.reference}`, alertMsg)
            console.error('[paypal-webhook-precheck] Currency mismatch:', capturedCurrency)
          } else {
            // ── Conditional update: only if order is still pending_payment ──────
            const { data: updated, error: updateErr } = await admin
              .from('dg_precheck_orders')
              .update({
                status:            'paid',
                paypal_capture_id: captureId,
                paid_at:           (resource.create_time as string) ?? new Date().toISOString(),
              })
              .eq('id', order.id)
              .eq('status', 'pending_payment')
              .select('id')
              .maybeSingle()

            if (updateErr) throw updateErr  // 500 → PayPal retries; event not logged yet

            if (updated) {
              // Fetch DG entries for email
              const { data: entries } = await admin
                .from('dg_precheck_entries')
                .select('line_no, un_number, hazard_class, proper_shipping_name')
                .eq('order_id', order.id)
                .order('line_no', { ascending: true })

              const entriesHtml = (entries ?? []).map(e =>
                `<tr>
                  <td style="padding:4px 8px;font-size:13px;border-bottom:1px solid #f0f0f0;">${esc(e.line_no)}</td>
                  <td style="padding:4px 8px;font-size:13px;font-weight:700;">${esc(e.un_number)}</td>
                  <td style="padding:4px 8px;font-size:13px;">${esc(e.hazard_class)}</td>
                  <td style="padding:4px 8px;font-size:13px;color:#6b7280;">${esc(e.proper_shipping_name ?? '—')}</td>
                </tr>`
              ).join('')

              const isMX = order.billing_country === 'MX'
              const uploadLink = `${PRECHECK_SITE_URL}/${isMX ? 'revision-previa-dg' : 'dg-pre-check'}/complete?session=${encodeURIComponent(order.checkout_session_token as string)}`

              const internalTo = [...NOTIFY_EMAILS, ...ACCOUNTING_EMAILS].filter(Boolean)
              if (internalTo.length > 0) {
                await fetch('https://api.resend.com/emails', {
                  method:  'POST',
                  headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    from:    'GGM Pre-Check <noreply@globalgatemexico.com>',
                    to:      internalTo,
                    subject: `[PRE-CHECK] Pago recibido — ${esc(order.reference as string)} — ${esc(order.company_name as string)}`,
                    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;"><!-- ignore-value overused-font Arial -->
                      <div style="background:#060e1c;padding:24px 32px;border-bottom:2px solid #22c55e;">
                        <p style="color:#fff;font-size:14px;font-weight:800;margin:0;">✓ Pago recibido (vía webhook) — DG Pre-Check</p>
                      </div>
                      <div style="padding:24px;">
                        <div style="background:#f0fdf4;border-left:3px solid #22c55e;padding:12px 16px;margin-bottom:20px;">
                          <p style="margin:0;font-size:14px;font-weight:800;color:#166534;">Folio: ${esc(order.reference as string)}</p>
                        </div>
                        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
                          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:150px;">Nombre</td><td style="font-size:13px;font-weight:600;">${esc(order.buyer_name as string)}</td></tr>
                          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Empresa</td><td style="font-size:13px;font-weight:600;">${esc(order.company_name as string)}</td></tr>
                          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Email</td><td style="font-size:13px;">${esc(order.buyer_email as string)}</td></tr>
                          ${order.buyer_phone ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Teléfono</td><td style="font-size:13px;">${esc(order.buyer_phone as string)}</td></tr>` : ''}
                          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">País</td><td style="font-size:13px;">${esc(order.billing_country as string)}</td></tr>
                          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Bultos</td><td style="font-size:13px;">${esc(order.num_packages)}</td></tr>
                          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;border-top:1px solid #e5e7eb;">Subtotal</td><td style="font-size:13px;">USD ${Number(order.amount_usd).toFixed(2)}</td></tr>
                          <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">IVA</td><td style="font-size:13px;">USD ${Number(order.tax_amount_usd).toFixed(2)}</td></tr>
                          <tr><td style="font-size:13px;font-weight:800;padding:4px 0;">Total</td><td style="font-size:14px;font-weight:800;">USD ${Number(order.total_usd).toFixed(2)}</td></tr>
                          <tr><td style="color:#6b7280;font-size:12px;padding:3px 0;">PayPal Capture ID</td><td style="font-size:12px;color:#6b7280;">${esc(captureId)}</td></tr>
                        </table>
                        <p style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin-bottom:6px;">Entradas DG</p>
                        <table style="width:100%;border-collapse:collapse;">
                          <thead><tr style="background:#f4f6f9;">
                            <th style="padding:6px 8px;text-align:left;font-size:11px;color:#6b7280;">#</th>
                            <th style="padding:6px 8px;text-align:left;font-size:11px;color:#6b7280;">UN</th>
                            <th style="padding:6px 8px;text-align:left;font-size:11px;color:#6b7280;">Clase</th>
                            <th style="padding:6px 8px;text-align:left;font-size:11px;color:#6b7280;">PSN</th>
                          </tr></thead>
                          <tbody>${entriesHtml}</tbody>
                        </table>
                      </div>
                      <div style="background:#060e1c;padding:16px 32px;">
                        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Global Gate México · ggm@globalgatemexico.com</p>
                      </div>
                    </div>`,
                  }),
                }).catch(e => console.error('[paypal-webhook-precheck] internal email error:', e))
              }

              // Client confirmation email
              await fetch('https://api.resend.com/emails', {
                method:  'POST',
                headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  from:     'GGM Pre-Check <noreply@globalgatemexico.com>',
                  reply_to: 'ggm@globalgatemexico.com',
                  to:       [order.buyer_email as string],
                  subject:  isMX
                    ? `✓ Pago confirmado — Folio ${esc(order.reference as string)} | GGM DG Pre-Check`
                    : `✓ Payment confirmed — Reference ${esc(order.reference as string)} | GGM DG Pre-Check`,
                  html: isMX
                    ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><!-- ignore-value overused-font Arial --><p>Hola ${esc(order.buyer_name as string)},</p><p>Confirmamos su pago de <strong>USD ${Number(order.total_usd).toFixed(2)}</strong> (folio <strong>${esc(order.reference as string)}</strong>).</p><p>Cargue sus documentos desde: <a href="${esc(uploadLink)}">${esc(uploadLink)}</a></p><p>Si necesita ayuda escríbanos a <a href="mailto:ggm@globalgatemexico.com">ggm@globalgatemexico.com</a>.</p></div>`
                    : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><!-- ignore-value overused-font Arial --><p>Hi ${esc(order.buyer_name as string)},</p><p>Your payment of <strong>USD ${Number(order.total_usd).toFixed(2)}</strong> for reference <strong>${esc(order.reference as string)}</strong> is confirmed.</p><p>Upload your documents at: <a href="${esc(uploadLink)}">${esc(uploadLink)}</a></p><p>Need help? Email us at <a href="mailto:ggm@globalgatemexico.com">ggm@globalgatemexico.com</a>.</p></div>`,
                }),
              }).catch(e => console.error('[paypal-webhook-precheck] client email error:', e))

              console.log('[paypal-webhook-precheck] Order marked paid via webhook:', order.reference)
            } else {
              console.log('[paypal-webhook-precheck] Order already past pending_payment, skipping:', order.reference, order.status)
            }
          }
        }
      }
    }

    // ── Handle PAYMENT.CAPTURE.REFUNDED ─────────────────────────────────────
    if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      const resource  = event.resource as Record<string, unknown>
      const ppOrderId = (resource.supplementary_data as Record<string, unknown>)
        ?.related_ids?.order_id as string | undefined

      if (ppOrderId) {
        const { error: refundErr } = await admin
          .from('dg_precheck_orders')
          .update({ status: 'refunded' })
          .eq('paypal_order_id', ppOrderId)
          .neq('status', 'refunded')  // idempotent

        if (refundErr) throw refundErr  // 500 → PayPal retries
      }
    }

    // ── Log event AFTER successful processing ────────────────────────────────
    const { error: logErr } = await admin
      .from('paypal_precheck_webhook_events')
      .insert({ event_id: eventId, event_type: eventType, payload: event })

    if (logErr && logErr.code !== '23505') {
      console.warn('[paypal-webhook-precheck] Event log insert warning:', logErr.message)
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('[paypal-webhook-precheck]', err)
    return new Response('Webhook processing failed', { status: 500 })
  }
})
