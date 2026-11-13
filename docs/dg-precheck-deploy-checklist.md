# GGM DG Pre-Check — Deploy Checklist

> **Restricciones de seguridad en vigor:**  
> No hacer merge a master, no ejecutar SQL contra Supabase en producción sin aprobación, no desplegar funciones sin seguir este checklist, no crear buckets fuera de este procedimiento, no cambiar secretos ni variables de entorno sin autorización. No tocar las funciones existentes de training ni su webhook.

---

## 1. Secretos requeridos en Supabase Edge Functions

Configura todos los siguientes secretos antes de desplegar. Ninguno tiene valor por defecto en producción; una función mal configurada responderá con 503 en lugar de comportarse de forma insegura.

| Secret | Descripción | Función(es) que lo usan |
|--------|-------------|------------------------|
| `PRECHECK_PAYPAL_CLIENT_ID` | Client ID de la app PayPal de Pre-Check (aislada de la de training) | `create-precheck-order`, `capture-precheck-order`, `paypal-webhook-precheck` |
| `PRECHECK_PAYPAL_CLIENT_SECRET` | Client Secret de la app PayPal de Pre-Check | `create-precheck-order`, `capture-precheck-order`, `paypal-webhook-precheck` |
| `PRECHECK_PAYPAL_ENV` | `sandbox` o `live` | `create-precheck-order`, `capture-precheck-order`, `paypal-webhook-precheck` |
| `PRECHECK_PAYPAL_WEBHOOK_ID` | Webhook ID del evento `PAYMENT.CAPTURE.COMPLETED` registrado en PayPal | `paypal-webhook-precheck` |
| `TURNSTILE_SECRET_KEY` | Secret key de Cloudflare Turnstile (**FAIL CLOSED**: si no está configurado, rechaza todo) | `create-precheck-order` |
| `PURGE_CRON_SECRET` | Bearer token para autorizar `purge-precheck-docs` y `precheck-sla-watch` (**FAIL CLOSED** en purge) | `purge-precheck-docs`, `precheck-sla-watch` |
| `PRECHECK_NOTIFY_EMAIL` | Correo(s) del buzón interno de operaciones, separados por coma (ej. `antonio.perea@...,cesar.betancourt@...`) | `notify-precheck`, `paypal-webhook-precheck`, `precheck-sla-watch` |
| `PRECHECK_ACCOUNTING_EMAIL` | Correo(s) de contabilidad para recibir confirmaciones de pago, separados por coma (ej. `yareni@...`) | `capture-precheck-order`, `paypal-webhook-precheck` |
| `PRECHECK_ACTION_SECRET` | Secreto HMAC-SHA256 para firmar tokens de acción de staff (**FAIL CLOSED**: si no está configurado → 503) | `precheck-order-action`, `notify-precheck`, `precheck-sla-watch` |
| `PRECHECK_SITE_URL` | URL base del sitio (ej. `https://www.globalgatemexico.com`), usado en enlaces de acción y de carga | `notify-precheck`, `precheck-sla-watch`, `paypal-webhook-precheck` |
| `PRECHECK_EXTRA_ORIGINS` | (Opcional) Origins adicionales permitidos en `create-precheck-order`, separados por coma, sin wildcards | `create-precheck-order` |
| `RESEND_API_KEY` | API key de Resend para correos transaccionales | Todas las que envían correo |
| `SUPABASE_URL` | URL del proyecto Supabase (inyectado automáticamente) | Todas |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (inyectado automáticamente) | Todas |

### Claves de prueba oficiales de Cloudflare Turnstile (sandbox)

Usar en desarrollo local y staging — **nunca en producción**.

| Tipo | Valor | Comportamiento |
|------|-------|----------------|
| Site key (siempre pasa) | `1x00000000000000000000AA` | El widget siempre pasa |
| Secret key (siempre pasa) | `1x0000000000000000000000000000000AA` | La verificación siempre pasa |
| Site key (siempre falla) | `2x00000000000000000000AB` | El widget siempre falla |
| Secret key (siempre falla) | `2x0000000000000000000000000000000AB` | La verificación siempre falla |

---

## 2. Preparación de base de datos

Ejecutar **en orden** en Supabase SQL Editor antes de desplegar las funciones.

```sql
-- Paso 1: crear tablas (solo para instalación nueva)
-- Ver supabase/dg-precheck-schema.sql completo

-- Paso 2: agregar columna files_purged_at si la tabla ya existe
ALTER TABLE public.dg_precheck_orders
  ADD COLUMN IF NOT EXISTS files_purged_at TIMESTAMPTZ;

-- Paso 3: crear el bucket de Storage (OBLIGATORIO)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'precheck-docs',
    'precheck-docs',
    false,
    20971520,
    ARRAY['application/pdf','image/jpeg','image/jpg','image/png','image/webp']
  )
  ON CONFLICT (id) DO NOTHING;

-- Paso 4: política RLS del bucket
CREATE POLICY IF NOT EXISTS "service_all_precheck_docs"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'precheck-docs') WITH CHECK (bucket_id = 'precheck-docs');
```

---

