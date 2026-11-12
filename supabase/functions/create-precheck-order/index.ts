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
// FAIL CLOSED: must be explicitly configured — no bypass when missing.
// For local dev or staging use Cloudflare's official test secret:
//   1x0000000000000000000000000000000AA  (always passes)
//   2x0000000000000000000000000000000AB  (always fails — use to test rejection)
// Matching site keys:
//   1x00000000000000000000AA  (always passes)
//   2x00000000000000000000AB  (always fails)
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY') ?? ''

const BASE_USD = 80.00
const MX_VAT   = 0.16

// Return/cancel URLs are built from the request Origin. Only allow our own domains.
// Extend with PRECHECK_EXTRA_ORIGINS (comma-separated, no wildcards).
const _extraOriginsRaw = Deno.env.get('PRECHECK_EXTRA_ORIGINS') ?? ''
const _extraOrigins    = _extraOriginsRaw
  .split(',')
  .map(o => o.trim())
  .filter(o => o && !o.includes('*'))  // wildcards are never accepted

const ALLOWED_ORIGINS = new Set([
  'https://www.globalgatemexico.com',
  'https://globalgatemexico.com',
  'https://staging.globalgatemexico.com',
  ..._extraOrigins,
])

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  if (!res.ok) {
    console.error('[create-precheck-order] PayPal auth error:', data)
    throw new Error('Error de autenticación con procesador de pago')
  }
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
      turnstile_token,
    } = body

    // ── 1. Required fields ──────────────────────────────────────────────────
    if (!buyer_name || !buyer_email || !company_name || !origin || !destination) {
      return json({ error: 'Faltan campos requeridos' }, 400)
    }
    if (!['MX', 'US', 'CA'].includes(billing_country)) {
      return json({ error: 'País de facturación no válido' }, 400)
    }

    // ── 1b. Format and length validation ───────────────────────────────────
    if (!EMAIL_RE.test(buyer_email)) {
      return json({ error: 'Correo electrónico no válido' }, 400)
    }
    if (String(buyer_name).length  > 200) return json({ error: 'Nombre demasiado largo' }, 400)
    if (String(buyer_email).length > 254) return json({ error: 'Correo demasiado largo' }, 400)
    if (String(company_name).length > 200) return json({ error: 'Empresa demasiado larga' }, 400)
    if (buyer_phone && String(buyer_phone).length > 50) return json({ error: 'Teléfono demasiado largo' }, 400)
    if (String(origin).length      > 200) return json({ error: 'Origen demasiado largo' }, 400)
    if (String(destination).length > 200) return json({ error: 'Destino demasiado largo' }, 400)
    if (cargo_description && String(cargo_description).length > 2000) {
      return json({ error: 'Descripción demasiado larga' }, 400)
    }

    const pkgs = Number(num_packages)
    const dges = Number(num_dg_entries)
    if (!Number.isInteger(pkgs) || pkgs < 1 || pkgs > 5) {
      return json({ error: 'Número de bultos fuera del límite del servicio', code: 'EXCEEDS_LIMITS' }, 400)
    }
    if (!Number.isInteger(dges) || dges < 1 || dges > 5) {
      return json({ error: 'Número de entradas DG fuera del límite del servicio', code: 'EXCEEDS_LIMITS' }, 400)
    }

    // ── 2. Cloudflare Turnstile anti-spam (FAIL CLOSED) ────────────────────
    // TURNSTILE_SECRET_KEY must be set — requests are rejected if it is missing.
    if (!TURNSTILE_SECRET_KEY) {
      console.error('[create-precheck-order] TURNSTILE_SECRET_KEY not configured — rejecting')
      return json({ error: 'Servicio no disponible temporalmente. Contacte soporte.' }, 503)
    }
    if (!turnstile_token) {
      return json({ error: 'Verificación de seguridad requerida' }, 400)
    }
    const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: turnstile_token }),
    })
    const tsData = await tsRes.json() as { success: boolean }
    if (!tsData.success) {
      console.error('[create-precheck-order] Turnstile failed')
      return json({ error: 'Verificación de seguridad fallida. Recarga la página e intenta de nuevo.' }, 403)
    }

    // ── 3. Origin validation for return/cancel URLs ─────────────────────────
    const reqOrigin = req.headers.get('origin') ?? ''
    // Allow localhost for local dev; in production only allowed origins are accepted.
    const isAllowedOrigin = ALLOWED_ORIGINS.has(reqOrigin) ||
      reqOrigin.startsWith('http://localhost:') ||
      reqOrigin.startsWith('http://127.0.0.1:')

    if (reqOrigin && !isAllowedOrigin) {
      console.error('[create-precheck-order] Rejected origin:', reqOrigin)
      return json({ error: 'Origin no permitido' }, 403)
    }

    // Fall back to production URL only when no origin header (e.g. server-to-server tests)
    const baseUrl = isAllowedOrigin ? reqOrigin : 'https://www.globalgatemexico.com'

    // ── 4. Tax calculation (server-side only) ───────────────────────────────
    const taxApplies  = billing_country === 'MX' || !!has_mx_establishment
    const taxRate     = taxApplies ? MX_VAT : 0
    const taxAmount   = Math.round(BASE_USD * taxRate * 100) / 100
    const total       = Math.round((BASE_USD + taxAmount) * 100) / 100

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // ── 5. Unique reference ────────────────────────────────────────────────
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

    // ── 6. Create PayPal order ─────────────────────────────────────────────
    const accessToken = await paypalToken()
    const returnUrl   = `${baseUrl}/dg-pre-check/complete?session=${order.checkout_session_token}`
    const cancelUrl   = `${baseUrl}/dg-pre-check?cancelled=true`

    const ppRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization:       `Bearer ${accessToken}`,
        'Content-Type':      'application/json',
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
    if (!ppRes.ok) {
      console.error('[create-precheck-order] PayPal order creation error:', ppData)
      throw new Error('Error al crear la orden de pago. Intente de nuevo.')
    }

    await supabase
      .from('dg_precheck_orders')
      .update({ paypal_order_id: ppData.id })
      .eq('id', order.id)

    const approvalUrl = ppData.links?.find((l: { rel: string }) => l.rel === 'payer-action')?.href
    if (!approvalUrl) throw new Error('No approval URL from PayPal')

    return json({ approvalUrl, reference, orderId: order.id })
  } catch (err) {
    console.error('[create-precheck-order]', err)
    // Never expose internal/PayPal details to the client
    return json({ error: 'Error al procesar la solicitud. Intente de nuevo.' }, 500)
  }
})
