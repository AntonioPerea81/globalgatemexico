/**
 * precheck-order-action
 *
 * Secure action endpoint for staff operations on Pre-Check orders.
 * Currently supports action="report_sent": marks an order docs_received → report_sent.
 *
 * Token format: base64url(payload).base64url(hmac-sha256-signature)
 * Payload: JSON { order_id: string, action: string, exp: number }
 * Signed with PRECHECK_ACTION_SECRET using HMAC-SHA256.
 *
 * FAIL CLOSED: PRECHECK_ACTION_SECRET must be configured; missing = 503.
 * GET: read-only preview (reference, company, current status). Never mutates.
 * POST { token, confirm: false }: same read-only preview (safe for link preloads).
 * POST { token, confirm: true }: executes the action if order is in eligible state.
 * Idempotent: re-confirming an already-report_sent order returns success.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function base64urlDecode(s: string): Uint8Array {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(s.length + (4 - s.length % 4) % 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, c => c.charCodeAt(0))
}

function bufToBase64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Constant-time comparison to prevent timing attacks
async function safeCompare(a: string, b: string): Promise<boolean> {
  const enc  = new TextEncoder()
  const aKey = await crypto.subtle.importKey('raw', enc.encode(a), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const bKey = await crypto.subtle.importKey('raw', enc.encode(b), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const nonce = crypto.getRandomValues(new Uint8Array(32))
  const sigA  = new Uint8Array(await crypto.subtle.sign('HMAC', aKey, nonce))
  const sigB  = new Uint8Array(await crypto.subtle.sign('HMAC', bKey, nonce))
  if (sigA.length !== sigB.length) return false
  let diff = 0
  for (let i = 0; i < sigA.length; i++) diff |= sigA[i] ^ sigB[i]
  return diff === 0
}

async function verifyToken(
  token: string,
  secret: string
): Promise<{ order_id: string; action: string; exp: number } | null> {
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sigB64] = parts

  // Recompute expected signature
  const keyData = new TextEncoder().encode(secret)
  const key     = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sigBuf  = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64))
  const expected = bufToBase64url(sigBuf)

  // Constant-time comparison
  if (!(await safeCompare(sigB64, expected))) return null

  // Decode payload
  let payload: { order_id: string; action: string; exp: number }
  try {
    payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64)))
  } catch {
    return null
  }

  // Check expiration
  if (!payload.exp || Date.now() > payload.exp) return null
  if (!payload.order_id || !payload.action)     return null

  return payload
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  // ── FAIL CLOSED: secret must be configured ───────────────────────────────
  const actionSecret = Deno.env.get('PRECHECK_ACTION_SECRET')
  if (!actionSecret) {
    console.error('[precheck-order-action] PRECHECK_ACTION_SECRET not configured')
    return json({ error: 'Función no configurada' }, 503)
  }

  try {
    // ── Extract token from GET querystring or POST body ───────────────────
    let token:   string | undefined
    let confirm: boolean = false

    if (req.method === 'GET') {
      const url = new URL(req.url)
      token = url.searchParams.get('token') ?? undefined
      // GET is always read-only: confirm stays false
    } else if (req.method === 'POST') {
      const body = await req.json() as { token?: string; confirm?: boolean }
      token   = body.token
      confirm = body.confirm === true
    } else {
      return json({ error: 'Method not allowed' }, 405)
    }

    if (!token) return json({ error: 'Token requerido' }, 400)

    // ── Verify token ──────────────────────────────────────────────────────
    const payload = await verifyToken(token, actionSecret)
    if (!payload) return json({ error: 'Token inválido o expirado' }, 401)

    if (payload.action !== 'report_sent') {
      return json({ error: `Acción no soportada: ${payload.action}` }, 400)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })

    // ── Fetch order ───────────────────────────────────────────────────────
    const { data: order, error: fetchErr } = await supabase
      .from('dg_precheck_orders')
      .select('id, reference, company_name, status, report_sent_at')
      .eq('id', payload.order_id)
      .maybeSingle()

    if (fetchErr || !order) return json({ error: 'Orden no encontrada' }, 404)

    // ── Read-only preview (GET or confirm=false) ──────────────────────────
    if (!confirm) {
      return json({
        orderId:    order.id,
        reference:  order.reference,
        company:    order.company_name,
        status:     order.status,
        action:     payload.action,
        alreadyDone: order.status === 'report_sent',
      })
    }

    // ── Execute action (confirm=true, POST only) ───────────────────────────
    if (req.method !== 'POST') {
      return json({ error: 'Confirmar acción requiere POST' }, 405)
    }

    // Idempotent: already done is a success
    if (order.status === 'report_sent') {
      return json({
        success:    true,
        reference:  order.reference,
        company:    order.company_name,
        alreadyDone: true,
        reportSentAt: order.report_sent_at,
      })
    }

    // Only docs_received may transition to report_sent
    if (order.status !== 'docs_received') {
      return json({
        error:   `No se puede marcar reporte enviado desde estado: ${order.status}`,
        status:  order.status,
        code:    'INVALID_STATE',
      }, 409)
    }

    // ── Conditional update ─────────────────────────────────────────────────
    const now = new Date().toISOString()
    const { data: updated, error: updateErr } = await supabase
      .from('dg_precheck_orders')
      .update({ status: 'report_sent', report_sent_at: now })
      .eq('id', order.id)
      .eq('status', 'docs_received')  // only if still docs_received
      .select('id, report_sent_at')
      .maybeSingle()

    if (updateErr) throw updateErr

    if (!updated) {
      // Race condition: another request already changed the status
      const { data: refetch } = await supabase
        .from('dg_precheck_orders')
        .select('status, report_sent_at')
        .eq('id', order.id)
        .maybeSingle()

      if (refetch?.status === 'report_sent') {
        return json({ success: true, reference: order.reference, alreadyDone: true, reportSentAt: refetch.report_sent_at })
      }

      return json({ error: `Estado ha cambiado inesperadamente: ${refetch?.status ?? 'desconocido'}` }, 409)
    }

    console.log('[precheck-order-action] report_sent for order:', order.reference)
    return json({ success: true, reference: order.reference, company: order.company_name, reportSentAt: updated.report_sent_at })
  } catch (err) {
    console.error('[precheck-order-action]', err)
    return json({ error: 'Error interno' }, 500)
  }
})
