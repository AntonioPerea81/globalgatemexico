import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!
const _notifyRaw           = Deno.env.get('PRECHECK_NOTIFY_EMAIL') ?? 'antonio.perea@globalgatemexico.com'
const NOTIFY_EMAILS        = _notifyRaw.split(',').map(e => e.trim()).filter(Boolean)

const SIGNED_URL_EXPIRY = 60 * 60 * 48
const ALLOWED_FIELDS    = new Set(['dgd', 'photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5'])
const MAX_FILES         = 6

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
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

    // Validate field names against allowlist; ignore client-supplied filePath and fileName
    const invalidFields = files.map(f => f.fieldName).filter(n => !ALLOWED_FIELDS.has(n))
    if (invalidFields.length > 0) {
      return json({ error: `Campos de archivo no permitidos: ${invalidFields.join(', ')}` }, 400)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const { data: order, error: fetchErr } = await supabase
      .from('dg_precheck_orders')
      .select('*')
      .eq('id', orderId)
      .eq('checkout_session_token', sessionToken)
      .single()

    if (fetchErr || !order) return json({ error: 'Orden no encontrada' }, 404)

    if (!['paid', 'docs_received'].includes(order.status as string)) {
      return json({ error: `Estado inválido: ${order.status}` }, 400)
    }

    const isUpdate = order.status === 'docs_received'

    // ── Verify each file exists in Storage before registering ──────────────
    // Paths are derived server-side as ${order.id}/${fieldName}
    const { data: bucketList, error: listErr } = await supabase.storage
      .from('precheck-docs')
      .list(order.id as string)

    if (listErr) {
      console.error('[notify-precheck] Storage list error:', listErr)
      return json({ error: 'Error al verificar archivos en el bucket. Intente de nuevo.' }, 500)
    }

    const existingNames = new Set((bucketList ?? []).map((o: { name: string }) => o.name))
    const missingFiles  = files.filter(f => !existingNames.has(f.fieldName))
    if (missingFiles.length > 0) {
      return json(
        { error: `Archivos no encontrados en el bucket: ${missingFiles.map(f => f.fieldName).join(', ')}` },
        400
      )
    }

    // ── Skip already-registered fields (idempotent on retry) ───────────────
    const { data: existingRecs } = await supabase
      .from('dg_precheck_files')
      .select('field_name')
      .eq('order_id', order.id)

    const registeredFields = new Set((existingRecs ?? []).map(r => r.field_name as string))
    const newFiles         = files.filter(f => !registeredFields.has(f.fieldName))

    if (newFiles.length > 0) {
      // Derive paths server-side — ignore any filePath/fileName from the client
      const fileInserts = newFiles.map(f => ({
        order_id:   order.id,
        field_name: f.fieldName,
        file_path:  `${order.id}/${f.fieldName}`,
        file_name:  f.fieldName,       // server-derived; client fileName is untrusted
        file_size:  f.fileSize ?? null,
        mime_type:  f.mimeType ?? null,
      }))

      const { error: filesErr } = await supabase.from('dg_precheck_files').insert(fileInserts)
      if (filesErr) {
        console.error('[notify-precheck] file insert error:', filesErr)
        return json({ error: 'Error al registrar archivos. Intente de nuevo.' }, 500)
      }
    }

    // ── Generate 48-hour signed download URLs ─────────────────────────────
    const signedLinks: Array<{ label: string; url: string }> = []
    for (const f of files) {
      const { data: signed } = await supabase.storage
        .from('precheck-docs')
        .createSignedUrl(`${order.id}/${f.fieldName}`, SIGNED_URL_EXPIRY)
      if (signed?.signedUrl) {
        const label = f.fieldName === 'dgd'
          ? 'DGD (PDF)'
          : `Foto ${f.fieldName.replace('photo_', '')}`
        signedLinks.push({ label, url: signed.signedUrl })
      }
    }

    // ── Build notification email ───────────────────────────────────────────
    const hasFiscal = !!(order.rfc || order.razon_social)
    const fiscalHtml = hasFiscal ? `
      <tr><td colspan="2" style="padding:12px 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;border-top:1px solid #e5e7eb;">Datos Fiscales (CFDI)</td></tr>
      ${order.rfc          ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:160px;">RFC</td><td style="font-size:13px;font-weight:600;">${esc(order.rfc)}</td></tr>` : ''}
      ${order.razon_social ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Razón Social</td><td style="font-size:13px;font-weight:600;">${esc(order.razon_social)}</td></tr>` : ''}
      ${order.regimen_fiscal       ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Régimen</td><td style="font-size:13px;">${esc(order.regimen_fiscal)}</td></tr>` : ''}
      ${order.codigo_postal_fiscal ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">CP Fiscal</td><td style="font-size:13px;">${esc(order.codigo_postal_fiscal)}</td></tr>` : ''}
      ${order.uso_cfdi             ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Uso CFDI</td><td style="font-size:13px;">${esc(order.uso_cfdi)}</td></tr>` : ''}
    ` : ''

    const filesHtml = signedLinks.map(l =>
      `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:120px;">${esc(l.label)}</td><td><a href="${esc(l.url)}" style="color:#2563eb;font-size:13px;">Descargar (48h)</a></td></tr>`
    ).join('')

    const updateBadge = isUpdate
      ? `<div style="background:#fffbeb;border:1px solid #fcd34d;border-left:3px solid #f59e0b;padding:12px 18px;margin-bottom:16px;"><p style="margin:0;font-size:13px;font-weight:800;color:#78350f;">⚠ DOCUMENTOS ACTUALIZADOS — revisión pendiente de reinicio</p></div>`
      : ''

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
        <div style="background:#060e1c;padding:24px 32px;border-bottom:2px solid #2563eb;">
          <img src="https://www.globalgatemexico.com/GGM-SM.png" alt="GGM" style="height:44px;" />
          <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.2em;margin:8px 0 0;">${isUpdate ? 'Documentos actualizados — DG Pre-Check' : 'Nueva solicitud de DG Pre-Check'}</p>
        </div>
        <div style="padding:32px;background:#fff;">
          ${updateBadge}
          <div style="background:#f4f6f9;border-left:3px solid #2563eb;padding:14px 18px;margin-bottom:28px;">
            <p style="margin:0;font-size:14px;"><strong>Folio:</strong> ${esc(order.reference as string)}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Recibido: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })} hora CDMX</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td colspan="2" style="padding:0 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">Cliente</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:160px;">Nombre</td><td style="font-size:13px;font-weight:600;">${esc(order.buyer_name as string)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Empresa</td><td style="font-size:13px;font-weight:600;">${esc(order.company_name as string)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Email</td><td><a href="mailto:${esc(order.buyer_email as string)}" style="color:#2563eb;font-size:13px;">${esc(order.buyer_email as string)}</a></td></tr>
            ${order.buyer_phone ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Teléfono</td><td style="font-size:13px;">${esc(order.buyer_phone as string)}</td></tr>` : ''}
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">País Facturación</td><td style="font-size:13px;">${esc(order.billing_country as string)}${order.has_mx_establishment ? ' — con establecimiento en MX' : ''}</td></tr>

            <tr><td colspan="2" style="padding:12px 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;border-top:1px solid #e5e7eb;">Embarque</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Origen</td><td style="font-size:13px;">${esc(order.origin as string)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Destino</td><td style="font-size:13px;">${esc(order.destination as string)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Bultos</td><td style="font-size:13px;">${esc(order.num_packages)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Entradas DG</td><td style="font-size:13px;">${esc(order.num_dg_entries)}</td></tr>
            ${order.cargo_description ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Descripción</td><td style="font-size:13px;">${esc(order.cargo_description as string)}</td></tr>` : ''}

            <tr><td colspan="2" style="padding:12px 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;border-top:1px solid #e5e7eb;">Pago</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Monto Base</td><td style="font-size:13px;">USD ${Number(order.amount_usd).toFixed(2)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">IVA (${(Number(order.tax_rate) * 100).toFixed(0)}%)</td><td style="font-size:13px;">USD ${Number(order.tax_amount_usd).toFixed(2)}</td></tr>
            <tr><td style="color:#060e1c;font-size:14px;font-weight:800;padding:4px 0;">Total Cobrado</td><td style="font-size:14px;font-weight:800;color:#060e1c;">USD ${Number(order.total_usd).toFixed(2)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">PayPal Capture ID</td><td style="font-size:12px;color:#6b7280;">${esc(order.paypal_capture_id ?? '—')}</td></tr>

            ${fiscalHtml}

            <tr><td colspan="2" style="padding:12px 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;border-top:1px solid #e5e7eb;">Documentos</td></tr>
            ${filesHtml}
          </table>
          <div style="margin-top:28px;padding:16px;background:#fef3c7;border:1px solid #fcd34d;border-radius:4px;">
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
        subject: `[PRE-CHECK${isUpdate ? ' ACTUALIZADO' : ''}] ${order.reference} — ${order.company_name} — ${order.origin} → ${order.destination}`,
        html,
      }),
    })

    if (!emailRes.ok) {
      const errText = await emailRes.text()
      console.error('[notify-precheck] Resend error:', errText)
      return json({ error: 'Error al enviar correo de notificación. Intente de nuevo.' }, 500)
    }

    // ── Update status only after email confirmed sent ─────────────────────
    const { error: updateErr } = await supabase
      .from('dg_precheck_orders')
      .update({ status: 'docs_received' })
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
