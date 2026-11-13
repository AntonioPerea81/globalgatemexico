import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!
const _notifyRaw           = Deno.env.get('PRECHECK_NOTIFY_EMAIL') ?? 'antonio.perea@globalgatemexico.com'
const NOTIFY_EMAILS        = _notifyRaw.split(',').map(e => e.trim()).filter(Boolean)
const ACTION_SECRET        = Deno.env.get('PRECHECK_ACTION_SECRET') ?? ''
const SITE_URL             = Deno.env.get('PRECHECK_SITE_URL') ?? 'https://www.globalgatemexico.com'

const SIGNED_URL_EXPIRY = 60 * 60 * 48
const ALLOWED_FIELDS    = new Set([
  'dgd',
  'sds_1','sds_2','sds_3','sds_4','sds_5',
  'photo_1','photo_2','photo_3','photo_4','photo_5',
])
const MAX_FILES = 11

// MIME type allowlists per field type
const PDF_TYPES   = new Set(['application/pdf'])
const IMAGE_TYPES = new Set(['image/jpeg','image/jpg','image/png','image/webp'])

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function fieldLabel(fieldName: string, EN = false): string {
  if (fieldName === 'dgd')       return 'DGD (PDF)'
  if (fieldName.startsWith('sds_'))   return `SDS ${fieldName.replace('sds_', '')} (PDF)`
  if (fieldName.startsWith('photo_')) return EN ? `Photo ${fieldName.replace('photo_', '')}` : `Foto ${fieldName.replace('photo_', '')}`
  return fieldName
}

