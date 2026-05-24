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
  // Contact / company
  company_name:         string;
  contact_name:         string;
  contact_email:        string;
  contact_phone:        string;
  contact_country:      string;
  contact_department?:  string | null;
  contact_position?:    string | null;
  // Shipment
  transport_mode:           string;
  origin_country:           string;
  origin_city:              string;
  origin_terminal:          string;
  origin_postal_code?:      string | null;
  destination_country:      string;
  destination_city:         string;
  destination_terminal:     string;
  destination_postal_code?: string | null;
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
  document_paths:       DocPath[];
  comments:             string;
  sea_shipment_type?:   string | null;
  container_type?:      string | null;
  container_qty?:       number | null;
  soc_coc?:             string | null;
  dg_container?:        boolean | null;
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
    company_name, contact_name, contact_email, contact_phone, contact_country,
    contact_department, contact_position,
    transport_mode, origin_country, destination_country,
    commodity, cargo_class,
    origin_city, origin_terminal, origin_postal_code,
    destination_city, destination_terminal, destination_postal_code,
    hs_code, quick_count, quick_weight, packages = [],
    un_number, proper_shipping_name, hazard_class, packing_group, packaging_type,
    document_paths = [], comments,
    sea_shipment_type, container_type, container_qty, soc_coc, dg_container,
    turnstile_token,
  } = payload;

  // ── Required field validation ────────────────────────────────────────────────
  const missing: string[] = [];
  if (!referenceId)                                          missing.push('referenceId');
  // Contact fields
  if (!company_name)                                         missing.push('company_name');
  if (!contact_name)                                         missing.push('contact_name');
  if (!contact_email)                                        missing.push('contact_email');
  if (!contact_phone)                                        missing.push('contact_phone');
  if (!contact_country)                                      missing.push('contact_country');
  // Shipment fields — air uses terminal (IATA) instead of country
  if (!origin_country && !origin_terminal)                   missing.push('origin (country or airport)');
  if (!destination_country && !destination_terminal)         missing.push('destination (country or airport)');
  // Ground transport requires postal codes for carrier rating
  if (transport_mode === 'ground' && !origin_postal_code)      missing.push('origin_postal_code');
  if (transport_mode === 'ground' && !destination_postal_code) missing.push('destination_postal_code');
  if (!commodity)                                            missing.push('commodity');
  if (!cargo_class)                                          missing.push('cargo_class');

  if (missing.length > 0) {
    console.error('[freight-quote-request] Validation failed. Missing:', missing.join(', '));
    return new Response(JSON.stringify({ error: 'Missing required fields', missing }), {
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
      company_name:          company_name || null,
      contact_name:          contact_name || null,
      contact_email:         contact_email || null,
      contact_phone:         contact_phone || null,
      contact_country:       contact_country || null,
      contact_department:    contact_department || null,
      contact_position:      contact_position || null,
      transport_mode,
      origin_country,
      origin_city,
      origin_terminal,
      origin_postal_code:      origin_postal_code || null,
      destination_country,
      destination_city,
      destination_terminal,
      destination_postal_code: destination_postal_code || null,
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
      document_paths,
      comments,
      sea_shipment_type: sea_shipment_type || null,
    });

  if (insertError) {
    console.error('[freight-quote-request] DB insert error:', insertError.message);
    return new Response(JSON.stringify({ error: 'Database error: ' + insertError.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Generate signed URLs for documents ──────────────────────────────────────
  console.log('[freight-quote-request] document_paths received:', JSON.stringify(document_paths));

  interface DocWithUrl { name: string; url: string | null; }
  const docsWithUrls: DocWithUrl[] = await Promise.all(
    document_paths.map(async (doc) => {
      console.log('[freight-quote-request] Signing URL for path:', doc.path);
      const { data, error: signError } = await supabase.storage
        .from('quote-documents')
        .createSignedUrl(doc.path, 7 * 24 * 60 * 60);
      if (signError) {
        console.error('[freight-quote-request] Sign error for', doc.path, ':', signError.message);
      } else {
        console.log('[freight-quote-request] Signed URL OK:', doc.path);
      }
      return { name: doc.name, url: data?.signedUrl ?? null };
    })
  );
  console.log('[freight-quote-request] docsWithUrls:', JSON.stringify(docsWithUrls));

  // ── Email helpers ────────────────────────────────────────────────────────────
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
    general: 'General Cargo', dg: 'Dangerous Goods', not_sure: 'Not Sure / To Be Classified',
  };

  const modeLabel: Record<string, string> = {
    air: 'Air Freight', sea: 'Sea Freight', ground: 'Ground Transport',
  };

  const docRows = docsWithUrls.length > 0
    ? docsWithUrls.map((d, i) =>
        `<tr style="background:${i % 2 === 1 ? '#f7f8fa' : '#ffffff'};">
           <td style="padding:0;border-bottom:1px solid #f0f0f0;">
             <table width="100%" cellpadding="0" cellspacing="0">
               <tr>
                 <td style="padding:11px 16px;font-size:12px;color:#374151;word-break:break-all;">
                   📎 ${d.name}
                 </td>
                 <td style="padding:11px 16px;text-align:right;white-space:nowrap;vertical-align:middle;">
                   ${d.url
                     ? `<a href="${d.url}" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;padding:5px 14px;border-radius:3px;text-decoration:none;">↓ Download</a>`
                     : `<span style="font-size:10px;color:#9ca3af;font-style:italic;">Link unavailable</span>`}
                 </td>
               </tr>
             </table>
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

  // ── Build NOTIFICATION email (to GGM team) ───────────────────────────────────
  const notificationHtml = `<!DOCTYPE html>
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

        ${section(isES ? 'Información del Cliente' : 'Client Information',
          row(isES ? 'Empresa' : 'Company',      company_name, false) +
          row(isES ? 'Contacto' : 'Contact',     contact_name, true) +
          row(isES ? 'Correo' : 'Email',         contact_email, false) +
          row(isES ? 'Teléfono' : 'Phone',       contact_phone, true) +
          row(isES ? 'País' : 'Country',         contact_country, false) +
          row(isES ? 'Departamento' : 'Department', contact_department || null, true) +
          row(isES ? 'Cargo' : 'Position',       contact_position || null, false)
        )}

        ${section(isES ? 'Ruta del Embarque' : 'Shipment Route',
          row(isES ? 'Modo de Transporte' : 'Transport Mode', modeLabel[transport_mode] ?? transport_mode, false) +
          row(isES ? 'Origen' : 'Origin',
            [origin_country, origin_city, origin_terminal].filter(Boolean).join(' · ') +
            (origin_postal_code ? ` — CP ${origin_postal_code}` : ''), true) +
          row(isES ? 'Destino' : 'Destination',
            [destination_country, destination_city, destination_terminal].filter(Boolean).join(' · ') +
            (destination_postal_code ? ` — CP ${destination_postal_code}` : ''), false)
        )}

        ${sea_shipment_type ? section(isES ? 'Detalles Marítimos' : 'Maritime Details', (() => {
          const shipTypeLabel = sea_shipment_type === 'lcl'
            ? (isES ? 'LCL — Carga Consolidada' : 'LCL — Less than Container Load')
            : sea_shipment_type === 'fcl'
              ? (isES ? 'FCL — Contenedor Completo' : 'FCL — Full Container Load')
              : sea_shipment_type;
          const containerLabel = container_type
            ? `${container_qty ?? 1}× ${container_type}` +
              (soc_coc ? ` (${soc_coc})` : '') +
              (dg_container ? (isES ? ' ⚠ MP' : ' ⚠ DG') : '')
            : null;
          return (
            row(isES ? 'Tipo de Embarque' : 'Shipment Type', shipTypeLabel, false) +
            row(isES ? 'Contenedor' : 'Container', containerLabel, true)
          );
        })()) : ''}

        ${section(isES ? 'Carga' : 'Cargo',
          row(isES ? 'Mercancía' : 'Commodity',           commodity, false) +
          row('HS Code',                                   hs_code || null, true) +
          row(isES ? 'Clase de Carga' : 'Cargo Class',    cargoClassLabel[cargo_class] ?? cargo_class, false) +
          row(isES ? 'Bultos (rápido)' : 'Packages (quick)', quick_count ? `${quick_count} pkg` : null, true) +
          row(isES ? 'Peso (rápido)' : 'Weight (quick)',  quick_weight ? `${quick_weight} kg` : null, false)
        )}

        ${pkgRows ? section(isES ? 'Detalle de Bultos' : 'Package Details', pkgRows) : ''}

        ${(un_number || proper_shipping_name) ? section(isES ? 'Mercancías Peligrosas' : 'Dangerous Goods',
          row('UN Number',                                  un_number, false) +
          row(isES ? 'Nombre Apropiado de Expedición' : 'Proper Shipping Name', proper_shipping_name, true) +
          row(isES ? 'Clase de Peligro' : 'Hazard Class',  hazard_class, false) +
          row(isES ? 'Grupo de Embalaje' : 'Packing Group', packing_group, true) +
          row(isES ? 'Tipo de Embalaje' : 'Packaging Type', packaging_type, false)
        ) : ''}

        ${docRows ? section(isES ? 'Documentos Adjuntos' : 'Attached Documents', docRows) : ''}

        ${comments ? section(isES ? 'Comentarios' : 'Comments', row(isES ? 'Notas' : 'Notes', comments, false)) : ''}

        <div style="background:#f7f8fa;border:1px solid #e5e7eb;border-radius:6px;padding:14px 20px;margin-top:8px;">
          <p style="margin:0 0 3px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;">${isES ? 'Referencia' : 'Reference ID'}</p>
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

  // ── Build CLIENT AUTO-RESPONSE email ─────────────────────────────────────────
  const clientSubject = isES
    ? `Solicitud de Cotización Recibida — ${referenceId}`
    : `Quote Request Received — ${referenceId}`;

  const clientHtml = isES ? `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><title>Solicitud Recibida — Global Gate México</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <tr>
      <td style="background:#0d1729;padding:28px 32px 0;border-radius:8px 8px 0 0;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#60a5fa;">Global Gate México</p>
        <h1 style="margin:0 0 20px;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Solicitud de Cotización Recibida</h1>
        <div style="background:#2563eb;height:3px;"></div>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:36px 32px 28px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
        <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;">
          Estimado/a <strong>${contact_name}</strong>,
        </p>
        <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;">
          Gracias por contactar a Global Gate México. Hemos recibido exitosamente su solicitud de cotización de flete y está siendo revisada por nuestro equipo logístico.
        </p>

        <div style="background:#f7f8fa;border:1px solid #e5e7eb;border-radius:6px;padding:20px;margin:24px 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;">Número de Referencia</p>
          <p style="margin:0 0 8px;font-size:20px;font-weight:800;color:#111827;font-family:'Courier New',monospace;letter-spacing:0.05em;">${referenceId}</p>
          <p style="margin:0;font-size:11px;color:#6b7280;">Conserve esta referencia para cualquier consulta futura.</p>
        </div>

        <p style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#374151;">¿Qué sigue?</p>
        <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;vertical-align:top;">
              <span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;width:24px;height:24px;text-align:center;line-height:24px;font-size:11px;font-weight:800;color:#2563eb;margin-right:12px;flex-shrink:0;">1</span>
              <span style="font-size:13px;color:#374151;line-height:1.6;">Nuestros especialistas revisan los requerimientos operativos y la documentación de su embarque.</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;vertical-align:top;">
              <span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;width:24px;height:24px;text-align:center;line-height:24px;font-size:11px;font-weight:800;color:#2563eb;margin-right:12px;flex-shrink:0;">2</span>
              <span style="font-size:13px;color:#374151;line-height:1.6;">Preparamos una cotización personalizada para su carga y ruta específicas.</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;vertical-align:top;">
              <span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;width:24px;height:24px;text-align:center;line-height:24px;font-size:11px;font-weight:800;color:#2563eb;margin-right:12px;flex-shrink:0;">3</span>
              <span style="font-size:13px;color:#374151;line-height:1.6;">Recibe su cotización en <strong>un día hábil</strong>.</span>
            </td>
          </tr>
        </table>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:14px 18px;">
          <p style="margin:0;font-size:13px;color:#15803d;line-height:1.6;">
            Si tiene preguntas urgentes o documentos adicionales, responda a este correo o contáctenos directamente.
          </p>
        </div>
      </td>
    </tr>

    <tr>
      <td style="background:#f7f8fa;padding:18px 32px;border:1px solid #e5e7eb;border-top:none;">
        <p style="margin:0 0 4px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;">Contáctenos</p>
        <p style="margin:0;font-size:12px;color:#374151;">
          <a href="mailto:ggm@globalgatemexico.com" style="color:#2563eb;text-decoration:none;">ggm@globalgatemexico.com</a>
          &nbsp;·&nbsp;
          <a href="tel:+528121654040" style="color:#2563eb;text-decoration:none;">+52 812 165 4040</a>
        </p>
      </td>
    </tr>

    <tr>
      <td style="background:#1e293b;padding:20px 32px;border-radius:0 0 8px 8px;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#e2e8f0;">Global Gate México</p>
        <p style="margin:0;font-size:10px;color:#475569;">Agente de Carga Internacional · Despacho Aduanal · Mercancías Peligrosas</p>
        <p style="margin:8px 0 0;font-size:10px;color:#475569;">Este es un correo automático de confirmación. Nuestro equipo se comunicará desde ggm@globalgatemexico.com</p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>` : `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Quote Request Received — Global Gate México</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <tr>
      <td style="background:#0d1729;padding:28px 32px 0;border-radius:8px 8px 0 0;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#60a5fa;">Global Gate México</p>
        <h1 style="margin:0 0 20px;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Quote Request Received</h1>
        <div style="background:#2563eb;height:3px;"></div>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:36px 32px 28px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
        <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;">
          Dear <strong>${contact_name}</strong>,
        </p>
        <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;">
          Thank you for contacting Global Gate México. We have successfully received your freight quote request and it is now under review by our logistics team.
        </p>

        <div style="background:#f7f8fa;border:1px solid #e5e7eb;border-radius:6px;padding:20px;margin:24px 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;">Your Reference Number</p>
          <p style="margin:0 0 8px;font-size:20px;font-weight:800;color:#111827;font-family:'Courier New',monospace;letter-spacing:0.05em;">${referenceId}</p>
          <p style="margin:0;font-size:11px;color:#6b7280;">Please keep this reference for any future correspondence.</p>
        </div>

        <p style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#374151;">What happens next</p>
        <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;vertical-align:top;">
              <span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;width:24px;height:24px;text-align:center;line-height:24px;font-size:11px;font-weight:800;color:#2563eb;margin-right:12px;flex-shrink:0;">1</span>
              <span style="font-size:13px;color:#374151;line-height:1.6;">Our specialists review your shipment requirements and any documentation submitted.</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;vertical-align:top;">
              <span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;width:24px;height:24px;text-align:center;line-height:24px;font-size:11px;font-weight:800;color:#2563eb;margin-right:12px;flex-shrink:0;">2</span>
              <span style="font-size:13px;color:#374151;line-height:1.6;">We prepare a tailored freight quotation for your specific cargo and route.</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;vertical-align:top;">
              <span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;width:24px;height:24px;text-align:center;line-height:24px;font-size:11px;font-weight:800;color:#2563eb;margin-right:12px;flex-shrink:0;">3</span>
              <span style="font-size:13px;color:#374151;line-height:1.6;">You receive your quotation within <strong>one business day</strong>.</span>
            </td>
          </tr>
        </table>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:14px 18px;">
          <p style="margin:0;font-size:13px;color:#15803d;line-height:1.6;">
            If you have any urgent questions or additional documents to share, please reply to this email or contact us directly.
          </p>
        </div>
      </td>
    </tr>

    <tr>
      <td style="background:#f7f8fa;padding:18px 32px;border:1px solid #e5e7eb;border-top:none;">
        <p style="margin:0 0 4px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;">Contact Us</p>
        <p style="margin:0;font-size:12px;color:#374151;">
          <a href="mailto:ggm@globalgatemexico.com" style="color:#2563eb;text-decoration:none;">ggm@globalgatemexico.com</a>
          &nbsp;·&nbsp;
          <a href="tel:+528121654040" style="color:#2563eb;text-decoration:none;">+52 812 165 4040</a>
        </p>
      </td>
    </tr>

    <tr>
      <td style="background:#1e293b;padding:20px 32px;border-radius:0 0 8px 8px;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#e2e8f0;">Global Gate México</p>
        <p style="margin:0;font-size:10px;color:#475569;">International Freight Forwarding · Customs Clearance · Dangerous Goods</p>
        <p style="margin:8px 0 0;font-size:10px;color:#475569;">This is an automated confirmation. Our team will reach out from ggm@globalgatemexico.com</p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  // ── Send emails ──────────────────────────────────────────────────────────────
  if (!RESEND_API_KEY) {
    console.warn('[freight-quote-request] RESEND_API_KEY not set — skipping email');
    return new Response(JSON.stringify({ ok: true, referenceId, warning: 'email skipped' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 1. Notification to GGM team
  const notifSubject = `[${company_name}] Quote Request ${referenceId} — ${commodity}`;
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Global Gate México <noreply@globalgatemexico.com>',
      to: [NOTIFICATION_EMAIL],
      subject: notifSubject,
      html: notificationHtml,
    }),
  });

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    console.error('[freight-quote-request] Resend notification error:', errText);
    return new Response(JSON.stringify({ ok: true, referenceId, warning: 'notification email failed: ' + errText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 2. Auto-response to client (non-fatal if it fails)
  if (contact_email) {
    const autoResRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Global Gate México <noreply@globalgatemexico.com>',
        to: [contact_email],
        subject: clientSubject,
        html: clientHtml,
      }),
    });
    if (!autoResRes.ok) {
      const errText = await autoResRes.text();
      console.warn('[freight-quote-request] Auto-response email failed:', errText);
    } else {
      console.log('[freight-quote-request] Auto-response sent to:', contact_email);
    }
  }

  return new Response(JSON.stringify({ ok: true, referenceId }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
