import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const ALLOWED_FIELDS = [
  'dgd',
  'sds_1','sds_2','sds_3','sds_4','sds_5',
  'photo_1','photo_2','photo_3','photo_4','photo_5',
] as const
type FieldName = typeof ALLOWED_FIELDS[number]

// Signed upload URLs expire in 10 minutes — enough to upload, too short to abuse
const UPLOAD_URL_TTL = 60 * 10

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
    const { sessionToken, fields } = await req.json() as {
      sessionToken: string
      fields: string[]
    }

    if (!sessionToken) return json({ error: 'sessionToken requerido' }, 400)
    if (!Array.isArray(fields) || fields.length === 0) {
      return json({ error: 'fields debe ser un arreglo no vacío' }, 400)
    }

    // Reject any field not in the allowlist
    const invalid = fields.filter(f => !(ALLOWED_FIELDS as readonly string[]).includes(f))
    if (invalid.length > 0) {
      return json({ error: `Campos no permitidos: ${invalid.join(', ')}` }, 400)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Validate session token and status
    const { data: order, error: fetchErr } = await supabase
      .from('dg_precheck_orders')
      .select('id, status')
      .eq('checkout_session_token', sessionToken)
      .single()

    if (fetchErr || !order) return json({ error: 'Sesión no encontrada' }, 404)
    if (order.status !== 'paid' && order.status !== 'docs_received') {
      return json({ error: `La orden no está en estado pagado (estado actual: ${order.status})` }, 403)
    }

    // Generate one signed upload URL per requested field (upsert: true allows re-upload)
    const urls: Record<string, string> = {}
    for (const field of fields as FieldName[]) {
      const path  = `${order.id}/${field}`
      const { data, error } = await supabase.storage
        .from('precheck-docs')
        .createSignedUploadUrl(path, { upsert: true })

      if (error || !data?.signedUrl) {
        console.error(`[create-precheck-upload-urls] signed URL error for ${field}:`, error)
        return json({ error: `No se pudo generar URL de carga para ${field}` }, 500)
      }

      urls[field] = data.signedUrl
    }

    return json({ urls, orderId: order.id })
  } catch (err) {
    console.error('[create-precheck-upload-urls]', err)
    return json({ error: err instanceof Error ? err.message : 'Error interno' }, 500)
  }
})