## 3. Orden de despliegue de Edge Functions

Desplegar en este orden para evitar ventanas de error:

1. `create-precheck-order` — crea órdenes y redirige a PayPal
2. `capture-precheck-order` — captura el pago al retorno de PayPal
3. `paypal-webhook-precheck` — confirma pago vía webhook (configurar URL en PayPal Developer Dashboard)
4. `create-precheck-upload-urls` — genera URLs firmadas de carga
5. `notify-precheck` — registra archivos y notifica al equipo
6. `purge-precheck-docs` — purga periódica (no programar aún hasta validar en sandbox)
7. `precheck-sla-watch` — alerta de SLA (no programar aún hasta validar en sandbox)

Comando de despliegue individual:
```bash
supabase functions deploy <nombre-de-funcion> --project-ref <project-ref>
```

---

## 4. Configuración del webhook en PayPal Developer Dashboard

1. Ir a **Developer Dashboard > My Apps & Credentials > [App de Pre-Check] > Webhooks**.
2. Agregar URL: `https://<project-ref>.supabase.co/functions/v1/paypal-webhook-precheck`
3. Seleccionar eventos:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.REFUNDED`
4. Copiar el **Webhook ID** generado y configurarlo como `PRECHECK_PAYPAL_WEBHOOK_ID`.

---

## 5. Plan de pruebas en Sandbox

### 5.1 Pago exitoso (happy path)
- [ ] Llenar el formulario con datos válidos (país MX → total USD 92.80, US/CA → USD 80.00)
- [ ] Completar el pago en PayPal Sandbox
- [ ] Verificar que el orden pasa a `paid` en la tabla `dg_precheck_orders`
- [ ] Verificar correo de confirmación recibido por el comprador
- [ ] Verificar que el webhook `PAYMENT.CAPTURE.COMPLETED` llega y se registra en `paypal_precheck_webhook_events`
- [ ] Subir DGD + al menos 1 foto → verificar que pasa a `docs_received`
- [ ] Verificar correo de notificación interna recibido en `PRECHECK_NOTIFY_EMAIL`

### 5.2 Pago cancelado
- [ ] Iniciar checkout y hacer clic en "Cancelar" en PayPal
- [ ] Verificar que se regresa a la página de cancelación
- [ ] Verificar que la orden permanece en `pending_payment`

### 5.3 Captura pendiente (PENDING)
- [ ] Usar cuenta sandbox configurada para retener pagos
- [ ] Verificar que `capture-precheck-order` responde con estado 402 sin procesar la orden
- [ ] Verificar que no se envía correo de confirmación

### 5.4 Webhook duplicado
- [ ] Reenviar manualmente el mismo `event_id` al endpoint del webhook
- [ ] Verificar respuesta 200 y mensaje "Already processed"
- [ ] Verificar que no se duplica el update en `dg_precheck_orders`

### 5.5 Webhook tardío (late webhook)
- [ ] Cambiar manualmente el estado de una orden de `pending_payment` a `docs_received`
- [ ] Reenviar webhook `PAYMENT.CAPTURE.COMPLETED` para esa orden
- [ ] Verificar que el estado NO retrocede a `paid` (update condicional)
- [ ] Verificar que el evento SÍ se registra en el log

### 5.6 Carga sin pago previo
- [ ] Intentar llamar a `notify-precheck` con `sessionToken` de una orden en `pending_payment`
- [ ] Verificar respuesta 400 "Estado inválido"

### 5.7 Excede límites de servicio
- [ ] Enviar formulario con `num_packages = 6` → esperar error 400 `EXCEEDS_LIMITS`
- [ ] Enviar formulario con `num_dg_entries = 6` → esperar error 400 `EXCEEDS_LIMITS`

### 5.8 Reembolso
- [ ] Iniciar reembolso desde PayPal Sandbox para una orden `paid`
- [ ] Verificar que el webhook `PAYMENT.CAPTURE.REFUNDED` llega
- [ ] Verificar que el estado de la orden cambia a `refunded`

### 5.9 Turnstile fail-closed
- [ ] Remover `TURNSTILE_SECRET_KEY` del ambiente de prueba
- [ ] Intentar crear una orden → esperar 503 "Servicio no disponible"
- [ ] Restaurar la clave de prueba y verificar que las órdenes se crean correctamente

### 5.10 Purge en sandbox
- [ ] Crear orden de prueba con `created_at` pasado a 91+ días (UPDATE SQL directo)
- [ ] Invocar `purge-precheck-docs` con el Bearer token de prueba
- [ ] Verificar que los archivos de Storage se eliminan
- [ ] Verificar que `dg_precheck_files` se borra pero `dg_precheck_orders` permanece
- [ ] Verificar que `files_purged_at` queda marcado en la orden

### 5.11 RLS — intento de inserción anónima
- [ ] Con la anon key de Supabase, intentar `INSERT INTO dg_precheck_orders (...)` directamente
- [ ] Verificar respuesta 403 / error de RLS (política solo permite service_role)
- [ ] Repetir para `dg_precheck_entries` y `dg_precheck_files`

### 5.12 Class 7 bloqueado en frontend y backend
- [ ] En el formulario, ingresar UN2915 (Class 7) → debe aparecer alerta inline y deshabilitar el botón Pay
- [ ] Enviar request directo a `create-precheck-order` con `hazard_class: "Class 7"` → esperar 422 `CLASS7_EXCLUDED`

### 5.13 Reemplazo de archivo (upsert de Storage)
- [ ] Subir DGD para una orden ya con DGD existente
- [ ] Verificar que `create-precheck-upload-urls` devuelve URL firmada con `upsert: true`
- [ ] Verificar que el archivo se sobreescribe, no duplica, en Storage

### 5.14 Rechazo de MIME type inválido
- [ ] Subir un archivo `.exe` renombrado como `.pdf` para el campo `dgd`
- [ ] Invocar `notify-precheck` → esperar 400 `INVALID_MIME` (el backend lee el Content-Type desde Storage)
- [ ] Subir imagen como `dgd` → esperar 400 `INVALID_MIME` (dgd requiere application/pdf)

### 5.15 Token de acción — verificación HMAC
- [ ] Generar token con `PRECHECK_ACTION_SECRET` correcto → verificar preview exitoso
- [ ] Modificar 1 carácter del token → esperar 401 `INVALID_TOKEN`
- [ ] Usar token expirado (exp en el pasado) → esperar 401 `TOKEN_EXPIRED`
- [ ] Reenviar token ya usado para `report_sent` → esperar success con `alreadyDone: true`

### 5.16 SLA watch — 2 niveles de alerta
- [ ] Crear orden en `docs_received`, `sla_alert_count = 0`, `created_at = ahora − 61 min`
  - [ ] Disparar `precheck-sla-watch` → verificar alerta Tier 1, `sla_alert_count` → 1
- [ ] Dejar la misma orden, `created_at = ahora − 121 min`, `sla_alert_count = 1`
  - [ ] Disparar `precheck-sla-watch` → verificar alerta Tier 2, `sla_alert_count` → 2
- [ ] Disparar una vez más → no debe enviarse alerta adicional (`sla_alert_count` ya es 2)
- [ ] Crear orden en `paid`, `sla_alert_count = 0`, `created_at = ahora − 25 h`
  - [ ] Disparar `precheck-sla-watch` → verificar alerta Tier 3, `sla_alert_count` → 1

---

## 6. Programación del cron (después de validar en sandbox)

```sql
-- Purge diario a las 3:00 AM UTC
SELECT cron.schedule(
  'purge-precheck-docs',
  '0 3 * * *',
  $$
    SELECT net.http_post(
      url := 'https://<project-ref>.supabase.co/functions/v1/purge-precheck-docs',
      headers := jsonb_build_object('Authorization', 'Bearer <PURGE_CRON_SECRET>'),
      body := '{}'::jsonb
    );
  $$
);

