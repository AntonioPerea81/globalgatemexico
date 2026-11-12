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

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  try {
    if (!PAYPAL_WEBHOOK_ID) {
      console.error('[paypal-webhook-precheck] PRECHECK_PAYPAL_WEBHOOK_ID not configured')
      return new Response('Webhook not configured', { status: 503 })
    }

    // Read body as text first (needed for signature verification)
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

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    })

    // ── Deduplication: insert event ID into a dedicated log ─────────────────
    const eventId   = event.id as string
    const eventType = event.event_type as string
    const { error: eventError } = await admin.from('paypal_precheck_webhook_events').insert({
      event_id:   eventId,
      event_type: eventType,
      payload:    event,
    })
    // 23505 = unique_violation (duplicate event)
    if (eventError && eventError.code !== '23505') {
      console.error('[paypal-webhook-precheck] Event log insert error:', eventError)
      // Non-fatal: continue processing but log
    }
    if (eventError?.code === '23505') {
      console.log('[paypal-webhook-precheck] Duplicate event, skipping:', eventId)
      return new Response('Already processed', { status: 200 })
    }

    // ── Handle PAYMENT.CAPTURE.COMPLETED ────────────────────────────────────
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource    = event.resource as Record<string, unknown>
      const captureId   = resource.id as string
      const ppOrderId   = (resource.supplementary_data as Record<string, unknown>)
        ?.related_ids?.order_id as string | undefined

      if (!ppOrderId) {
        console.warn('[paypal-webhook-precheck] No order_id in event resource')
        return new Response('OK', { status: 200 })
      }

      const { data: order } = await admin
        .from('dg_precheck_orders')
        .select('id, reference, status, total_usd, currency, buyer_email, buyer_name, billing_country')
        .eq('paypal_order_id', ppOrderId)
        .single()

      if (!order) {
        // This event is not for a DG Pre-Check order — ignore silently.
        return new Response('OK', { status: 200 })
      }

      if (order.status === 'paid') {
        // Already captured via return_url flow — idempotent skip.
        return new Response('Already captured', { status: 200 })
      }

      // Verify amount and currency match the stored order.
      const capturedAmount   = Number((resource.amount as Record<string, string>)?.value ?? 0)
      const capturedCurrency = (resource.amount as Record<string, string>)?.currency_code
      const expectedAmount   = Number(order.total_usd)

      if (Math.abs(capturedAmount - expectedAmount) > 0.01) {
        console.error('[paypal-webhook-precheck] Amount mismatch:', capturedAmount, 'expected', expectedAmount)
        return new Response('Amount mismatch', { status: 200 }) // 200 to stop PayPal retries
      }
      if (capturedCurrency !== 'USD') {
        console.error('[paypal-webhook-precheck] Currency mismatch:', capturedCurrency)
        return new Response('Currency mismatch', { status: 200 })
      }

      await admin.from('dg_precheck_orders').update({
        status:            'paid',
        paypal_capture_id: captureId,
        paid_at:           (resource.create_time as string) ?? new Date().toISOString(),
      }).eq('id', order.id)

      // Send confirmation email to client (backup path — primary is capture-precheck-order)
      const isMX = order.billing_country === 'MX'
      await fetch('https://api.resend.com/emails', {
        method:  'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    'GGM Pre-Check <noreply@globalgatemexico.com>',
          to:      [order.buyer_email as string],
          subject: isMX
            ? `✓ Pago confirmado — Folio ${order.reference} | GGM DG Pre-Check`
            : `✓ Payment confirmed — Reference ${order.reference} | GGM DG Pre-Check`,
          html: isMX
            ? `<p>Hola ${order.buyer_name as string},</p><p>Confirmamos su pago de USD ${Number(order.total_usd).toFixed(2)} (folio ${order.reference}). Por favor cargue su DGD y fotos desde la página de confirmación o contáctenos a ggm@globalgatemexico.com.</p>`
            : `<p>Hi ${order.buyer_name as string},</p><p>Your payment of USD ${Number(order.total_usd).toFixed(2)} for reference ${order.reference} is confirmed. Please upload your DGD and photos from the confirmation page, or email us at ggm@globalgatemexico.com.</p>`,
        }),
      }).catch(e => console.error('[paypal-webhook-precheck] email error:', e))
    }

    // ── Handle PAYMENT.CAPTURE.REFUNDED ─────────────────────────────────────
    if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      const resource  = event.resource as Record<string, unknown>
      const ppOrderId = (resource.supplementary_data as Record<string, unknown>)
        ?.related_ids?.order_id as string | undefined

      if (ppOrderId) {
        await admin.from('dg_precheck_orders')
          .update({ status: 'refunded' })
          .eq('paypal_order_id', ppOrderId)
      }
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('[paypal-webhook-precheck]', err)
    return new Response('Webhook processing failed', { status: 500 })
  }
})
