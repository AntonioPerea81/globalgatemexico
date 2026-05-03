import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NOTIFICATION_EMAIL = Deno.env.get('INTERNAL_NOTIFICATION_EMAIL') ?? 'ggm@globalgatemexico.com';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
// TODO: Re-enable Turnstile enforcement once the final production domain is connected to
// Vercel. Restore: const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY') ?? '';
// and add the verification block back below.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface UploadedFile {
  fieldName: string;
  fileName: string;
  path: string;
}

interface LeadPayload {
  leadId: string;
  leadData: {
    name: string;
    company: string;
    email: string;
    phone: string;
    merchandise: string;
    origin?: string;
    destination?: string;
    transport_mode?: string;
    weight_dims?: string;
    quantity_detail?: string;
    instruction_support?: boolean;
    emergency_name?: string;
    emergency_phone?: string;
  };
  uploadedFiles?: UploadedFile[];
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let payload: LeadPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Bad Request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { leadId, leadData, uploadedFiles = [] } = payload;

  // Attempt to fetch full lead from DB (server-side, service role)
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: lead, error: fetchError } = await supabase
    .from('shipment_leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (fetchError || !lead) {
    console.error('[notify-lead] Failed to fetch lead:', fetchError?.message);
    // Fall through — use payload data for the email
  }

  // Prefer DB record; fall back to payload fields
  const r = lead ?? leadData;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const row = (label: string, value: string | undefined, shade = false) =>
    value
      ? `<tr style="background:${shade ? '#f7f8fa' : '#ffffff'};">
           <td style="padding:11px 16px;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;width:160px;border-bottom:1px solid #f0f0f0;">${label}</td>
           <td style="padding:11px 16px;color:#111827;font-size:13px;border-bottom:1px solid #f0f0f0;">${value}</td>
         </tr>`
      : '';

  const section = (title: string, rows: string) =>
    `<div style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
       <div style="background:#f7f8fa;padding:10px 16px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;gap:8px;">
         <div style="width:3px;height:14px;background:#c9a227;border-radius:2px;display:inline-block;"></div>
         <span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#374151;">${title}</span>
       </div>
       <table style="width:100%;border-collapse:collapse;">${rows}</table>
     </div>`;

  const fileTag = (label: string, name: string) =>
    `<tr>
       <td style="padding:9px 16px;border-bottom:1px solid #f0f0f0;">
         <span style="display:inline-block;background:#eef2ff;color:#4338ca;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;padding:2px 7px;border-radius:3px;margin-right:8px;">${label}</span>
         <span style="font-size:12px;color:#374151;">${name}</span>
       </td>
     </tr>`;

  const filesRows = uploadedFiles.map(f => fileTag(f.fieldName, f.fileName)).join('');

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>New DG Compliance Intake — Global Gate México</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <!-- ── HEADER ── -->
    <tr>
      <td style="background:#0f1628;padding:0;border-radius:8px 8px 0 0;overflow:hidden;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:28px 32px 20px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#c9a227;">Compliance Intake Notification</p>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Global Gate México</h1>
              <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">Dangerous Goods Shipment Review Request</p>
            </td>
            <td style="padding:28px 32px 20px;text-align:right;vertical-align:top;">
              <span style="display:inline-block;background:#c9a227;color:#0f1628;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;padding:4px 10px;border-radius:3px;">New Lead</span>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="background:#c9a227;height:3px;"></td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── BODY ── -->
    <tr>
      <td style="background:#ffffff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

        <!-- Contact -->
        ${section('Contact Information',
          row('Full Name',   r.name,        false) +
          row('Company',     r.company,     true)  +
          row('Email',       `<a href="mailto:${r.email}" style="color:#2563eb;text-decoration:none;">${r.email}</a>`, false) +
          row('Phone',       `<a href="tel:${r.phone}" style="color:#2563eb;text-decoration:none;">${r.phone}</a>`, true) +
          row('Merchandise', r.merchandise, false)
        )}

        <!-- Shipment -->
        ${r.origin || r.destination || r.transport_mode ? section('Shipment Technical Details',
          row('Origin',         r.origin,         false) +
          row('Destination',    r.destination,    true)  +
          row('Transport Mode', r.transport_mode, false) +
          row('Weight / Dims',  r.weight_dims,    true)  +
          row('Net Quantity',   r.quantity_detail, false) +
          (r.instruction_support
            ? `<tr style="background:#fffbeb;"><td colspan="2" style="padding:10px 16px;font-size:12px;color:#92400e;font-weight:700;border-bottom:1px solid #f0f0f0;">⚠ Instruction letter support required</td></tr>`
            : '') +
          row('Emergency Contact',
            r.emergency_name ? `${r.emergency_name}${r.emergency_phone ? ' · ' + r.emergency_phone : ''}` : undefined,
            false)
        ) : ''}

        <!-- Attached Files -->
        ${uploadedFiles.length > 0 ? section('Attached Documents', filesRows) : ''}

        <!-- Lead ID -->
        <div style="background:#f7f8fa;border:1px solid #e5e7eb;border-radius:6px;padding:16px 20px;margin-top:8px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;">Submission Reference</p>
          <p style="margin:0;font-size:13px;font-family:'Courier New',monospace;color:#111827;word-break:break-all;">${leadId}</p>
        </div>

      </td>
    </tr>

    <!-- ── FOOTER ── -->
    <tr>
      <td style="background:#1e293b;padding:20px 32px;border-radius:0 0 8px 8px;text-align:center;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#e2e8f0;">Global Gate México</p>
        <p style="margin:0;font-size:11px;color:#64748b;">
          <a href="mailto:ggm@globalgatemexico.com" style="color:#c9a227;text-decoration:none;">ggm@globalgatemexico.com</a>
          &nbsp;·&nbsp;
          <a href="tel:+528121654040" style="color:#c9a227;text-decoration:none;">+52 812 165 4040</a>
        </p>
        <p style="margin:10px 0 0;font-size:10px;color:#475569;">This is an automated compliance intake notification. Do not reply to this email.</p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  // Send email via Resend
  if (!RESEND_API_KEY) {
    console.warn('[notify-lead] RESEND_API_KEY not set — skipping email send');
    return new Response(JSON.stringify({ ok: true, warning: 'email skipped (no API key)' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Global Gate México <noreply@globalgatemexico.com>',
      to: [NOTIFICATION_EMAIL],
      subject: `New Lead: ${r.name} — ${r.company}`,
      html: htmlBody,
    }),
  });

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    console.error('[notify-lead] Resend error:', errText);
    return new Response(JSON.stringify({ ok: false, error: errText }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
