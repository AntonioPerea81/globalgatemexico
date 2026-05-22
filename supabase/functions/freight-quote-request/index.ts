import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NOTIFICATION_EMAIL     = Deno.env.get('CONTACT_NOTIFICATION_EMAIL') ?? 'ggm@globalgatemexico.com';
const TURNSTILE_SECRET_KEY   = Deno.env.get('TURNSTILE_SECRET_KEY') ?? '';
const RESEND_API_KEY         = Deno.env.get('RESEND_API_KEY') ?? '';
const SUPABASE_URL           = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface DocPath { path: string; name: string; size: number; }

interface Payload {
  referenceId:          string;
  language:             'en' | 'es';
  transport_mode:       string;
  origin_country:       string;
  origin_city:          string;
  origin_terminal:      string;
  destination_country:  string;
  destination_city:     string;
  destination_terminal: string;
  commodity:            string;
  hs_code:              string;
  cargo_class:          string;
  quick_count:          number | null;
  quick_weight:         number | null;
  packages:             unknown[];
  un_number:            string | null;
  proper_shipping_name: string | null;
  hazard_class:         string | null;
  packing_group:        string | null;
  packaging_type:       string | null;
  transport_index:      string | null;
  isotope:              string | null;
  package_category:     string | null;
  document_paths:       DocPath[];
  comments:             string;
  turnstile_token?:     string;
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
    referenceId, language = 'en',
    transport_mode, origin_country, destination_country,
    commodity, cargo_class,
    origin_city, origin_terminal,
    destination_city, destination_terminal,
    hs_code, quick_count, quick_weight, packages = [],
    un_number, proper_shipping_name, hazard_class, packing_group, packaging_type,
    transport_index, isotope, package_category,
    document_paths = [], comments,
    turnstile_token,
  } = payload;

  // ── Required field validation ────────────────────────────────────────────────
  if (!referenceId || !origin_country || !destination_country || !commodity || !cargo_class) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Turnstile verification (skipped when no token provided) ─────────────────
  if (TURNSTILE_SECRET_KEY && turnstile_token) {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: turnstile_token }),
    });
    const verifyData = await verifyRes.json() as { success: boolean };
    if (!verifyData.success) {
      console.error('[freight-quote-request] Turnstile verification failed');
      return new Response(JSON.stringify({ error: 'Bot verification failed' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  // ── Insert into DB ───────────────────────────────────────────────────────────
  const { error: insertError } = await supabase
    .from('freight_quote_requests')
    .insert({
      reference_id:          referenceId,
      language,
      transport_mode,
      origin_country,
      origin_city,
      origin_terminal,
      destination_country,
      destination_city,
      destination_terminal,
      commodity,
      hs_code,
      cargo_classification: cargo_class,
      quick_count,
      quick_weight,
      packages,
      un_number,
      proper_shipping_name,
      hazard_class,
      packing_group,
      packaging_type,
      transport_index,
      isotope,
      package_category,
      document_paths,
      comments,
    });

  if (insertError) {
    console.error('[freight-quote-request] DB insert error:', insertError.message);
    return new Response(JSON.stringify({ error: 'Database error: ' + insertError.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Generate signed URLs for documents ──────────────────────────────────────
  interface DocWithUrl { name: string; url: string | null; }
  const docsWithUrls: DocWithUrl[] = await Promise.all(
    document_paths.map(async (doc) => {
      const { data, error: signError } = await supabase.storage
        .from('quote-documents')
        .createSignedUrl(doc.path, 7 * 24 * 60 * 60);
      if (signError) console.error('[freight-quote-request] Sign error:', signError.message);
      return { name: doc.name, url: data?.signedUrl ?? null };
    })
  );

  // ── Build notification email ─────────────────────────────────────────────────
  const isES = language === 'es';

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

  const cargoClassLabel: Record<string, string> = {
    general: 'General Cargo', dg: 'Dangerous Goods', radioactive: 'Radioactive Material', not_sure: 'Not Sure / To Be Classified',
  };

  const modeLabel: Record<string, string> = {
    air: 'Air Freight', sea: 'Sea Freight', ground: 'Ground Transport', multimodal: 'Multimodal',
  };

  const docRows = docsWithUrls.length > 0
    ? docsWithUrls.map(d =>
        `<tr>
           <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;gap:12px;">
             <span style="font-size:12px;color:#374151;">${d.name}</span>
             ${d.url
               ? `<a href="${d.url}" style="background:#2563eb;color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;padding:4px 12px;border-radius:3px;text-decoration:none;white-space:nowrap;">↓ Download</a>`
               : `<span style="font-size:10px;color:#9ca3af;">unavailable</span>`}
           </td>
         </tr>`
      ).join('')
    : '';

  // Packages summary for email
  const pkgArray = packages as Array<{ pieces: string; packageType: string; length: string; width: string; height: string; weight: string; }>;
  const pkgRows = pkgArray.length > 0 && pkgArray.some(p => p.length || p.weight)
    ? pkgArray.map((p, i) =>
        row(
          `Package ${i + 1}`,
          `${p.pieces}× ${p.packageType}` +
          (p.length && p.width && p.height ? ` — ${p.length}×${p.width}×${p.height} cm` : '') +
          (p.weight ? ` — ${p.weight} kg/unit` : ''),
          i % 2 === 1
        )
      ).join('')
    : '';

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>New Freight Quote Request — Global Gate México</title></head>
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
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#60a5fa;">Freight Quote Request</p>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Global Gate México</h1>
              <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">${isES ? 'Solicitud de Cotización de Flete' : 'New Freight Quotation Request'}</p>
            </td>
            <td style="padding:28px 32px 20px;text-align:right;vertical-align:top;">
              <span style="display:inline-block;background:#2563eb;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;padding:4px 12px;border-radius:3px;">${language.toUpperCase()}</span>
            </td>
          </tr>
          <tr><td colspan="2" style="background:#2563eb;height:3px;"></td></tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="background:#ffffff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

        ${section('Shipment Route',
          row('Transport Mode',  modeLabel[transport_mode] ?? transport_mode, false) +
          row('Origin',          [origin_country, origin_city, origin_terminal].filter(Boolean).join(' · '), true) +
          row('Destination',     [destination_country, destination_city, destination_terminal].filter(Boolean).join(' · '), false)
        )}

        ${section('Cargo',
          row('Commodity',         commodity, false) +
          row('HS Code',           hs_code || null, true) +
          row('Cargo Class',       cargoClassLabel[cargo_class] ?? cargo_class, false) +
          row('Packages (quick)',  quick_count ? `${quick_count} pkg` : null, true) +
          row('Weight (quick)',    quick_weight ? `${quick_weight} kg` : null, false)
        )}

        ${pkgRows ? section('Package Details', pkgRows) : ''}

        ${(un_number || proper_shipping_name) ? section('Dangerous Goods / Radioactive',
          row('UN Number',           un_number, false) +
          row('Proper Shipping Name', proper_shipping_name, true) +
          row('Hazard Class',        hazard_class, false) +
          row('Packing Group',       packing_group, true) +
          row('Packaging Type',      packaging_type, false) +
          row('Transport Index',     transport_index, true) +
          row('Isotope',             isotope, false) +
          row('Package Category',    package_category, true)
        ) : ''}

        ${docRows ? section('Attached Documents', docRows) : ''}

        ${comments ? section('Comments', row('Notes', comments, false)) : ''}

        <div style="background:#f7f8fa;border:1px solid #e5e7eb;border-radius:6px;padding:14px 20px;margin-top:8px;">
          <p style="margin:0 0 3px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;">Reference ID</p>
          <p style="margin:0;font-size:13px;font-family:'Courier New',monospace;color:#111827;">${referenceId}</p>
        </div>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#1e293b;padding:20px 32px;border-radius:0 0 8px 8px;text-align:center;">
        <p style="margin:0 0 5px;font-size:12px;font-weight:700;color:#e2e8f0;">Global Gate México</p>
        <p style="margin:0;font-size:11px;color:#64748b;">
          <a href="mailto:ggm@globalgatemexico.com" style="color:#60a5fa;text-decoration:none;">ggm@globalgatemexico.com</a>
          &nbsp;·&nbsp;
          <a href="tel:+528121654040" style="color:#60a5fa;text-decoration:none;">+52 812 165 4040</a>
        </p>
        <p style="margin:10px 0 0;font-size:10px;color:#475569;">Automated freight quote notification. Do not reply.</p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  // ── Send email ───────────────────────────────────────────────────────────────
  if (!RESEND_API_KEY) {
    console.warn('[freight-quote-request] RESEND_API_KEY not set — skipping email');
    return new Response(JSON.stringify({ ok: true, referenceId, warning: 'email skipped' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Global Gate México <noreply@globalgatemexico.com>',
      to: [NOTIFICATION_EMAIL],
      subject: `Quote Request ${referenceId} — ${commodity} · ${origin_country} → ${destination_country}`,
      html: htmlBody,
    }),
  });

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    console.error('[freight-quote-request] Resend error:', errText);
    // Still return ok — the record is saved; email failure is non-fatal
    return new Response(JSON.stringify({ ok: true, referenceId, warning: 'email failed: ' + errText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, referenceId }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
