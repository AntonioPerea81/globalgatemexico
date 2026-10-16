import { createClient } from 'npm:@supabase/supabase-js@2';

const paypalBaseUrl = () => Deno.env.get('PAYPAL_ENV') === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function paypalAccessToken() {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  if (!clientId || !clientSecret) throw new Error('PayPal is not configured');
  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!response.ok) throw new Error('Unable to authenticate with PayPal');
  return (await response.json()).access_token as string;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const event = await req.json();
    const webhookId = Deno.env.get('PAYPAL_WEBHOOK_ID');
    if (!webhookId) throw new Error('PayPal webhook is not configured');
    const token = await paypalAccessToken();

    const verification = await fetch(`${paypalBaseUrl()}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo: req.headers.get('paypal-auth-algo'),
        cert_url: req.headers.get('paypal-cert-url'),
        transmission_id: req.headers.get('paypal-transmission-id'),
        transmission_sig: req.headers.get('paypal-transmission-sig'),
        transmission_time: req.headers.get('paypal-transmission-time'),
        webhook_id: webhookId,
        webhook_event: event,
      }),
    });
    const verified = await verification.json();
    if (!verification.ok || verified.verification_status !== 'SUCCESS') {
      return new Response('Invalid signature', { status: 401 });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } },
    );
    const { error: eventError } = await admin.from('paypal_webhook_events').insert({
      event_id: event.id,
      event_type: event.event_type,
      payload: event,
    });
    if (eventError?.code === '23505') return new Response('Already processed', { status: 200 });
    if (eventError) throw eventError;

    const paypalOrderId = event.resource?.supplementary_data?.related_ids?.order_id;
    if (paypalOrderId && event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const amountCents = Math.round(Number(event.resource?.amount?.value ?? 0) * 100);
      const { data: order } = await admin.from('training_orders')
        .select('id, total_cents, currency')
        .eq('paypal_order_id', paypalOrderId)
        .single();
      if (order && amountCents === order.total_cents && event.resource?.amount?.currency_code === order.currency) {
        await admin.from('training_orders').update({
          status: 'paid',
          paypal_capture_id: event.resource.id,
          paid_at: event.resource.create_time ?? new Date().toISOString(),
          hold_expires_at: null,
          updated_at: new Date().toISOString(),
        }).eq('id', order.id);
      }
    }
    if (paypalOrderId && event.event_type === 'PAYMENT.CAPTURE.REFUNDED') {
      await admin.from('training_orders').update({ status: 'refunded', updated_at: new Date().toISOString() })
        .eq('paypal_order_id', paypalOrderId);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Webhook processing failed', { status: 500 });
  }
});

