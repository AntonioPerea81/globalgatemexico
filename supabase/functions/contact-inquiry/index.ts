import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NOTIFICATION_EMAIL  = Deno.env.get('CONTACT_NOTIFICATION_EMAIL') ?? 'info@globalgatemexico.com';
const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')                ?? '';
const SERVICE_ROLE_KEY     = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')   ?? '';
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')              ?? '';
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY')        ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ContactPayload {
  full_name:         string;
  company?:          string;
  email:             string;
  phone?:            string;
  service_interest?: string;
  message:           string;
  consent:           boolean;
  language?:         string;
  turnstile_token?:  string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST')   return json({ error: 'Method Not Allowed' }, 405);

  let payload: ContactPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Bad Request — invalid JSON' }, 400);
  }

  const { full_name, company, email, phone, service_interest, message, consent, language, turnstile_token } = payload;

  // ── 1. Validate required fields ────────────────────────────────────────────
  if (!full_name?.trim()) return json({ error: 'full_name is required' }, 400);
  if (!email?.trim())     return json({ error: 'email is required' }, 400);
  if (!message?.trim())   return json({ error: 'message is required' }, 400);
  if (!consent)           return json({ error: 'consent must be true' }, 400);

  // ── 2. Verify Turnstile (only when secret is configured) ───────────────────
  if (TURNSTILE_SECRET_KEY) {
    if (!turnstile_token) {
      return json({ error: 'Missing Turnstile token' }, 400);
    }
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: turnstile_token }),
    });
    const verifyData = await verifyRes.json() as { success: boolean };
    if (!verifyData.success) {
      console.error('[contact-inquiry] Turnstile verification failed');
      return json({ error: 'Bot verification failed' }, 403);
    }
  }

  // ── 3. Insert into contact_inquiries ───────────────────────────────────────
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: inquiry, error: insertError } = await supabase
    .from('contact_inquiries')
    .insert({
      full_name:        full_name.trim(),
      company:          company?.trim()          || null,
      email:            email.trim().toLowerCase(),
      phone:            phone?.trim()            || null,
      service_interest: service_interest?.trim() || null,
      message:          message.trim(),
      consent:          true,
      language:         language === 'es' ? 'es' : 'en',
      turnstile_token:  turnstile_token || null,
    })
    .select('id, created_at')
    .single();

  if (insertError) {
    console.error('[contact-inquiry] Insert error:', insertError.message);
    return json({ error: 'Failed to save inquiry' }, 500);
  }

  const inquiryId  = inquiry?.id        ?? 'unknown';
  const submittedAt = inquiry?.created_at
    ? new Date(inquiry.created_at).toLocaleString('en-US', { timeZone: 'America/Monterrey', dateStyle: 'medium', timeStyle: 'short' })
    : new Date().toUTCString();

  // ── 4. Send notification email via Resend ──────────────────────────────────
  if (!RESEND_API_KEY) {
    console.warn('[contact-inquiry] RESEND_API_KEY not set — skipping email');
    return json({ ok: true, id: inquiryId, warning: 'email skipped (no API key)' });
  }

  const row = (label: string, value: string | undefined | null, shade = false) =>
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

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>New Contact Inquiry — Global Gate México</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <!-- HEADER -->
    <tr>
      <td style="background:#0f1628;padding:0;border-radius:8px 8px 0 0;overflow:hidden;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:28px 32px 20px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#c9a227;">General Inquiry</p>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Global Gate México</h1>
              <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">New Contact Inquiry via Website</p>
            </td>
            <td style="padding:28px 32px 20px;text-align:right;vertical-align:top;">
              <span style="display:inline-block;background:#c9a227;color:#0f1628;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;padding:4px 10px;border-radius:3px;">New Inquiry</span>
            </td>
          </tr>
          <tr><td colspan="2" style="background:#c9a227;height:3px;"></td></tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="background:#ffffff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

        ${section('Contact Information',
          row('Full Name',  full_name,        false) +
          row('Company',    company,          true)  +
          row('Email',      `<a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a>`, false) +
          row('Phone / WhatsApp', phone ? `<a href="tel:${phone}" style="color:#2563eb;text-decoration:none;">${phone}</a>` : undefined, true)
        )}

        ${section('Inquiry Details',
          row('Service Interest', service_interest, false) +
          `<tr style="background:#f7f8fa;">
             <td style="padding:11px 16px;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;width:160px;border-bottom:1px solid #f0f0f0;vertical-align:top;">Message</td>
             <td style="padding:11px 16px;color:#111827;font-size:13px;border-bottom:1px solid #f0f0f0;white-space:pre-wrap;">${message.trim()}</td>
           </tr>`
        )}

        <div style="background:#f7f8fa;border:1px solid #e5e7eb;border-radius:6px;padding:16px 20px;margin-top:8px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;">Submission Details</p>
          <p style="margin:4px 0 0;font-size:13px;color:#111827;">Submitted: ${submittedAt}</p>
          <p style="margin:2px 0 0;font-size:12px;font-family:'Courier New',monospace;color:#6b7280;word-break:break-all;">Ref: ${inquiryId}</p>
        </div>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#1e293b;padding:20px 32px;border-radius:0 0 8px 8px;text-align:center;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#e2e8f0;">Global Gate México</p>
        <p style="margin:0;font-size:11px;color:#64748b;">
          <a href="mailto:ggm@globalgatemexico.com" style="color:#c9a227;text-decoration:none;">ggm@globalgatemexico.com</a>
          &nbsp;·&nbsp;
          <a href="tel:+528121654040" style="color:#c9a227;text-decoration:none;">+52 812 165 4040</a>
        </p>
        <p style="margin:10px 0 0;font-size:10px;color:#475569;">Automated notification from globalgatemexico.com. Do not reply to this email.</p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  const emailRes = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:    'Global Gate México <noreply@globalgatemexico.com>',
      to:      [NOTIFICATION_EMAIL],
      subject: `New Contact Inquiry - Global Gate Mexico${language === 'es' ? ' [ES]' : ''}`,
      html:    htmlBody,
    }),
  });

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    console.error('[contact-inquiry] Resend error:', errText);
    // Inquiry is already saved — don't fail the whole request over email
    return json({ ok: true, id: inquiryId, warning: 'email delivery failed' });
  }

  return json({ ok: true, id: inquiryId });
});