function bufToBase64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function generateActionToken(orderId: string): Promise<string | null> {
  if (!ACTION_SECRET) return null
  const exp     = Date.now() + 30 * 24 * 60 * 60 * 1000
  const payload = JSON.stringify({ order_id: orderId, action: 'report_sent', exp })
  const payloadB64 = bufToBase64url(new TextEncoder().encode(payload))
  const keyData    = new TextEncoder().encode(ACTION_SECRET)
  const key        = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sigBuf     = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64))
  const sigB64     = bufToBase64url(sigBuf)
  return `${payloadB64}.${sigB64}`
}

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

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { orderId, sessionToken, files } = await req.json() as {
      orderId:      string
      sessionToken: string
      files: Array<{ fieldName: string; fileSize?: number; mimeType?: string }>
    }

    if (!orderId || !sessionToken || !Array.isArray(files) || files.length === 0) {
      return json({ error: 'Parámetros inválidos' }, 400)
    }

    if (files.length > MAX_FILES) {
      return json({ error: `Máximo ${MAX_FILES} archivos permitidos` }, 400)
    }

    // Validate field names against allowlist
    const invalidFields = files.map(f => f.fieldName).filter(n => !ALLOWED_FIELDS.has(n))
    if (invalidFields.length > 0) {
      return json({ error: `Campos de archivo no permitidos: ${invalidFields.join(', ')}` }, 400)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const { data: order, error: fetchErr } = await supabase
      .from('dg_precheck_orders')
      .select('id, reference, company_name, buyer_name, buyer_email, buyer_phone, billing_country, num_packages, amount_usd, tax_rate, tax_amount_usd, total_usd, paypal_capture_id, checkout_session_token, status')
      .eq('id', orderId)
      .eq('checkout_session_token', sessionToken)
      .single()

    if (fetchErr || !order) return json({ error: 'Orden no encontrada' }, 404)

    if (!['paid', 'docs_received'].includes(order.status as string)) {
      return json({ error: `Estado inválido: ${order.status}` }, 400)
    }

    // ── Verify each file exists in Storage and check MIME type ───────────
    const { data: bucketList, error: listErr } = await supabase.storage
      .from('precheck-docs')
      .list(order.id as string)

    if (listErr) {
      console.error('[notify-precheck] Storage list error:', listErr)
      return json({ error: 'Error al verificar archivos en el bucket. Intente de nuevo.' }, 500)
    }

    const storageMap = new Map<string, { name: string; metadata?: { mimetype?: string } }>(
      (bucketList ?? []).map((o: { name: string; metadata?: { mimetype?: string } }) => [o.name, o])
    )

    // Check existence
    const missingFiles = files.filter(f => !storageMap.has(f.fieldName))
    if (missingFiles.length > 0) {
      return json(
        { error: `Archivos no encontrados en el bucket: ${missingFiles.map(f => f.fieldName).join(', ')}` },
        400
      )
    }

    // Check MIME types from Storage metadata
    for (const f of files) {
      const storageObj = storageMap.get(f.fieldName)
      const mime = storageObj?.metadata?.mimetype ?? f.mimeType ?? ''
      const isPdf   = f.fieldName === 'dgd' || f.fieldName.startsWith('sds_')
      const isPhoto = f.fieldName.startsWith('photo_')
      if (isPdf   && !PDF_TYPES.has(mime)) {
        return json({ error: `${f.fieldName}: se requiere PDF (tipo detectado: ${mime})` }, 400)
      }
      if (isPhoto && !IMAGE_TYPES.has(mime)) {
        return json({ error: `${f.fieldName}: se requiere imagen JPG/PNG/WebP (tipo detectado: ${mime})` }, 400)
      }
    }

    // Require DGD + at least one photo
    const hasDgd   = files.some(f => f.fieldName === 'dgd')
    const hasPhoto = files.some(f => f.fieldName.startsWith('photo_'))
    if (!hasDgd)   return json({ error: 'Se requiere el archivo DGD (PDF)' }, 400)
    if (!hasPhoto) return json({ error: 'Se requiere al menos una fotografía del embarque' }, 400)

    // ── Upsert file records (insert new, update existing) ────────────────
    const { data: existingRecs } = await supabase
      .from('dg_precheck_files')
      .select('id, field_name')
      .eq('order_id', order.id)

    const existingMap = new Map((existingRecs ?? []).map(r => [r.field_name as string, r.id as string]))

    for (const f of files) {
      const existingId = existingMap.get(f.fieldName)
      if (existingId) {
        await supabase.from('dg_precheck_files').update({
          file_size: f.fileSize ?? null,
          mime_type: f.mimeType ?? null,
        }).eq('id', existingId)
      } else {
        await supabase.from('dg_precheck_files').insert({
          order_id:   order.id,
          field_name: f.fieldName,
          file_path:  `${order.id}/${f.fieldName}`,
          file_name:  f.fieldName,
          file_size:  f.fileSize ?? null,
          mime_type:  f.mimeType ?? null,
        })
      }
    }

    // ── Fetch DG entries ──────────────────────────────────────────────────
    const { data: entries } = await supabase
      .from('dg_precheck_entries')
      .select('line_no, un_number, hazard_class, proper_shipping_name')
      .eq('order_id', order.id)
      .order('line_no', { ascending: true })

    // ── Generate 48-hour signed download URLs ─────────────────────────────
    const signedLinks: Array<{ label: string; url: string }> = []
    for (const f of files) {
      const { data: signed } = await supabase.storage
        .from('precheck-docs')
        .createSignedUrl(`${order.id}/${f.fieldName}`, SIGNED_URL_EXPIRY)
      if (signed?.signedUrl) {
        signedLinks.push({ label: fieldLabel(f.fieldName), url: signed.signedUrl })
      }
    }

    // ── Generate action token for "Marcar reporte enviado" button ─────────
    const actionToken = await generateActionToken(order.id as string)
    const actionLink  = actionToken ? `${SITE_URL}/dg-pre-check/staff-action?token=${encodeURIComponent(actionToken)}` : null

    // ── Build notification email ───────────────────────────────────────────
    const isUpdate = order.status === 'docs_received'

    const entriesHtml = (entries ?? []).map(e =>
      `<tr>
        <td style="padding:4px 8px;font-size:13px;border-bottom:1px solid #f0f0f0;">${esc(e.line_no)}</td>
        <td style="padding:4px 8px;font-size:13px;font-weight:700;border-bottom:1px solid #f0f0f0;">${esc(e.un_number)}</td>
        <td style="padding:4px 8px;font-size:13px;border-bottom:1px solid #f0f0f0;">${esc(e.hazard_class)}</td>
        <td style="padding:4px 8px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">${esc(e.proper_shipping_name ?? '—')}</td>
      </tr>`
    ).join('')

    const filesHtml = signedLinks.map(l =>
      `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:140px;">${esc(l.label)}</td><td><a href="${esc(l.url)}" style="color:#2563eb;font-size:13px;">Descargar (48h)</a></td></tr>`
    ).join('')

    const updateBadge = isUpdate
      ? `<div style="background:#fffbeb;border:1px solid #fcd34d;border-left:3px solid #f59e0b;padding:12px 18px;margin-bottom:16px;"><p style="margin:0;font-size:13px;font-weight:800;color:#78350f;">⚠ DOCUMENTOS ACTUALIZADOS — revisión pendiente de reinicio</p></div>`
      : ''

    const actionBtn = actionLink
      ? `<div style="text-align:center;margin:24px 0;">
          <a href="${esc(actionLink)}" style="display:inline-block;background:#060e1c;color:#fff;padding:12px 24px;font-size:12px;font-weight:800;text-decoration:none;border-radius:3px;text-transform:uppercase;letter-spacing:0.08em;">Marcar reporte enviado →</a>
          <p style="font-size:11px;color:#6b7280;margin-top:8px;">Este enlace expira en 30 días.</p>
        </div>`
      : ''

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;"><!-- ignore-value overused-font Arial -->
        <div style="background:#060e1c;padding:24px 32px;border-bottom:2px solid #2563eb;">
          <img src="https://www.globalgatemexico.com/GGM-SM.png" alt="GGM" style="height:44px;" />
          <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.2em;margin:8px 0 0;">${isUpdate ? 'Documentos actualizados — DG Pre-Check' : 'Documentos recibidos — DG Pre-Check'}</p>
        </div>
        <div style="padding:32px;background:#fff;">
          ${updateBadge}
          <div style="background:#f4f6f9;border-left:3px solid #2563eb;padding:14px 18px;margin-bottom:28px;">
            <p style="margin:0;font-size:14px;"><strong>Folio:</strong> ${esc(order.reference as string)}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Recibido: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })} hora CDMX</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <tr><td colspan="2" style="padding:0 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">Cliente</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:160px;">Nombre</td><td style="font-size:13px;font-weight:600;">${esc(order.buyer_name as string)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Empresa</td><td style="font-size:13px;font-weight:600;">${esc(order.company_name as string)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Email</td><td><a href="mailto:${esc(order.buyer_email as string)}" style="color:#2563eb;font-size:13px;">${esc(order.buyer_email as string)}</a></td></tr>
            ${order.buyer_phone ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Teléfono</td><td style="font-size:13px;">${esc(order.buyer_phone as string)}</td></tr>` : ''}
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">País Facturación</td><td style="font-size:13px;">${esc(order.billing_country as string)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Bultos</td><td style="font-size:13px;">${esc(order.num_packages)}</td></tr>
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

          <p style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin-bottom:6px;">Documentos</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            ${filesHtml}
          </table>

          ${actionBtn}

          <div style="margin-top:24px;padding:16px;background:#fef3c7;border:1px solid #fcd34d;border-radius:4px;">
            <p style="margin:0;font-size:13px;font-weight:800;color:#92400e;">⏱ SLA: máximo 2 horas hábiles (Lun–Vie 9:00–17:00 CDMX) desde esta notificación.</p>
          </div>
        </div>
        <div style="background:#060e1c;padding:16px 32px;">
          <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Global Gate México · ggm@globalgatemexico.com · +52 812 165 4040</p>
        </div>
      </div>`

    // ── Send notification email (failure blocks status update) ────────────
    const emailRes = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:    'GGM Pre-Check <noreply@globalgatemexico.com>',
        to:      NOTIFY_EMAILS,
        subject: `[PRE-CHECK] Documentos recibidos — ${order.reference} — ${order.company_name}`,
        html,
      }),
    })

    if (!emailRes.ok) {
      const errText = await emailRes.text()
      console.error('[notify-precheck] Resend error:', errText)
      return json({ error: 'Error al enviar correo de notificación. Intente de nuevo.' }, 500)
    }

    // ── Update status and reset sla_alert_count after email confirmed sent ──
    const { error: updateErr } = await supabase
      .from('dg_precheck_orders')
      .update({ status: 'docs_received', sla_alert_count: 0 })
      .eq('id', order.id)

    if (updateErr) {
      console.error('[notify-precheck] status update error:', updateErr)
      return json({ error: 'Error al actualizar estado. Contacte a soporte con su folio.' }, 500)
    }

    return json({ success: true, reference: order.reference })
  } catch (err) {
    console.error('[notify-precheck]', err)
    return json({ error: 'Error interno. Intente de nuevo.' }, 500)
  }
})
