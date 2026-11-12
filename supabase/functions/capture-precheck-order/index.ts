import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PAYPAL_CLIENT_ID     = Deno.env.get('PAYPAL_CLIENT_ID')!
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')!
const PAYPAL_ENV           = Deno.env.get('PAYPAL_ENV') ?? 'sandbox'
const PAYPAL_BASE          = PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'
const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!

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

async function paypalToken(): Promise<string> {
  const creds = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)
  const res   = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:  'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`PayPal auth failed`)
  return data.access_token
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const body          = await req.json()
    const sessionToken  = body.sessionToken as string
    const paypalOrderId = body.paypalOrderId as string   // the `token` param PayPal appends

    if (!sessionToken) return json({ error: 'sessionToken requerido' }, 400)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const { data: order, error: fetchErr } = await supabase
      .from('dg_precheck_orders')
      .select('*')
      .eq('checkout_session_token', sessionToken)
      .single()

    if (fetchErr || !order) return json({ error: 'Sesión no encontrada' }, 404)
    if (order.status === 'paid') {
      // Idempotent: already captured
      return json({ success: true, reference: order.reference, orderId: order.id, alreadyCaptured: true })
    }
    if (order.status !== 'pending_payment') {
      return json({ error: `Estado inválido: ${order.status}` }, 400)
    }

    // Use paypalOrderId from client, or fall back to what we stored
    const ppOrderId = paypalOrderId || order.paypal_order_id
    if (!ppOrderId) return json({ error: 'PayPal order ID no disponible' }, 400)

    const accessToken = await paypalToken()
    const captureRes  = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${ppOrderId}/capture`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `capture-${order.id}`,
      },
    })

    const captureData = await captureRes.json()
    if (!captureRes.ok) throw new Error(`PayPal capture failed: ${JSON.stringify(captureData)}`)

    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id

    await supabase
      .from('dg_precheck_orders')
      .update({
        status:            'paid',
        paypal_order_id:   ppOrderId,
        paypal_capture_id: captureId ?? null,
        paid_at:           new Date().toISOString(),
      })
      .eq('id', order.id)

    // Confirmation email to client
    const isMX = order.billing_country === 'MX'
    await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:    'GGM Pre-Check <noreply@globalgatemexico.com>',
        to:      [order.buyer_email],
        subject: isMX
          ? `✓ Pago recibido — Folio ${order.reference} | GGM DG Pre-Check`
          : `✓ Payment received — Reference ${order.reference} | GGM DG Pre-Check`,
        html: isMX ? `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#060e1c;padding:32px;text-align:center;">
              <img src="https://www.globalgatemexico.com/GGM-SM.png" alt="GGM" style="height:48px;" />
            </div>
            <div style="padding:32px;">
              <h2 style="color:#060e1c;">Pago confirmado</h2>
              <p>Hola ${order.buyer_name},</p>
              <p>Recibimos su pago de <strong>USD ${order.total_usd.toFixed(2)}</strong> para la revisión de DGD.</p>
              <p><strong>Folio:</strong> ${order.reference}</p>
              <p style="color:#374151;font-size:14px;">El siguiente paso es cargar su DGD y las fotografías del embarque. Use el enlace que aparece en la página de confirmación para acceder al formulario de carga.</p>
              <p style="color:#374151;font-size:14px;">Si cerró esa página, escríbanos a <a href="mailto:ggm@globalgatemexico.com">ggm@globalgatemexico.com</a> indicando su folio y le enviaremos el acceso.</p>
              <p style="color:#6b7280;font-size:12px;margin-top:32px;">Global Gate México · +52 812 165 4040</p>
            </div>
          </div>` : `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#060e1c;padding:32px;text-align:center;">
              <img src="https://www.globalgatemexico.com/GGM-SM.png" alt="GGM" style="height:48px;" />
            </div>
            <div style="padding:32px;">
              <h2 style="color:#060e1c;">Payment confirmed</h2>
              <p>Hi ${order.buyer_name},</p>
              <p>We received your payment of <strong>USD ${order.total_usd.toFixed(2)}</strong> for the DGD review.</p>
              <p><strong>Reference:</strong> ${order.reference}</p>
              <p style="color:#374151;font-size:14px;">The next step is to upload your DGD and shipment photos. Use the link on the confirmation page to access the upload form.</p>
              <p style="color:#374151;font-size:14px;">If you closed that page, email us at <a href="mailto:ggm@globalgatemexico.com">ggm@globalgatemexico.com</a> with your reference number and we will send you a new link.</p>
              <p style="color:#6b7280;font-size:12px;margin-top:32px;">Global Gate México · +52 812 165 4040</p>
            </div>
          </div>`,
      }),
    }).catch((e) => console.error('[capture-precheck-order] email error:', e))

    return json({ success: true, reference: order.reference, orderId: order.id })
  } catch (err) {
    console.error('[capture-precheck-order]', err)
    return json({ error: err instanceof Error ? err.message : 'Error interno' }, 500)
  }
})
