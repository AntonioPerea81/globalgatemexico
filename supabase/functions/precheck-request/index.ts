import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── Env vars ──────────────────────────────────────────────────────────────────
const TURNSTILE_SECRET_KEY  = Deno.env.get('TURNSTILE_SECRET_KEY')  ?? '';
const RESEND_API_KEY        = Deno.env.get('RESEND_API_KEY')        ?? '';
const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')          ?? '';
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const PRECHECK_NOTIFY_EMAIL = Deno.env.get('PRECHECK_NOTIFY_EMAIL')
  ?? 'antonio.perea@globalgatemexico.com,cesar.betancourt@globalgatemexico.com';
const PRECHECK_ACCOUNTING_EMAIL = Deno.env.get('PRECHECK_ACCOUNTING_EMAIL')
  ?? 'yareni@globalgatemexico.com';

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface DocPath { path: string; name: string; size: number; }

interface DGEntry {
  un_number: string;
  packages:  number;
  psn:       string | null;
}

interface Payload {
  referenceId:            string;
  language:               string;
  contact_name:           string;
  company_name:           string;
  contact_email:          string;
  contact_phone:          string;
  billing_country:        string;
  entries:                DGEntry[];
  num_packages:           number;
  paypal_transaction_id:  string;
  comments?:              string | null;
  document_paths:         DocPath[];
  accepted_terms:         boolean;
  turnstile_token:        string;
}

// ── HTML escaping ─────────────────────────────────────────────────────────────
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Email helpers ─────────────────────────────────────────────────────────────
const row = (label: string, value: string | null | undefined, shade = false) =>
  value
    ? `<tr style="background:${shade ? '#f7f8fa' : '#ffffff'};">
         <td style="padding:10px 16px;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;width:180px;border-bottom:1px solid #f0f0f0;">${label}</td>
         <td style="padding:10px 16px;color:#111827;font-size:13px;border-bottom:1px solid #f0f0f0;">${value}</td>
       </tr>`
    : '';

const section = (title: string, rows: string) =>
  `<div style="margin-bottom:20px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
     <div style="background:#f7f8fa;padding:10px 16px;border-bottom:1px solid #e5e7eb;">
       <span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#374151;">${title}</span>
     </div>
     <table style="width:100%;border-collapse:collapse;">${rows}</table>
   </div>`;

const headerBand = (title: string, sub: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0">
     <tr><td style="padding:28px 32px 20px;">
       <p style="margin:0 0 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.4);">Global Gate México</p>
       <h1 style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.01em;">${title}</h1>
       <p style="margin:8px 0 0;font-size:12px;color:rgba(255,255,255,0.5);">${sub}</p>
     </td></tr>
   </table>`;

const emailWrapper = (headerHtml: string, bodyHtml: string) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><!-- ignore-value overused-font Helvetica -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:#0d1729;border-radius:8px 8px 0 0;overflow:hidden;">${headerHtml}</td></tr>
    <tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:28px 32px;">
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding:16px 0;text-align:center;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">Global Gate México · ggm@globalgatemexico.com</p>
    </td></tr>
  </table>
  </td></tr>
</table>
</body></html>`;

// ── Resend email sender ───────────────────────────────────────────────────────
async function sendEmail(opts: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string;
}): Promise<boolean> {
  if (!RESEND_API_KEY) { console.error('[precheck-request] RESEND_API_KEY not set'); return false; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    console.error('[precheck-request] Resend error:', r.status, body);
  }
  return r.ok;
}

// ── Folio format validation ───────────────────────────────────────────────────
function isValidFolio(s: string): boolean {
  return /^PCK-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/.test(s);
}

// ── UN number validation ──────────────────────────────────────────────────────
function isValidUN(s: string): boolean {
  return /^UN\d{4}$/.test(s);
}

