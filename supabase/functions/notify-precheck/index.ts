import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!
const NOTIFY_EMAIL         = Deno.env.get('PRECHECK_NOTIFY_EMAIL') ?? 'antonio.perea@globalgatemexico.com'

const SIGNED_URL_EXPIRY = 60 * 60 * 48  // 48 hours in seconds

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
      files: Array<{ fieldName: string; filePath: string; fileName: string; fileSize?: number; mimeType?: string }>
    }

    if (!orderId || !sessionToken || !Array.isArray(files) || files.length === 0) {
      return json({ error: 'Parámetros inválidos' }, 400)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const { data: order, error: fetchErr } = await supabase
      .from('dg_precheck_orders')
      .select('*')
      .eq('id', orderId)
      .eq('checkout_session_token', sessionToken)
      .single()

    if (fetchErr || !order) return json({ error: 'Orden no encontrada' }, 404)
    if (order.status !== 'paid') return json({ error: `Estado inválido: ${order.status}` }, 400)

    // Insert file records
    const fileInserts = files.map(f => ({
      order_id:   orderId,
      field_name: f.fieldName,
      file_path:  f.filePath,
      file_name:  f.fileName,
      file_size:  f.fileSize ?? null,
      mime_type:  f.mimeType ?? null,
    }))

    const { error: filesErr } = await supabase.from('dg_precheck_files').insert(fileInserts)
    if (filesErr) console.error('[notify-precheck] file insert error:', filesErr)

    // Generate signed URLs (48h)
    const signedLinks: Array<{ label: string; url: string }> = []
    for (const f of files) {
      const { data: signed } = await supabase.storage
        .from('precheck-docs')
        .createSignedUrl(f.filePath, SIGNED_URL_EXPIRY)
      if (signed?.signedUrl) {
        const label = f.fieldName === 'dgd'
          ? 'DGD (PDF)'
          : `Foto ${f.fieldName.replace('photo_', '')}`
        signedLinks.push({ label, url: signed.signedUrl })
      }
    }

    // Build fiscal data section for email
    const hasFiscal = !!(order.rfc || order.razon_social)
    const fiscalHtml = hasFiscal ? `
      <tr><td colspan="2" style="padding:12px 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;border-top:1px solid #e5e7eb;">Datos Fiscales (CFDI)</td></tr>
      ${order.rfc          ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:160px;">RFC</td><td style="font-size:13px;font-weight:600;">${order.rfc}</td></tr>` : ''}
      ${order.razon_social ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Razón Social</td><td style="font-size:13px;font-weight:600;">${order.razon_social}</td></tr>` : ''}
      ${order.regimen_fiscal        ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Régimen</td><td style="font-size:13px;">${order.regimen_fiscal}</td></tr>` : ''}
      ${order.codigo_postal_fiscal  ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">CP Fiscal</td><td style="font-size:13px;">${order.codigo_postal_fiscal}</td></tr>` : ''}
      ${order.uso_cfdi              ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Uso CFDI</td><td style="font-size:13px;">${order.uso_cfdi}</td></tr>` : ''}
    ` : ''

    const filesHtml = signedLinks.map(l =>
      `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:120px;">${l.label}</td><td><a href="${l.url}" style="color:#2563eb;font-size:13px;">Descargar (48h)</a></td></tr>`
    ).join('')

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
        <div style="background:#060e1c;padding:24px 32px;border-bottom:2px solid #2563eb;">
          <img src="https://www.globalgatemexico.com/GGM-SM.png" alt="GGM" style="height:44px;" />
          <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.2em;margin:8px 0 0;">Nueva solicitud de DG Pre-Check</p>
        </div>
        <div style="padding:32px;background:#fff;">
          <div style="background:#f4f6f9;border-left:3px solid #2563eb;padding:14px 18px;margin-bottom:28px;">
            <p style="margin:0;font-size:14px;"><strong>Folio:</strong> ${order.reference}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Recibido: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })} hora CDMX</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td colspan="2" style="padding:0 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">Cliente</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;width:160px;">Nombre</td><td style="font-size:13px;font-weight:600;">${order.buyer_name}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Empresa</td><td style="font-size:13px;font-weight:600;">${order.company_name}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Email</td><td><a href="mailto:${order.buyer_email}" style="color:#2563eb;font-size:13px;">${order.buyer_email}</a></td></tr>
            ${order.buyer_phone ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Teléfono</td><td style="font-size:13px;">${order.buyer_phone}</td></tr>` : ''}
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">País Facturación</td><td style="font-size:13px;">${order.billing_country}${order.has_mx_establishment ? ' — con establecimiento en MX' : ''}</td></tr>

            <tr><td colspan="2" style="padding:12px 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;border-top:1px solid #e5e7eb;">Embarque</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Origen</td><td style="font-size:13px;">${order.origin}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Destino</td><td style="font-size:13px;">${order.destination}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Bultos</td><td style="font-size:13px;">${order.num_packages}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Entradas DG</td><td style="font-size:13px;">${order.num_dg_entries}</td></tr>
            ${order.cargo_description ? `<tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Descripción</td><td style="font-size:13px;">${order.cargo_description}</td></tr>` : ''}

            <tr><td colspan="2" style="padding:12px 0 4px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;border-top:1px solid #e5e7eb;">Pago</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">Monto Base</td><td style="font-size:13px;">USD ${order.amount_usd.toFixed(2)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">IVA (${(order.tax_rate * 100).toFixed(0)}%)</td><td style="font-size:13px;">USD ${order.tax_amount_usd.toFixed(2)}</td></tr>
            <tr><td style="color:#060e1c;font-size:14px;font-weight:800;padding:4px 0;">Total Cobrado</td><td style="font-size:14px;font-weight:800;color:#060e1c;">USD ${order.total_usd.toFixed(2)}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:3px 0;">PayPal Capture ID</td><td style="font-size:12px;color:#6b7280;">${order.paypal_capture_id ?? '—'}</td></tr>

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

    const emailRes = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:    'GGM Pre-Check <noreply@globalgatemexico.com>',
        to:      [NOTIFY_EMAIL],
        subject: `[PRE-CHECK] ${order.reference} — ${order.company_name} — ${order.origin} → ${order.destination}`,
        html,
      }),
    })

    if (!emailRes.ok) {
      const errText = await emailRes.text()
      console.error('[notify-precheck] Resend error:', errText)
    }

    await supabase
      .from('dg_precheck_orders')
      .update({ status: 'docs_received' })
      .eq('id', orderId)

    return json({ success: true, reference: order.reference })
  } catch (err) {
    console.error('[notify-precheck]', err)
    return json({ error: err instanceof Error ? err.message : 'Error interno' }, 500)
  }
})
