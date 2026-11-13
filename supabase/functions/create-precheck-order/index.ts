import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PAYPAL_CLIENT_ID     = Deno.env.get('PRECHECK_PAYPAL_CLIENT_ID')!
const PAYPAL_CLIENT_SECRET = Deno.env.get('PRECHECK_PAYPAL_CLIENT_SECRET')!
const PAYPAL_ENV           = Deno.env.get('PRECHECK_PAYPAL_ENV') ?? 'sandbox'
const PAYPAL_BASE          = PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'
const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY') ?? ''

const TERMS_VERSION = '2026-11-v1'
const BASE_USD      = 80.00
const MX_VAT        = 0.16
const EMAIL_RE      = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UN_RE         = /^\d{4}$/

// Class 7 exclusion list — validate against IATA DGR section 4.2
const CLASS7_UN_NUMBERS = new Set([
  'UN2908','UN2909','UN2910','UN2911','UN2912','UN2913','UN2915','UN2916','UN2917',
  'UN2919','UN2977','UN2978','UN3321','UN3322','UN3323','UN3324','UN3325','UN3326',
  'UN3327','UN3328','UN3329','UN3330','UN3331','UN3332','UN3333','UN3507',
])

// ── Allowed origins ────────────────────────────────────────────────────────
const BASE_ORIGINS = new Set([
  'https://www.globalgatemexico.com',
  'https://globalgatemexico.com',
  'http://localhost:5173',
  'http://localhost:4173',
])
const _extra = Deno.env.get('PRECHECK_EXTRA_ORIGINS') ?? ''
for (const o of _extra.split(',').map(s => s.trim()).filter(Boolean)) {
  if (!o.includes('*')) BASE_ORIGINS.add(o)
}

function corsHeaders(origin: string) {
  const allowed = BASE_ORIGINS.has(origin) ? origin : ''
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function json(data: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  })
}

function normalizeUN(raw: string): string | null {
  const stripped = raw.trim().toUpperCase().replace(/^UN/, '')
  if (!UN_RE.test(stripped)) return null
  return 'UN' + stripped
}

function isClass7(unNumber: string, hazardClass: string): boolean {
  const classNum = hazardClass?.match(/^Class\s*(\d+)/i)?.[1]
  return classNum === '7' || CLASS7_UN_NUMBERS.has(unNumber)
}

async function paypalToken(): Promise<string> {
  const creds = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)
  const res   = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:  'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error('Error de autenticación con procesador de pago')
  return (await res.json()).access_token
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  })
  return (await res.json()).success === true
}

function generateRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let r = 'PCK-'
  for (let i = 0; i < 7; i++) r += chars[Math.floor(Math.random() * chars.length)]
  return r
}