// ── Main handler ──────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Turnstile FAIL CLOSED: 503 if secret missing ─────────────────────────
  if (!TURNSTILE_SECRET_KEY) {
    console.error('[precheck-request] TURNSTILE_SECRET_KEY not configured');
    return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
      status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const {
    referenceId, language = 'EN',
    contact_name, company_name, contact_email, contact_phone, billing_country,
    entries = [], num_packages,
    paypal_transaction_id,
    comments,
    document_paths = [],
    accepted_terms,
    turnstile_token,
  } = payload;

  // ── Turnstile: 400 if token missing, 403 if fails ───────────────────────
  if (!turnstile_token) {
    return new Response(JSON.stringify({ error: 'Missing Turnstile token' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const tsRes  = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: turnstile_token }),
  });
  const tsData = await tsRes.json() as { success: boolean };
  if (!tsData.success) {
    console.error('[precheck-request] Turnstile failed');
    return new Response(JSON.stringify({ error: 'Bot verification failed' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Field validation ─────────────────────────────────────────────────────
  const missing: string[] = [];
  const lang = (['EN','ES'].includes((language ?? '').toUpperCase()) ? language.toUpperCase() : 'EN') as 'EN' | 'ES';

  if (!referenceId || !isValidFolio(referenceId)) missing.push('referenceId (formato PCK-XXXXXXXX)');
  if (!contact_name  || contact_name.trim().length  > 200) missing.push('contact_name');
  if (!company_name  || company_name.trim().length   > 200) missing.push('company_name');
  if (!contact_email || contact_email.trim().length  > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email.trim())) missing.push('contact_email');
  if (!contact_phone || contact_phone.trim().length  > 50) missing.push('contact_phone');
  if (!['MX','US','CA'].includes((billing_country ?? '').toUpperCase())) missing.push('billing_country (MX/US/CA)');
  if (!accepted_terms) missing.push('accepted_terms');

  // Validate entries
  if (!Array.isArray(entries) || entries.length < 1 || entries.length > 5) {
    missing.push('entries (1–5 entradas)');
  } else {
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (!isValidUN(e.un_number)) missing.push(`entries[${i}].un_number (formato UN####)`);
      if (typeof e.packages !== 'number' || e.packages < 1 || e.packages > 5) missing.push(`entries[${i}].packages (1–5)`);
      if (e.psn && e.psn.length > 200) missing.push(`entries[${i}].psn (máx 200 chars)`);
    }
  }

  const computedTotal = Array.isArray(entries)
    ? entries.reduce((s, e) => s + (typeof e.packages === 'number' ? e.packages : 0), 0)
    : 0;
  if (computedTotal < 1 || computedTotal > 5) missing.push('total de bultos (1–5)');

  // Validate TX ID
  const txTrimmed = (paypal_transaction_id ?? '').trim().toUpperCase();
  if (!txTrimmed || !/^[A-Z0-9]{10,25}$/.test(txTrimmed)) missing.push('paypal_transaction_id (10–25 alfanuméricos)');

  // Comments length
  if (comments && comments.length > 1000) missing.push('comments (máx 1000 chars)');

  if (missing.length > 0) {
    console.error('[precheck-request] Validation failed:', missing.join(', '));
    return new Response(JSON.stringify({ error: 'Campos requeridos faltantes o inválidos', missing }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── File path prefix validation ──────────────────────────────────────────
  const expectedPrefix = `precheck/${referenceId}/`;
  for (const doc of document_paths) {
    if (!doc.path.startsWith(expectedPrefix)) {
      return new Response(JSON.stringify({ error: `Ruta de archivo inválida: ${doc.path}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // ── Storage file verification ────────────────────────────────────────────
  if (document_paths.length < 5 || document_paths.length > 16) {
    return new Response(JSON.stringify({ error: 'Se requieren entre 5 y 16 archivos' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  const ACCEPTED_EXTS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);
  const MAX_SIZE = 20 * 1024 * 1024;

  let verifiedPdf = 0;
  let verifiedImg = 0;

  for (const doc of document_paths) {
    // Verify file exists and get metadata
    const { data: fileData, error: fileError } = await supabaseClient.storage
      .from('quote-documents')
      .list(`precheck/${referenceId}`, { search: doc.path.split('/').pop() });

    if (fileError || !fileData || fileData.length === 0) {
      console.warn('[precheck-request] File not found in storage:', doc.path);
    }

    // Check extension for type
    const ext = '.' + doc.path.split('.').pop()!.toLowerCase();
    if (!ACCEPTED_EXTS.has(ext)) {
      return new Response(JSON.stringify({ error: `Tipo de archivo no aceptado: ${doc.name}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check size from client-provided value (server metadata check above is best-effort)
    if (doc.size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: `Archivo demasiado grande (máx 20 MB): ${doc.name}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (ext === '.pdf') verifiedPdf++;
    else verifiedImg++;
  }

  if (verifiedPdf < 1) {
    return new Response(JSON.stringify({ error: 'Se requiere al menos 1 PDF (DGD)' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (verifiedImg < 4) {
    return new Response(JSON.stringify({ error: 'Se requieren al menos 4 fotografías (JPEG/PNG)' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Duplicate TX ID check ────────────────────────────────────────────────
  let duplicateFolio: string | null = null;
  const { data: dupData } = await supabaseClient
    .from('dg_precheck_requests')
    .select('reference')
    .eq('paypal_transaction_id', txTrimmed)
    .maybeSingle();
  if (dupData) {
    duplicateFolio = dupData.reference as string;
    console.warn('[precheck-request] Duplicate TX ID:', txTrimmed, 'previously in:', duplicateFolio);
  }

  // ── Generate signed URLs for email ───────────────────────────────────────
  interface DocWithUrl { name: string; url: string | null; }
  const docsWithUrls: DocWithUrl[] = await Promise.all(
    document_paths.map(async (doc) => {
      const { data, error: signError } = await supabaseClient.storage
        .from('quote-documents')
        .createSignedUrl(doc.path, 7 * 24 * 60 * 60);
      if (signError) console.error('[precheck-request] Sign error:', doc.path, signError.message);
      return { name: doc.name, url: data?.signedUrl ?? null };
    })
  );

  // ── Build team notification email ─────────────────────────────────────────
  const countryLabel: Record<string, string> = { MX: 'México', US: 'United States', CA: 'Canada' };
  const expectedAmt: Record<string, string> = {
    MX: 'USD 92.80 (USD 80 + IVA 16%)',
    US: 'USD 80.00',
    CA: 'USD 80.00',
  };

  const entryRows = entries.map((e, i) =>
    row(
      `Entrada ${i + 1}`,
      `${esc(e.un_number)} · ${e.packages} bulto(s)${e.psn ? ` · ${esc(e.psn)}` : ''}`,
      i % 2 === 1
    )
  ).join('');

  const docRows = docsWithUrls.map((d, i) =>
    `<tr style="background:${i % 2 === 1 ? '#f7f8fa' : '#ffffff'};">
       <td style="padding:0;border-bottom:1px solid #f0f0f0;">
         <table width="100%" cellpadding="0" cellspacing="0"><tr>
           <td style="padding:11px 16px;font-size:12px;color:#374151;word-break:break-all;">📎 ${esc(d.name)}</td>
           <td style="padding:11px 16px;text-align:right;white-space:nowrap;vertical-align:middle;">
             ${d.url
               ? `<a href="${d.url}" style="display:inline-block;background:#2563eb;color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;padding:5px 14px;border-radius:3px;text-decoration:none;">↓ Descargar</a>`
               : `<span style="font-size:10px;color:#9ca3af;font-style:italic;">Link no disponible</span>`}
           </td>
         </tr></table>
       </td>
     </tr>`
  ).join('');

  const dupWarning = duplicateFolio
    ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px 16px;margin-bottom:20px;">
         <p style="margin:0;font-size:12px;color:#dc2626;font-weight:700;">⚠ ID de transacción ya usado en ${esc(duplicateFolio)}</p>
       </div>`
    : '';

  const teamHtml = emailWrapper(
    headerBand('[PRE-CHECK] Nueva solicitud', `Folio: ${esc(referenceId)} · ${new Date().toISOString()}`),
    `${dupWarning}
    ${section('Contacto', [
      row('Nombre',   esc(contact_name)),
      row('Empresa',  esc(company_name),  true),
      row('Email',    esc(contact_email)),
      row('Teléfono', esc(contact_phone), true),
      row('País fact.', countryLabel[billing_country] ?? billing_country),
    ].join(''))}
    ${section('Mercancías DG', entryRows + row('Total bultos', String(computedTotal), entries.length % 2 === 0))}
    ${section('Pago PayPal', [
      row('ID de transacción', `<strong>${esc(txTrimmed)}</strong>`),
      row('Monto esperado',    expectedAmt[billing_country] ?? 'Ver factura', true),
    ].join(''))}
    ${comments ? section('Comentarios', row('', esc(comments))) : ''}
    ${section('Documentos', docRows || row('', 'Sin documentos'))}
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:12px 16px;">
      <p style="margin:0;font-size:12px;color:#166534;">
        📋 PDFs: ${verifiedPdf} · Fotos: ${verifiedImg}<br/>
        Las 2 horas hábiles inician cuando GGM verifica el pago y la documentación está completa.
      </p>
    </div>`
  );

  // ── Send team email (fatal) ───────────────────────────────────────────────
  const teamRecipients = PRECHECK_NOTIFY_EMAIL.split(',').map(s => s.trim()).filter(Boolean);
  const teamOk = await sendEmail({
    from: 'GGM Notificaciones <noreply@globalgatemexico.com>',
    to:   teamRecipients,
    subject: `[PRE-CHECK] Nueva solicitud — ${referenceId} — ${company_name}`,
    html:    teamHtml,
  });

  if (!teamOk) {
    return new Response(JSON.stringify({ error: 'Error al enviar notificación al equipo. Intente nuevamente.' }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Insert into DB (non-fatal) ────────────────────────────────────────────
  const { error: insertError } = await supabaseClient
    .from('dg_precheck_requests')
    .insert({
      reference:              referenceId,
      language:               lang,
      contact_name:           contact_name.trim(),
      company_name:           company_name.trim(),
      contact_email:          contact_email.trim(),
      contact_phone:          contact_phone.trim(),
      billing_country:        billing_country.toUpperCase(),
      num_packages:           computedTotal,
      entries:                entries,
      paypal_transaction_id:  txTrimmed,
      comments:               comments?.trim() || null,
      document_paths:         document_paths,
      accepted_terms_at:      new Date().toISOString(),
      terms_version:          '2025-11',
    });
  if (insertError) {
    console.error('[precheck-request] DB insert error (non-fatal):', insertError.message);
  }

  // ── Send accounting email (non-fatal) ─────────────────────────────────────
  const acctHtml = emailWrapper(
    headerBand('[PRE-CHECK] Pago por verificar y facturar', `Folio: ${esc(referenceId)}`),
    section('Datos de pago y contacto', [
      row('Folio',              esc(referenceId)),
      row('Empresa',            esc(company_name),   true),
      row('Nombre',             esc(contact_name)),
      row('Email',              esc(contact_email),  true),
      row('Teléfono',           esc(contact_phone)),
      row('País facturación',   countryLabel[billing_country] ?? billing_country, true),
      row('ID transacción',     `<strong>${esc(txTrimmed)}</strong>`),
      row('Monto esperado',     expectedAmt[billing_country] ?? 'Ver factura', true),
    ].join(''))
  );

  const acctRecipients = PRECHECK_ACCOUNTING_EMAIL.split(',').map(s => s.trim()).filter(Boolean);
  const acctOk = await sendEmail({
    from: 'GGM Notificaciones <noreply@globalgatemexico.com>',
    to:   acctRecipients,
    subject: `[PRE-CHECK] Pago por verificar y facturar — ${referenceId}`,
    html:    acctHtml,
  });
  if (!acctOk) console.error('[precheck-request] Accounting email failed (non-fatal)');

  // ── Send client confirmation email (non-fatal) ───────────────────────────
  const isES = lang === 'ES';
  const clientHtml = emailWrapper(
    headerBand(
      isES ? 'Solicitud recibida' : 'Request received',
      isES ? `Folio: ${esc(referenceId)}` : `Reference: ${esc(referenceId)}`
    ),
    `<p style="font-size:14px;color:#374151;line-height:1.65;margin:0 0 20px;">
      ${isES
        ? `Hemos recibido su solicitud de revisión previa de mercancías peligrosas. Su folio es <strong>${esc(referenceId)}</strong>.`
        : `We have received your dangerous goods pre-check request. Your reference is <strong>${esc(referenceId)}</strong>.`}
    </p>
    ${section(isES ? 'Siguientes pasos' : 'What happens next', [
      row('1', isES ? 'GGM verificará su pago con PayPal.' : 'GGM will verify your PayPal payment.'),
      row('2', isES ? 'Una vez verificado el pago y la documentación, inician 2 horas hábiles.' : 'Once payment and documentation are verified, the 2-business-hour review clock starts.', true),
      row('3', isES ? 'Recibirá su reporte PDF por correo electrónico.' : 'You will receive your PDF report by email.'),
    ].join(''))}
    <p style="font-size:12px;color:#9ca3af;margin:20px 0 0;">
      ${isES ? 'Nuestro equipo de contabilidad se pondrá en contacto para emitir su CFDI.' : 'Our accounting team will contact you to issue the CFDI receipt.'}
    </p>`
  );

  const clientOk = await sendEmail({
    from:     'Global Gate México <noreply@globalgatemexico.com>',
    to:       contact_email.trim(),
    reply_to: 'ggm@globalgatemexico.com',
    subject:  isES ? `Su solicitud de pre-check — ${referenceId}` : `Your pre-check request — ${referenceId}`,
    html:     clientHtml,
  });
  if (!clientOk) console.error('[precheck-request] Client email failed (non-fatal)');

  return new Response(JSON.stringify({ ok: true, reference: referenceId }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
