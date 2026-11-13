import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Pre-Check has its own PayPal credentials, isolated from the training service.
const PAYPAL_CLIENT_ID     = Deno.env.get('PRECHECK_PAYPAL_CLIENT_ID')!
const PAYPAL_CLIENT_SECRET = Deno.env.get('PRECHECK_PAYPAL_CLIENT_SECRET')!
const PAYPAL_ENV           = Deno.env.get('PRECHECK_PAYPAL_ENV') ?? 'sandbox'
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

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

async function paypalToken(): Promise<string> {
  const creds = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)
  const res   = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:  'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!res.ok) {
    console.error('[capture-precheck-order] PayPal auth error:', data)
    throw new Error('Error de autenticación con procesador de pago')
  }
  return data.access_token
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const body         = await req.json()
    const sessionToken = body.sessionToken as string

    if (!sessionToken) return json({ error: 'sessionToken requerido' }, 400)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const { data: order, error: fetchErr } = await supabase
      .from('dg_precheck_orders')
      .select('*')
      .eq('checkout_session_token', sessionToken)
      .single()

    if (fetchErr || !order) return json({ error: 'Sesión no encontrada' }, 404)

    // Idempotent: if already paid or docs received, return success directly
    if (order.status === 'paid' || order.status === 'docs_received') {
      return json({
        success:         true,
        reference:       order.reference,
        orderId:         order.id,
        alreadyCaptured: true,
        alreadyUploaded: order.status === 'docs_received',
      })
    }

    if (order.status !== 'pending_payment') {
      return json({ error: `Estado inválido: ${order.status}` }, 400)
    }

    // Use ONLY the PayPal order ID stored in DB — never trust the client's value.
    const ppOrderId = order.paypal_order_id
    if (!ppOrderId) return json({ error: 'PayPal order ID no disponible en la base de datos' }, 400)

    const accessToken = await paypalToken()
    const captureRes  = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${ppOrderId}/capture`, {
      method:  'POST',
      headers: {
        Authorization:       `Bearer ${accessToken}`,
        'Content-Type':      'application/json',
        'PayPal-Request-Id': `precheck-capture-${order.id}`,
      },
    })

    const captureData = await captureRes.json()
    if (!captureRes.ok) {
      console.error('[capture-precheck-order] PayPal capture failed:', captureData)
      throw new Error('Error al procesar el pago con PayPal')
    }

    // Verify capture integrity: status, amount, and currency must match the order on record.
    const capture          = captureData.purchase_units?.[0]?.payments?.captures?.[0]
    const capturedStatus   = capture?.status
    const capturedAmount   = capture?.amount?.value
    const capturedCurrency = capture?.amount?.currency_code
    const captureId        = capture?.id

    if (capturedStatus !== 'COMPLETED') {
      console.error('[capture-precheck-order] Unexpected capture status:', capturedStatus)
      return json({ error: 'Su pago está en revisión por PayPal. Le enviaremos un correo cuando se confirme.', code: 'PAYMENT_PENDING' }, 402)
    }

    const expectedAmount = Number(order.total_usd).toFixed(2)
    if (capturedAmount !== expectedAmount) {
      console.error('[capture-precheck-order] Amount mismatch:', capturedAmount, 'expected', expectedAmount)
      return json({ error: 'El importe capturado no coincide con el total de la orden' }, 402)
    }

    if (capturedCurrency !== 'USD') {
      console.error('[capture-precheck-order] Currency mismatch:', capturedCurrency)
      return json({ error: 'Moneda incorrecta en la captura' }, 402)
    }

    // ── Conditional update: only transitions from pending_payment → paid ──
    const { data: updated, error: updateErr } = await supabase
      .from('dg_precheck_orders')
      .update({
        status:            'paid',
        paypal_capture_id: captureId ?? null,
        paid_at:           new Date().toISOString(),
      })
      .eq('id', order.id)
      .eq('status', 'pending_payment')
      .select('id')
      .maybeSingle()

    if (updateErr) {
      console.error('[capture-precheck-order] DB update error:', updateErr)
      return json({ error: 'Error al registrar el pago. Contacte soporte con su folio.' }, 500)
    }

    // Send emails only when status actually changed to paid
    if (updated) {
      // Fetch DG entries for email body
      const { data: entries } = await supabase
        .from('dg_precheck_entries')
        .select('line_no, un_number, hazard_class, proper_shipping_name')
        .eq('order_id', order.id)
        .order('line_no', { ascending: true })

      const isMX         = order.billing_country === 'MX'
      const entriesHtml  = (entries ?? []).map(e =>
        `<tr>
          <td style="padding:4px 8px;font-size:13px;border-bottom:1px solid #f0f0f0;">${esc(e.line_no)}</td>
          <td style="padding:4px 8px;font-size:13px;border-bottom:1px solid #f0f0f0;font-weight:700;">${esc(e.un_number)}</td>
          <td style="padding:4px 8px;font-size:13px;border-bottom:1px solid #f0f0f0;">${esc(e.hazard_class)}</td>
          <td style="padding:4px 8px;font-size:13px;border-bottom:1px solid #f0f0f0;color:#6b7280;">${esc(e.proper_shipping_name ?? '—')}</td>
        </tr>`
      ).join('')

      const uploadLink = `${PRECHECK_SITE_URL}/${isMX ? 'revision-previa-dg' : 'dg-pre-check'}/complete?session=${encodeURIComponent(order.checkout_session_token as string)}`

      // ── Internal email: Pago recibido → NOTIFY + ACCOUNTING ───────────────
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
                <p style="color:#fff;font-size:14px;font-weight:800;margin:0;">✓ Pago recibido — DG Pre-Check</p>
              </div>
              <div style="padding:24px;">
                <div style="background:#f0fdf4;border-left:3px solid #22c55e;padding:12px 16px;margin-bottom:20px;">
                  <p style="margin:0;font-size:14px;font-weight:800;color:#166534;">Folio: ${esc(order.reference as string)}</p>
                  <p style="margin:4px 0 0;font-size:12px;color:#166534;">Pago confirmado: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })} CDMX</p>
                </div>
                <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
                  <tr><td colspan="2" style="padding:0 0 6px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">Cliente</td></tr>
                  <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:150px;">Nombre</td><td style="font-size:13px;font-weight:600;">${esc(order.buyer_name as string)}</td></tr>
                  <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Empresa</td><td style="font-size:13px;font-weight:600;">${esc(order.company_name as string)}</td></tr>
                  <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Email</td><td><a href="mailto:${esc(order.buyer_email as string)}" style="color:#2563eb;font-size:13px;">${esc(order.buyer_email as string)}</a></td></tr>
                  ${order.buyer_phone ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Teléfono</td><td style="font-size:13px;">${esc(order.buyer_phone as string)}</td></tr>` : ''}
                  <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">País Facturación</td><td style="font-size:13px;">${esc(order.billing_country as string)}</td></tr>
                  <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Bultos</td><td style="font-size:13px;">${esc(order.num_packages)}</td></tr>
                  <tr><td colspan="2" style="padding:12px 0 6px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;border-top:1px solid #e5e7eb;">Pago</td></tr>
                  <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Subtotal</td><td style="font-size:13px;">USD ${Number(order.amount_usd).toFixed(2)}</td></tr>
                  <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">IVA (${(Number(order.tax_rate) * 100).toFixed(0)}%)</td><td style="font-size:13px;">USD ${Number(order.tax_amount_usd).toFixed(2)}</td></tr>
                  <tr><td style="font-size:13px;font-weight:800;color:#111827;padding:4px 0;">Total</td><td style="font-size:14px;font-weight:800;color:#111827;">USD ${Number(order.total_usd).toFixed(2)}</td></tr>
                  <tr><td style="color:#6b7280;font-size:12px;padding:3px 0;">PayPal Capture ID</td><td style="font-size:12px;color:#6b7280;">${esc(captureId ?? '—')}</td></tr>
                  <tr><td style="color:#6b7280;font-size:12px;padding:3px 0;">Fecha pago</td><td style="font-size:12px;color:#6b7280;">${new Date().toISOString()}</td></tr>
                </table>
                <p style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin-bottom:6px;">Entradas DG</p>
                <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                  <thead><tr style="background:#f4f6f9;">
                    <th style="padding:6px 8px;text-align:left;font-size:11px;color:#6b7280;">#</th>
                    <th style="padding:6px 8px;text-align:left;font-size:11px;color:#6b7280;">UN</th>
                    <th style="padding:6px 8px;text-align:left;font-size:11px;color:#6b7280;">Clase</th>
                    <th style="padding:6px 8px;text-align:left;font-size:11px;color:#6b7280;">PSN</th>
                  </tr></thead>
                  <tbody>${entriesHtml}</tbody>
                </table>
                <p style="font-size:12px;color:#6b7280;margin-top:8px;">El cliente aún debe cargar documentos para completar la solicitud.</p>
              </div>
              <div style="background:#060e1c;padding:16px 32px;">
                <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Global Gate México · ggm@globalgatemexico.com</p>
              </div>
            </div>`,
          }),
        }).catch(e => console.error('[capture-precheck-order] internal email error:', e))
      }

      // ── Client confirmation email ──────────────────────────────────────────
      await fetch('https://api.resend.com/emails', {
        method:  'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:     'GGM Pre-Check <noreply@globalgatemexico.com>',
          reply_to: 'ggm@globalgatemexico.com',
          to:       [order.buyer_email],
          subject:  isMX
            ? `✓ Pago recibido — Folio ${esc(order.reference as string)} | GGM DG Pre-Check`
            : `✓ Payment received — Reference ${esc(order.reference as string)} | GGM DG Pre-Check`,
          html: isMX ? `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><!-- ignore-value overused-font Arial -->
              <div style="background:#060e1c;padding:32px;text-align:center;">
                <img src="https://www.globalgatemexico.com/GGM-SM.png" alt="GGM" style="height:48px;" />
              </div>
              <div style="padding:32px;">
                <h2 style="color:#060e1c;">Pago confirmado</h2>
                <p>Hola ${esc(order.buyer_name as string)},</p>
                <p>Recibimos su pago de <strong>USD ${Number(order.total_usd).toFixed(2)}</strong> para la revisión de DGD.</p>
                <p><strong>Folio:</strong> ${esc(order.reference as string)}</p>
                <p style="color:#374151;font-size:14px;">El siguiente paso es cargar su DGD, fotos del embarque y, si aplica, las Fichas de Datos de Seguridad (SDS). Use el enlace a continuación:</p>
                <p style="text-align:center;margin:24px 0;">
                  <a href="${esc(uploadLink)}" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 24px;font-size:13px;font-weight:800;text-decoration:none;border-radius:3px;text-transform:uppercase;letter-spacing:0.08em;">Cargar documentos →</a>
                </p>
                <p style="color:#374151;font-size:13px;">Si el enlace no funciona, copie y pegue esta URL en su navegador:<br><span style="color:#2563eb;word-break:break-all;">${esc(uploadLink)}</span></p>
                <p style="color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:16px;">Nuestro equipo de contabilidad se pondrá en contacto para gestionar su factura (CFDI) si aplica. Los datos de facturación son un proceso separado coordinado directamente con el área contable.</p>
                <p style="color:#9ca3af;font-size:12px;margin-top:32px;">Global Gate México · ggm@globalgatemexico.com · +52 812 165 4040</p>
              </div>
            </div>` : `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><!-- ignore-value overused-font Arial -->
              <div style="background:#060e1c;padding:32px;text-align:center;">
                <img src="https://www.globalgatemexico.com/GGM-SM.png" alt="GGM" style="height:48px;" />
              </div>
              <div style="padding:32px;">
                <h2 style="color:#060e1c;">Payment confirmed</h2>
                <p>Hi ${esc(order.buyer_name as string)},</p>
                <p>We received your payment of <strong>USD ${Number(order.total_usd).toFixed(2)}</strong> for the DGD review.</p>
                <p><strong>Reference:</strong> ${esc(order.reference as string)}</p>
                <p style="color:#374151;font-size:14px;">The next step is to upload your DGD, shipment photos and, if applicable, Safety Data Sheets (SDS). Use the link below:</p>
                <p style="text-align:center;margin:24px 0;">
                  <a href="${esc(uploadLink)}" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 24px;font-size:13px;font-weight:800;text-decoration:none;border-radius:3px;text-transform:uppercase;letter-spacing:0.08em;">Upload documents →</a>
                </p>
                <p style="color:#374151;font-size:13px;">If the link does not work, copy and paste this URL into your browser:<br><span style="color:#2563eb;word-break:break-all;">${esc(uploadLink)}</span></p>
                <p style="color:#9ca3af;font-size:12px;margin-top:32px;">Global Gate México · ggm@globalgatemexico.com · +52 812 165 4040</p>
              </div>
            </div>`,
        }),
      }).catch(e => console.error('[capture-precheck-order] client email error:', e))

      console.log('[capture-precheck-order] Order marked paid:', order.reference)
    } else {
      console.log('[capture-precheck-order] Order already past pending_payment, skipping email:', order.reference)
    }

    return json({ success: true, reference: order.reference, orderId: order.id })
  } catch (err) {
    console.error('[capture-precheck-order]', err)
    return json({ error: 'Error al procesar la solicitud. Intente de nuevo.' }, 500)
  }
})
