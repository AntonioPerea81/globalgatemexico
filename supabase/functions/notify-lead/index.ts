import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NOTIFICATION_EMAIL = Deno.env.get('INTERNAL_NOTIFICATION_EMAIL') ?? 'ggm@globalgatemexico.com';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';

interface LeadPayload {
  leadId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  merchandise: string;
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let payload: LeadPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  // Fetch full lead record from Supabase (server-side with service role)
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: lead, error: fetchError } = await supabase
    .from('shipment_leads')
    .select('*')
    .eq('id', payload.leadId)
    .single();

  if (fetchError || !lead) {
    console.error('[notify-lead] Failed to fetch lead:', fetchError?.message);
    // Still send a basic notification with whatever payload we received
  }

  const record = lead ?? payload;

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
          <td style="padding:10px 0;color:#1a1a2e;">${record.name ?? payload.name}</td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:10px 8px;color:#666;font-weight:bold;">Company</td>
          <td style="padding:10px 8px;color:#1a1a2e;">${record.company ?? payload.company}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#666;font-weight:bold;">Email</td>
          <td style="padding:10px 0;"><a href="mailto:${record.email ?? payload.email}" style="color:#c9a227;">${record.email ?? payload.email}</a></td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:10px 8px;color:#666;font-weight:bold;">Phone</td>
          <td style="padding:10px 8px;"><a href="tel:${record.phone ?? payload.phone}" style="color:#c9a227;">${record.phone ?? payload.phone}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#666;font-weight:bold;">Merchandise</td>
          <td style="padding:10px 0;color:#1a1a2e;">${record.merchandise ?? payload.merchandise}</td>
        </tr>
      </table>

      ${record.origin || record.destination ? `
      <h2 style="color:#1a1a2e;font-size:18px;margin:28px 0 16px;border-bottom:2px solid #c9a227;padding-bottom:12px;">
        Shipment Details
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${record.origin ? `<tr><td style="padding:10px 0;color:#666;width:140px;font-weight:bold;">Origin</td><td style="padding:10px 0;color:#1a1a2e;">${record.origin}</td></tr>` : ''}
        ${record.destination ? `<tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#666;font-weight:bold;">Destination</td><td style="padding:10px 8px;color:#1a1a2e;">${record.destination}</td></tr>` : ''}
        ${record.transport_mode ? `<tr><td style="padding:10px 0;color:#666;font-weight:bold;">Transport</td><td style="padding:10px 0;color:#1a1a2e;">${record.transport_mode}</td></tr>` : ''}
        ${record.weight_dims ? `<tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#666;font-weight:bold;">Weight / Dims</td><td style="padding:10px 8px;color:#1a1a2e;">${record.weight_dims}</td></tr>` : ''}
        ${record.quantity_detail ? `<tr><td style="padding:10px 0;color:#666;font-weight:bold;">Quantity</td><td style="padding:10px 0;color:#1a1a2e;">${record.quantity_detail}</td></tr>` : ''}
        ${record.instruction_support ? `<tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#666;font-weight:bold;">Instructions</td><td style="padding:10px 8px;color:#c9a227;font-weight:bold;">Requires instruction support</td></tr>` : ''}
        ${record.emergency_name ? `<tr><td style="padding:10px 0;color:#666;font-weight:bold;">Emergency Contact</td><td style="padding:10px 0;color:#1a1a2e;">${record.emergency_name} — ${record.emergency_phone ?? ''}</td></tr>` : ''}
      </table>
      ` : ''}

      <div style="margin-top:32px;padding:16px;background:#1a1a2e;border-radius:6px;text-align:center;">
        <p style="color:#c9a227;margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Lead ID</p>
        <p style="color:#ffffff;margin:6px 0 0;font-size:13px;font-family:monospace;">${payload.leadId}</p>
      </div>
    </div>

    <div style="background:#f4f4f4;padding:16px 32px;text-align:center;font-size:11px;color:#999;">
      Global Gate México &mdash; ggm@globalgatemexico.com &mdash; +52 812 165 4040
    </div>
  </div>
</body>
</html>
`;

  // Send email via Resend (https://resend.com — free tier: 3,000 emails/month)
  if (!RESEND_API_KEY) {
    console.warn('[notify-lead] RESEND_API_KEY not set — skipping email send');
    return new Response(JSON.stringify({ ok: true, warning: 'email skipped (no API key)' }), {
      headers: { 'Content-Type': 'application/json' },
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
      subject: `New Lead: ${record.name ?? payload.name} — ${record.company ?? payload.company}`,
      html: htmlBody,
    }),
  });

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    console.error('[notify-lead] Resend error:', errText);
    return new Response(JSON.stringify({ ok: false, error: errText }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