serve(async (req) => {
  const origin = req.headers.get('origin') ?? ''

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) })
  if (req.method !== 'POST')    return new Response('Method not allowed', { status: 405 })

  // ── FAIL CLOSED: Turnstile secret must be configured ──────────────────
  if (!TURNSTILE_SECRET_KEY) {
    console.error('[create-precheck-order] TURNSTILE_SECRET_KEY not configured')
    return json({ error: 'Servicio no disponible' }, 503, origin)
  }

  try {
    const body = await req.json()

    // ── Input extraction ───────────────────────────────────────────────────
    const buyer_name      = String(body.buyer_name      ?? '').trim()
    const company_name    = String(body.company_name    ?? '').trim()
    const buyer_email     = String(body.buyer_email     ?? '').trim().toLowerCase()
    const buyer_phone     = String(body.buyer_phone     ?? '').trim()
    const billing_country = String(body.billing_country ?? '').trim().toUpperCase()
    const num_packages    = Number(body.num_packages)
    const turnstileToken  = String(body.turnstileToken  ?? '')
    const accepted_terms  = body.accepted_terms === true
    const entries         = body.entries as Array<{
      un_number: string; hazard_class: string; proper_shipping_name?: string
    }>

    // ── Contact validation ─────────────────────────────────────────────────
    if (!buyer_name)   return json({ error: 'Nombre requerido' }, 400, origin)
    if (!company_name) return json({ error: 'Empresa requerida' }, 400, origin)
    if (!EMAIL_RE.test(buyer_email)) return json({ error: 'Correo electrónico inválido' }, 400, origin)
    if (!['MX','US','CA'].includes(billing_country)) {
      return json({ error: 'País de facturación inválido' }, 400, origin)
    }

    // ── Packages validation ────────────────────────────────────────────────
    if (!Number.isInteger(num_packages) || num_packages < 1 || num_packages > 5) {
      return json({ error: 'Número de bultos debe ser entre 1 y 5', code: 'EXCEEDS_LIMITS' }, 400, origin)
    }

    // ── Entries validation ─────────────────────────────────────────────────
    if (!Array.isArray(entries) || entries.length < 1 || entries.length > 5) {
      return json({ error: 'Se requiere entre 1 y 5 entradas DG', code: 'EXCEEDS_LIMITS' }, 400, origin)
    }

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i]
      if (!e || typeof e !== 'object') {
        return json({ error: `Entrada ${i + 1}: datos inválidos` }, 400, origin)
      }
      const unNorm = normalizeUN(String(e.un_number ?? ''))
      if (!unNorm) {
        return json({ error: `Entrada ${i + 1}: número UN inválido (formato esperado: UN####)` }, 400, origin)
      }
      e.un_number = unNorm  // normalize in-place for class7 check below
      if (!e.hazard_class || typeof e.hazard_class !== 'string' || !e.hazard_class.trim()) {
        return json({ error: `Entrada ${i + 1}: clase de peligro requerida` }, 400, origin)
      }
    }

    // ── Class 7 check ──────────────────────────────────────────────────────
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i]
      if (isClass7(e.un_number, e.hazard_class)) {
        return json({ error: 'Clase 7 no cubierta / Class 7 not covered', code: 'CLASS7_EXCLUDED' }, 422, origin)
      }
    }

    // ── Terms acceptance ───────────────────────────────────────────────────
    if (!accepted_terms) {
      return json({ error: 'Debe aceptar los términos del servicio' }, 400, origin)
    }

    // ── Turnstile verification ─────────────────────────────────────────────
    if (!turnstileToken) return json({ error: 'Verificación requerida' }, 400, origin)
    const ip = req.headers.get('x-real-ip') ?? req.headers.get('cf-connecting-ip') ?? ''
    const tsOk = await verifyTurnstile(turnstileToken, ip)
    if (!tsOk) return json({ error: 'Verificación de seguridad fallida. Intente de nuevo.' }, 400, origin)

    // ── Pricing ────────────────────────────────────────────────────────────
    const isMX       = billing_country === 'MX'
    const tax_rate   = isMX ? MX_VAT : 0
    const tax_amount = +(BASE_USD * tax_rate).toFixed(2)
    const total_usd  = +(BASE_USD + tax_amount).toFixed(2)

    // ── PayPal order creation ──────────────────────────────────────────────
    const accessToken = await paypalToken()
    const ppRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer':       'return=representation',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'USD', value: total_usd.toFixed(2) },
          description: `GGM DG Pre-Check — ${company_name}`,
        }],
        application_context: {
          brand_name:   'Global Gate México',
          landing_page: 'NO_PREFERENCE',
          user_action:  'PAY_NOW',
        },
      }),
    })

    const ppData = await ppRes.json()
    if (!ppRes.ok) {
      console.error('[create-precheck-order] PayPal order creation error:', ppData)
      return json({ error: 'Error al crear orden de pago' }, 500, origin)
    }

    const ppOrderId   = ppData.id as string
    const approveLink = (ppData.links as Array<{ rel: string; href: string }>)
      .find(l => l.rel === 'approve')?.href

    if (!approveLink) {
      console.error('[create-precheck-order] No approve link in PayPal response')
      return json({ error: 'Error al obtener enlace de pago' }, 500, origin)
    }

    // ── Save order to database ─────────────────────────────────────────────
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    let reference  = generateRef()

    // Retry on unique reference collision (extremely unlikely)
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: order, error: insertErr } = await supabase
        .from('dg_precheck_orders')
        .insert({
          reference,
          buyer_name,
          company_name,
          buyer_email,
          buyer_phone: buyer_phone || null,
          billing_country,
          num_packages,
          accepted_terms_at: new Date().toISOString(),
          terms_version:     TERMS_VERSION,
          amount_usd:        BASE_USD,
          tax_rate,
          tax_amount_usd:    tax_amount,
          total_usd,
          currency:          'USD',
          paypal_order_id:   ppOrderId,
          utm_source:        body.utm_source   || null,
          utm_medium:        body.utm_medium   || null,
          utm_campaign:      body.utm_campaign || null,
        })
        .select('id, checkout_session_token')
        .single()

      if (insertErr?.code === '23505') {
        reference = generateRef()
        continue
      }
      if (insertErr || !order) {
        console.error('[create-precheck-order] order insert error:', insertErr)
        return json({ error: 'Error al registrar la orden' }, 500, origin)
      }

      // ── Save DG entries ──────────────────────────────────────────────────
      const entryRows = entries.map((e, idx) => ({
        order_id:             order.id,
        line_no:              idx + 1,
        un_number:            e.un_number,
        hazard_class:         e.hazard_class.trim(),
        proper_shipping_name: e.proper_shipping_name?.trim() || null,
      }))

      const { error: entriesErr } = await supabase
        .from('dg_precheck_entries')
        .insert(entryRows)

      if (entriesErr) {
        console.error('[create-precheck-order] entries insert error:', entriesErr)
        return json({ error: 'Error al registrar entradas DG' }, 500, origin)
      }

      return json({
        approveUrl:   approveLink,
        sessionToken: order.checkout_session_token,
        reference,
        totalUsd:     total_usd,
      }, 200, origin)
    }

    return json({ error: 'Error al generar referencia. Intente de nuevo.' }, 500, origin)
  } catch (err) {
    console.error('[create-precheck-order]', err)
    return json({ error: 'Error al procesar la solicitud. Intente de nuevo.' }, 500, origin)
  }
})
