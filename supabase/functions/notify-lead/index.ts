import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NOTIFICATION_EMAIL = Deno.env.get('INTERNAL_NOTIFICATION_EMAIL') ?? 'ggm@globalgatemexico.com';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';

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

  const filesSection = uploadedFiles.length > 0
    ? `<h2 style="color:#1a1a2e;font-size:18px;margin:28px 0 16px;border-bottom:2px solid #c9a227;padding-bottom:12px;">Attached Files</h2>
       <ul style="font-size:13px;color:#1a1a2e;padding-left:20px;">
         ${uploadedFiles.map(f => `<li>${f.fieldName}: ${f.fileName}</li>`).join('')}
       </ul>`
    : '';

  const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

    <div style="background:#1a1a2e;padding:24px 32px;text-align:center;">
      <h1 style="color:#c9a227;margin:0;font-size:20px;letter-spacing:0.05em;text-transform:uppercase;">Global Gate México</h1>
      <p style="color:#ffffff;margin:8px 0 0;font-size:13px;opacity:0.7;">New Shipment Lead</p>
    </div>

    <div style="padding:32px;">
      <h2 style="color:#1a1a2e;font-size:18px;margin:0 0 24px;border-bottom:2px solid #c9a227;padding-bottom:12px;">
        Contact Information
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:10px 0;color:#666;width:140px;vertical-align:top;font-weight:bold;">Name</td>
          <td style="padding:10px 0;color:#1a1a2e;">${r.name}</td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:10px 8px;color:#666;font-weight:bold;">Company</td>
          <td style="padding:10px 8px;color:#1a1a2e;">${r.company}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#666;font-weight:bold;">Email</td>
          <td style="padding:10px 0;"><a href="mailto:${r.email}" style="color:#c9a227;">${r.email}</a></td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:10px 8px;color:#666;font-weight:bold;">Phone</td>
          <td style="padding:10px 8px;"><a href="tel:${r.phone}" style="color:#c9a227;">${r.phone}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#666;font-weight:bold;">Merchandise</td>
          <td style="padding:10px 0;color:#1a1a2e;">${r.merchandise}</td>
        </tr>
      </table>

      ${r.origin || r.destination ? `
      <h2 style="color:#1a1a2e;font-size:18px;margin:28px 0 16px;border-bottom:2px solid #c9a227;padding-bottom:12px;">
        Shipment Details
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${r.origin ? `<tr><td style="padding:10px 0;color:#666;width:140px;font-weight:bold;">Origin</td><td style="padding:10px 0;color:#1a1a2e;">${r.origin}</td></tr>` : ''}
        ${r.destination ? `<tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#666;font-weight:bold;">Destination</td><td style="padding:10px 8px;color:#1a1a2e;">${r.destination}</td></tr>` : ''}
        ${r.transport_mode ? `<tr><td style="padding:10px 0;color:#666;font-weight:bold;">Transport</td><td style="padding:10px 0;color:#1a1a2e;">${r.transport_mode}</td></tr>` : ''}
        ${r.weight_dims ? `<tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#666;font-weight:bold;">Weight / Dims</td><td style="padding:10px 8px;color:#1a1a2e;">${r.weight_dims}</td></tr>` : ''}
        ${r.quantity_detail ? `<tr><td style="padding:10px 0;color:#666;font-weight:bold;">Quantity</td><td style="padding:10px 0;color:#1a1a2e;">${r.quantity_detail}</td></tr>` : ''}
        ${r.instruction_support ? `<tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#666;font-weight:bold;">Instructions</td><td style="padding:10px 8px;color:#c9a227;font-weight:bold;">Requires instruction support</td></tr>` : ''}
        ${r.emergency_name ? `<tr><td style="padding:10px 0;color:#666;font-weight:bold;">Emergency Contact</td><td style="padding:10px 0;color:#1a1a2e;">${r.emergency_name} — ${r.emergency_phone ?? ''}</td></tr>` : ''}
      </table>
      ` : ''}

      ${filesSection}

      <div style="margin-top:32px;padding:16px;background:#1a1a2e;border-radius:6px;text-align:center;">
        <p style="color:#c9a227;margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Lead ID</p>
        <p style="color:#ffffff;margin:6px 0 0;font-size:13px;font-family:monospace;">${leadId}</p>
      </div>
    </div>

    <div style="background:#f4f4f4;padding:16px 32px;text-align:center;font-size:11px;color:#999;">
      Global Gate México &mdash; ggm@globalgatemexico.com &mdash; +52 812 165 4040
    </div>
  </div>
</body>
</html>
`;

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
