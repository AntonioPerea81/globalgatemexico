import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendTrainingPaymentEmails } from '../_shared/training-payment-emails.ts';

const allowedOrigins = new Set(['https://www.globalgatemexico.com', 'https://globalgatemexico.com']);
const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : 'https://www.globalgatemexico.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Vary': 'Origin',
});
const json = (body: unknown, status = 200, origin: string | null = null) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
});
const paypalBaseUrl = () => Deno.env.get('PAYPAL_ENV') === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function paypalAccessToken() {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  if (!clientId || !clientSecret) throw new Error('PayPal Sandbox is not configured yet');
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
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin);
  if (!origin || !allowedOrigins.has(origin)) return json({ error: 'Origin not allowed' }, 403, origin);

  try {
    const { paypalOrderId, sessionToken } = await req.json();
    if (!paypalOrderId || !sessionToken) return json({ error: 'Missing secure checkout reference' }, 400, origin);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } },
    );
    const { data: order, error: orderError } = await admin
      .from('training_orders')
      .select('id, reference, status, total_cents, currency, hold_expires_at')
      .eq('paypal_order_id', paypalOrderId)
      .eq('checkout_session_token', sessionToken)
      .single();
    if (orderError || !order) return json({ error: 'Enrollment order not found' }, 404, origin);
    if (order.status === 'paid') {
      try {
        await sendTrainingPaymentEmails(admin, order.id);
      } catch (emailError) {
        console.error('Payment email delivery failed', emailError);
      }
      return json({ status: 'COMPLETED', reference: order.reference }, 200, origin);
    }
    if (order.status !== 'pending_payment' || new Date(order.hold_expires_at).getTime() < Date.now()) {
      return json({ error: 'This seat reservation has expired' }, 409, origin);
    }

    const token = await paypalAccessToken();
    const response = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `capture-${order.id}`,
      },
      body: '{}',
    });
    const capture = await response.json();
    if (!response.ok) return json({ error: capture?.message ?? 'Payment could not be captured' }, 400, origin);

    const payment = capture.purchase_units?.[0]?.payments?.captures?.[0];
    const amountCents = Math.round(Number(payment?.amount?.value ?? 0) * 100);
    if (capture.status !== 'COMPLETED' || payment?.status !== 'COMPLETED' || amountCents !== order.total_cents || payment?.amount?.currency_code !== order.currency) {
      return json({ error: 'Payment verification failed' }, 400, origin);
    }

    const { error: updateError } = await admin.from('training_orders').update({
      status: 'paid',
      paypal_capture_id: payment.id,
      paid_at: new Date().toISOString(),
      hold_expires_at: null,
      updated_at: new Date().toISOString(),
    }).eq('id', order.id).eq('status', 'pending_payment');
    if (updateError) throw updateError;

    try {
      await sendTrainingPaymentEmails(admin, order.id);
    } catch (emailError) {
      console.error('Payment email delivery failed', emailError);
    }

    return json({ status: 'COMPLETED', reference: order.reference }, 200, origin);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unable to confirm payment' }, 500, origin);
  }
});

