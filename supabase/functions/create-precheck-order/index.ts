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

const BASE_USD  = 80.00
const MX_VAT    = 0.16

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
  if (!res.ok) throw new Error(`PayPal auth failed: ${JSON.stringify(data)}`)
  return data.access_token
}

function genRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'PCK-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const body = await req.json()
    const {
      buyer_name, buyer_email, buyer_phone, company_name,
      billing_country, has_mx_establishment,
      rfc, razon_social, regimen_fiscal, codigo_postal_fiscal, uso_cfdi,
      origin, destination, num_packages, num_dg_entries, cargo_description,
      utm_source, utm_medium, utm_campaign,
    } = body

    if (!buyer_name || !buyer_email || !company_name || !origin || !destination) {
      return json({ error: 'Faltan campos requeridos' }, 400)
    }
    if (!['MX', 'US', 'CA'].includes(billing_country)) {
      return json({ error: 'País de facturación no válido' }, 400)
    }

    const pkgs = Number(num_packages)
    const dges = Number(num_dg_entries)
    if (!Number.isInteger(pkgs) || pkgs < 1 || pkgs > 5) {
      return json({ error: 'Número de bultos fuera del límite del servicio', code: 'EXCEEDS_LIMITS' }, 400)
    }
    if (!Number.isInteger(dges) || dges < 1 || dges > 5) {
      return json({ error: 'Número de entradas DG fuera del límite del servicio', code: 'EXCEEDS_LIMITS' }, 400)
    }

    const taxApplies  = billing_country === 'MX' || !!has_mx_establishment
    const taxRate     = taxApplies ? MX_VAT : 0
    const taxAmount   = Math.round(BASE_USD * taxRate * 100) / 100
    const total       = Math.round((BASE_USD + taxAmount) * 100) / 100

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Unique reference
    let reference = ''
    for (let i = 0; i < 10; i++) {
      const candidate = genRef()
      const { data } = await supabase.from('dg_precheck_orders').select('id').eq('reference', candidate).maybeSingle()
      if (!data) { reference = candidate; break }
    }
    if (!reference) throw new Error('No se pudo generar referencia única')

    const { data: order, error: insertErr } = await supabase
      .from('dg_precheck_orders')
      .insert({
        reference,
        buyer_name, buyer_email, buyer_phone: buyer_phone || null, company_name,
        billing_country, has_mx_establishment: !!has_mx_establishment,
        rfc: rfc || null, razon_social: razon_social || null,
        regimen_fiscal: regimen_fiscal || null,
        codigo_postal_fiscal: codigo_postal_fiscal || null,
        uso_cfdi: uso_cfdi || null,
        origin, destination,
        num_packages: pkgs, num_dg_entries: dges,
        cargo_description: cargo_description || null,
        amount_usd: BASE_USD, tax_rate: taxRate,
        tax_amount_usd: taxAmount, total_usd: total,
        utm_source: utm_source || null, utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        status: 'pending_payment',
      })
      .select('id, checkout_session_token')
      .single()

    if (insertErr) throw insertErr

    const accessToken = await paypalToken()
    const reqOrigin   = req.headers.get('origin') ?? 'https://globalgatemexico.com'
    const returnUrl   = `${reqOrigin}/dg-pre-check/complete?session=${order.checkout_session_token}`
    const cancelUrl   = `${reqOrigin}/dg-pre-check?cancelled=true`

    const ppRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization:    `Bearer ${accessToken}`,
        'Content-Type':   'application/json',
        'PayPal-Request-Id': order.id,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: reference,
          description:  `GGM DG Pre-Check — ${reference}`,
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: BASE_USD.toFixed(2) },
              tax_total:  { currency_code: 'USD', value: taxAmount.toFixed(2) },
            },
          },
          items: [{
            name:        'DG Pre-Check Review Service',
            description: `${pkgs} pkg · ${dges} DG entries`,
            unit_amount: { currency_code: 'USD', value: BASE_USD.toFixed(2) },
            tax:         { currency_code: 'USD', value: taxAmount.toFixed(2) },
            quantity:    '1',
            category:    'DIGITAL_GOODS',
          }],
        }],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              locale:               'en-US',
              shipping_preference:  'NO_SHIPPING',
              user_action:          'PAY_NOW',
              return_url:           returnUrl,
              cancel_url:           cancelUrl,
            },
          },
        },
      }),
    })

    const ppData = await ppRes.json()
    if (!ppRes.ok) throw new Error(`PayPal order error: ${JSON.stringify(ppData)}`)

    await supabase
      .from('dg_precheck_orders')
      .update({ paypal_order_id: ppData.id })
      .eq('id', order.id)

    const approvalUrl = ppData.links?.find((l: { rel: string }) => l.rel === 'payer-action')?.href
    if (!approvalUrl) throw new Error('No approval URL from PayPal')

    return json({ approvalUrl, reference, orderId: order.id })
  } catch (err) {
    console.error('[create-precheck-order]', err)
    return json({ error: err instanceof Error ? err.message : 'Error interno' }, 500)
  }
})
