import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NOTIFICATION_EMAIL   = Deno.env.get('CONTACT_NOTIFICATION_EMAIL') ?? 'ggm@globalgatemexico.com';
const RESEND_API_KEY        = Deno.env.get('RESEND_API_KEY') ?? '';
const SUPABASE_URL          = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Payload {
  company_name:              string;
  contact_name:              string;
  job_title?:                string | null;
  email:                     string;
  phone?:                    string | null;
  trainees_range:            string;
  modality:                  string[];
  regulatory_scope?:         string[];
  transportation_modes?:     string[];
  preferred_training_date?:  string | null;   // ISO date "YYYY-MM-DD"
  date_flexible?:            boolean;
  training_location?:        string | null;
  language:                  string;
  operational_requirements?: string | null;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
    company_name, contact_name, job_title, email, phone,
    trainees_range, modality = [], regulatory_scope = [],
    transportation_modes = [], preferred_training_date, date_flexible = false,
    training_location, language, operational_requirements,
  } = payload;

  // ── Required field validation ────────────────────────────────────────────────
  const missing: string[] = [];
  if (!company_name)               missing.push('company_name');
  if (!contact_name)               missing.push('contact_name');
  if (!email)                      missing.push('email');
  if (!trainees_range)             missing.push('trainees_range');
  if (!modality || modality.length === 0) missing.push('modality');
  if (!language)                   missing.push('language');

  if (missing.length > 0) {
    console.error('[training-proposal-request] Missing fields:', missing.join(', '));
    return new Response(JSON.stringify({ error: 'Missing required fields', missing }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Insert into DB ───────────────────────────────────────────────────────────
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  const { error: insertError } = await supabase
    .from('training_inquiries')
    .insert({
      company_name,
      contact_name,
      job_title:                job_title  || null,
      email,
      phone:                    phone      || null,
      trainees_range,
      modality,
      regulatory_scope,
      transportation_modes,
      preferred_training_date:  preferred_training_date || null,
      date_flexible,
      training_location:        training_location      || null,
      language,
      operational_requirements: operational_requirements || null,
    });

  if (insertError) {
    console.error('[training-proposal-request] DB insert error:', insertError.message);
    return new Response(JSON.stringify({ error: 'Database error: ' + insertError.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Email helpers ────────────────────────────────────────────────────────────
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

  // Format preferred date for email
  const dateLabel = (() => {
    if (date_flexible && !preferred_training_date) return 'Flexible';
    if (preferred_training_date) {
      const [y, m, d] = preferred_training_date.split('-').map(Number);
      const formatted = new Date(y, m - 1, d).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      });
      return date_flexible ? `${formatted} (flexible)` : formatted;
    }
    return null;
  })();

  // ── Build notification email ─────────────────────────────────────────────────
  const notificationHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>New Training Proposal Request — Global Gate México</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <!-- HEADER -->
    <tr>
      <td style="background:#0d1729;padding:0;border-radius:8px 8px 0 0;overflow:hidden;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:28px 32px 20px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#60a5fa;">Training Proposal Request</p>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Global Gate México</h1>
              <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">New Corporate DG Training Inquiry</p>
            </td>
            <td style="padding:28px 32px 20px;text-align:right;vertical-align:top;">
              <span style="display:inline-block;background:#2563eb;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;padding:4px 12px;border-radius:3px;">TRAINING</span>
            </td>
          </tr>
          <tr><td colspan="2" style="background:#2563eb;height:3px;"></td></tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="background:#ffffff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

        ${section('Company Information',
          row('Company',   company_name, false) +
          row('Contact',   contact_name, true)  +
          row('Job Title', job_title,    false) +
          row('Email',     email,        true)  +
          row('Phone',     phone,        false)
        )}

        ${section('Training Requirements',
          row('No. of Trainees',  trainees_range,                                        false) +
          row('Modality',         modality.join(', '),                                   true)  +
          row('Regulatory Scope', regulatory_scope.length   > 0 ? regulatory_scope.join(', ')   : null, false) +
          row('Transport Modes',  transportation_modes.length > 0 ? transportation_modes.join(', ') : null, true)
        )}

        ${section('Project Details',
          row('Preferred Date',    dateLabel,                 false) +
          row('Location',          training_location,         true)  +
          row('Language',          language,                  false) +
          row('Additional Notes',  operational_requirements,  true)
        )}

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#f7f8fa;padding:16px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
          Global Gate México · IATA CBTA Provider · DG Training & Compliance · globalgatemexico.com
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  // ── Send notification email ──────────────────────────────────────────────────
  if (RESEND_API_KEY) {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Global Gate México <noreply@globalgatemexico.com>',
        to:   [NOTIFICATION_EMAIL],
        subject: `[Training Proposal] ${company_name} — ${trainees_range} trainees`,
        html: notificationHtml,
      }),
    });
    if (!emailRes.ok) {
      console.error('[training-proposal-request] Email error:', await emailRes.text());
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