-- SLA watch cada 30 minutos (solo alerta en horario hábil CDMX)
SELECT cron.schedule(
  'precheck-sla-watch',
  '*/30 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://<project-ref>.supabase.co/functions/v1/precheck-sla-watch',
      headers := jsonb_build_object('Authorization', 'Bearer <PURGE_CRON_SECRET>'),
      body := '{}'::jsonb
    );
  $$
);
```

---

## 7. Variables de entorno — Frontend (Vercel)

Configurar en el panel de Vercel antes del primer deploy de producción:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Anon key pública de Supabase |
| `VITE_TURNSTILE_SITE_KEY` | `1x00000...` (sandbox) / clave real (prod) | Site key pública de Cloudflare Turnstile |

> Las claves de producción de Turnstile se obtienen en **Cloudflare Dashboard → Turnstile → Sites**. Las claves de prueba (`1x00000000000000000000AA`) son para desarrollo local únicamente.

---

## 8. Extensiones de Supabase requeridas

Habilitar en **Supabase Dashboard → Database → Extensions** antes de configurar el cron:

| Extensión | Propósito |
|-----------|-----------|
| `pg_cron` | Programar las tareas periódicas (purge, sla-watch) |
| `pg_net` | Realizar llamadas HTTP desde las tareas pg_cron |

> Sin estas extensiones, los comandos `cron.schedule` y `net.http_post` de la sección §6 fallarán con "function not found".

---

## 9. Notas de seguridad

- Las funciones de Pre-Check usan credenciales PayPal propias (`PRECHECK_PAYPAL_*`), completamente aisladas de las funciones de training.
- `TURNSTILE_SECRET_KEY` y `PURGE_CRON_SECRET` son **fail-closed**: si no están configurados, las funciones rechazan todas las peticiones en lugar de omitir los controles.
- Los paths de Storage son derivados por el servidor (`${order.id}/${fieldName}`); el cliente no puede inyectar rutas arbitrarias.
- Todos los datos de cliente en HTML de correo son escapados con `esc()` para prevenir XSS.
- El evento PayPal se registra en el log **después** del procesamiento exitoso; un fallo de procesamiento retorna 500 y permite que PayPal reintente.
- `PRECHECK_EXTRA_ORIGINS` acepta orígenes adicionales pero rechaza wildcards (`*`).
