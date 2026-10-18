import { createClient } from 'npm:@supabase/supabase-js@2';

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

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRole) return json({ error: 'Service configuration error' }, 500, origin);
  const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

  let orderId: string | null = null;
  try {
    const body = await req.json();
    const participants = Array.isArray(body.participants) ? body.participants : [];
    const referralCode = String(body.referralCode ?? '').trim().toUpperCase();
    const rawAttribution = body.attribution && typeof body.attribution === 'object' ? body.attribution : {};
    const marketingAttribution = Object.fromEntries(
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].flatMap((key) => {
        const value = String(rawAttribution[key] ?? '').trim().slice(0, 160);
        return value ? [[key, value]] : [];
      }),
    );

    if (referralCode && !/^[A-Z0-9][A-Z0-9-]{0,31}$/.test(referralCode)) {
      return json({ error: 'Referral code is not valid' }, 400, origin);
    }

    if (referralCode) {
      const { data: referral, error: referralError } = await admin
        .from('training_referral_codes')
        .select('code')
        .eq('code', referralCode)
        .eq('is_active', true)
        .maybeSingle();
      if (referralError) throw referralError;
      if (!referral) return json({ error: 'Referral code is not recognized. Please check the code or leave the field blank.' }, 400, origin);
    }

    const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (!turnstileSecret || !body.turnstileToken) return json({ error: 'Security verification is required' }, 400, origin);
    const verificationBody = new FormData();
    verificationBody.append('secret', turnstileSecret);
    verificationBody.append('response', String(body.turnstileToken));
    const clientIp = req.headers.get('cf-connecting-ip');
    if (clientIp) verificationBody.append('remoteip', clientIp);
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: verificationBody });
    const verification = await verificationResponse.json();
    if (!verification.success) return json({ error: 'Security verification failed. Please try again.' }, 400, origin);

    const { data: reserved, error: reserveError } = await admin.rpc('reserve_training_order', {
      p_course_id: String(body.courseId ?? ''),
      p_cohort_code: String(body.cohortCode ?? ''),
      p_buyer_name: String(body.buyer?.name ?? ''),
      p_buyer_email: String(body.buyer?.email ?? ''),
      p_buyer_phone: String(body.buyer?.phone ?? ''),
      p_company_name: String(body.buyer?.company ?? ''),
      p_billing_country: String(body.buyer?.country ?? 'CA'),
      p_participants: participants,
    });
    if (reserveError) return json({ error: reserveError.message }, 400, origin);

    orderId = reserved.id;
    const { data: secureOrder, error: secureOrderError } = await admin
      .from('training_orders')
      .update({
        referral_code: referralCode || null,
        marketing_attribution: marketingAttribution,
        updated_at: new Date().toISOString(),
      })
      .select('checkout_session_token')
      .eq('id', reserved.id)
      .single();
    if (secureOrderError || !secureOrder) throw new Error('Unable to secure checkout session');
    const token = await paypalAccessToken();
    const siteOrigin = 'https://www.globalgatemexico.com';
    const unitAmount = (reserved.unit_amount_cents / 100).toFixed(2);
    const subtotal = (reserved.subtotal_cents / 100).toFixed(2);
    const tax = (reserved.tax_cents / 100).toFixed(2);
    const total = (reserved.total_cents / 100).toFixed(2);

    const paypalResponse = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': reserved.id,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: reserved.id,
          custom_id: reserved.id,
          invoice_id: reserved.reference,
          description: reserved.course_title,
          amount: {
            currency_code: reserved.currency,
            value: total,
            breakdown: {
              item_total: { currency_code: reserved.currency, value: subtotal },
              tax_total: { currency_code: reserved.currency, value: tax },
            },
          },
          items: [{
            name: reserved.course_title,
            description: `${reserved.cohort_code} · live virtual training`,
            unit_amount: { currency_code: reserved.currency, value: unitAmount },
            quantity: String(reserved.seats),
            category: 'DIGITAL_GOODS',
            tax: { currency_code: reserved.currency, value: '0.00' },
          }],
        }],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: 'Global Gate México',
              user_action: 'PAY_NOW',
              shipping_preference: 'NO_SHIPPING',
              return_url: `${siteOrigin}/training/enrollment/complete?session=${secureOrder.checkout_session_token}`,
              cancel_url: `${siteOrigin}/training/enrollment?cancelled=true`,
            },
          },
        },
      }),
    });

    const paypalOrder = await paypalResponse.json();
    if (!paypalResponse.ok) throw new Error(paypalOrder?.message ?? 'Unable to create PayPal order');

    const approvalUrl = paypalOrder.links?.find((link: { rel: string }) => link.rel === 'payer-action')?.href
      ?? paypalOrder.links?.find((link: { rel: string }) => link.rel === 'approve')?.href;
    if (!approvalUrl) throw new Error('PayPal did not return an approval link');

    const { error: updateError } = await admin
      .from('training_orders')
      .update({ paypal_order_id: paypalOrder.id, updated_at: new Date().toISOString() })
      .eq('id', reserved.id);
    if (updateError) throw updateError;

    return json({ approvalUrl, reference: reserved.reference }, 200, origin);
  } catch (error) {
    if (orderId) {
      await admin.from('training_orders').update({ status: 'payment_failed', updated_at: new Date().toISOString() }).eq('id', orderId);
    }
    const message = error instanceof Error ? error.message : 'Unable to start checkout';
    return json({ error: message }, message.includes('not configured') ? 503 : 500, origin);
  }
});

