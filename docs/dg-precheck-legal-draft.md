# GGM DG Pre-Check — Borrador de Textos Legales

> **BORRADOR INTERNO — NO PUBLICAR EN EL SITIO WEB**
> Revisión pendiente por asesor legal antes de su inclusión en el Aviso de Privacidad
> y en los Términos y Condiciones del sitio www.globalgatemexico.com.
>
> Fecha de elaboración: noviembre 2026

---

## 1. Lista de verificación de privacidad (uso interno)

> Esta sección reemplaza el borrador anterior del Aviso de Privacidad Simplificado. El texto definitivo para publicación en el sitio web deberá ser redactado por el asesor legal.

**Datos que se recaban para el servicio DG Pre-Check:**

- [ ] Nombre, empresa, correo, teléfono y país de facturación del solicitante.
- [ ] Número de bultos y entradas DG (número ONU, clase, nombre de embarque).
- [ ] Documentos: DGD (PDF, obligatorio), Fichas de Datos de Seguridad — SDS/FDS (PDF, opcionales, hasta 5), y fotografías del embarque (JPG/PNG/WebP, obligatorio al menos 1).
- [ ] Referencia y capture ID de PayPal. GGM **no** almacena número de tarjeta ni credenciales de pago.
- [ ] Fecha y versión de aceptación de términos (`accepted_terms_at`, `terms_version`).

**No se recaban:**

- Datos fiscales (RFC, Razón Social, Régimen Fiscal, CP Fiscal, Uso CFDI) — el área de contabilidad los solicita directamente al cliente para la emisión de CFDI, fuera del formulario web.
- Origen y destino del embarque — no son campos del formulario; forman parte del DGD que el cliente carga.

**Retención (referencia para redacción legal):**

Los archivos (DGD, SDS, fotos) se eliminan del Storage 90 días después del evento de cierre del estado. Los registros de orden y de entradas DG no se eliminan nunca (retención indefinida para auditoría interna). Los registros de webhook de PayPal se eliminan a los 90 días.

**Pendientes para el asesor legal:**

- [ ] Redactar aviso completo bajo LFPDPPP con domicilio fiscal de GGM.
- [ ] Confirmar correo para derechos ARCO.
- [ ] Determinar si la retención indefinida de registros de orden requiere justificación legal explícita.
- [ ] Evaluar si se requiere registro ante el INAI.

---

## 2. Términos y Condiciones — Sección adicional propuesta

### 2.1 Descripción del Servicio

El servicio GGM DG Pre-Check consiste en la revisión técnica de una Declaración de Mercancías Peligrosas (DGD) elaborada por el cliente, con el objetivo de identificar posibles errores u omisiones antes de presentarla ante la aerolínea o agente de carga. El servicio aplica exclusivamente a:

- **Modalidad:** Flete aéreo (air freight).
- **Cobertura geográfica:** México, Estados Unidos y Canadá (origen o destino).
- **Límites de alcance:** máximo 1 (una) DGD por orden, máximo 5 (cinco) bultos y 5 (cinco) entradas de mercancías peligrosas por DGD.
- **Exclusiones:** Clase 7 (materiales radiactivos) queda expresamente excluida del servicio.

### 2.2 Precio y Pago

El precio del servicio es de **USD $80.00 (ochenta dólares de los Estados Unidos de América)** más el Impuesto al Valor Agregado (IVA) del 16 % cuando corresponda según la siguiente regla:

- **Con IVA (16 %):** clientes con domicilio fiscal en México o con establecimiento permanente en México. Total: USD $92.80.
- **Sin IVA:** clientes con domicilio fiscal en Estados Unidos o Canadá sin establecimiento en México. Total: USD $80.00.

El cliente selecciona su país de facturación en el formulario de contratación. El cálculo del impuesto es realizado exclusivamente por los sistemas de GGM; el navegador del cliente no participa en dicho cálculo.

El pago se realiza mediante PayPal en dólares americanos (USD). La orden se activa únicamente cuando GGM confirma la captura exitosa del pago. GGM se reserva el derecho de modificar el precio del servicio en cualquier momento, sin que ello afecte las órdenes ya pagadas.

### 2.3 Tiempo de Entrega

GGM se compromete a entregar el dictamen de revisión en un plazo **máximo de 2 (dos) horas hábiles** contadas desde la recepción de todos los documentos requeridos (Declaración de Mercancías Peligrosas — DGD — y al menos una fotografía del embarque), siempre que la orden se reciba dentro del horario de atención:

- **Horario de atención:** lunes a viernes, de 9:00 a 17:00, hora del Centro de México (CDMX / CST/CDT).
- Las órdenes recibidas fuera de este horario o en días festivos oficiales de México serán procesadas al inicio del siguiente día hábil.

El cómputo de las 2 horas hábiles inicia en el momento en que GGM recibe la notificación simultánea de: (a) pago confirmado y (b) carga completa de los documentos obligatorios. El pago por sí solo no inicia el cómputo.

La factura (CFDI) correspondiente será emitida por el área de contabilidad de GGM y enviada por separado al correo del cliente. La emisión no es automática; el área de contabilidad se pondrá en contacto con el cliente para recabar los datos fiscales necesarios.

### 2.4 Política de Reembolsos

| Situación | Política |
|-----------|----------|
| El cliente solicita cancelación **antes** de cargar los documentos | Reembolso completo del monto cobrado, sujeto a los tiempos de procesamiento de PayPal. |
| El cliente solicita cancelación **después** de cargar los documentos pero antes de que GGM inicie la revisión | Reembolso del 50 % del monto cobrado. |
| GGM inicia la revisión técnica | Sin reembolso, independientemente del resultado del dictamen. |
| El servicio no es completado en el tiempo prometido por causas imputables a GGM | Reembolso completo del monto cobrado. |
| El embarque supera los límites del servicio (más de 5 bultos o más de 5 entradas DG) **y el cliente ya realizó el pago** | El monto pagado se **acredita** a la cotización especial correspondiente, previa solicitud formal del cliente. No aplica devolución en efectivo en este supuesto. |

Para solicitar un reembolso o acreditamiento, el cliente debe enviar un correo a ggm@globalgatemexico.com indicando el número de folio de la orden (formato `PCK-XXXXXXX`). Los reembolsos se procesan a través de PayPal y pueden tardar de 3 a 5 días hábiles en reflejarse.

### 2.5 Limitaciones de Responsabilidad y Alcance del Dictamen

- **Naturaleza del dictamen:** El dictamen emitido por GGM DG Pre-Check constituye una revisión técnica de asistencia profesional. **No reemplaza ni exime al expedidor (shipper) de su responsabilidad legal** de clasificar, envasar, marcar, etiquetar y documentar correctamente las mercancías peligrosas conforme a la normativa aplicable (IATA DGR, 49 CFR, TC TP 14850, entre otras).
- **Responsabilidad del expedidor:** El expedidor es en todo momento el responsable legal ante las autoridades aeronáuticas y de transporte por el contenido de la DGD y el cumplimiento de la regulación. Un dictamen favorable de GGM DG Pre-Check no garantiza la aceptación de la carga por parte de la aerolínea ni la ausencia de observaciones por parte de las autoridades competentes.
- **Exactitud de la información:** GGM revisará únicamente los documentos e información proporcionados por el cliente. Si la información proporcionada es incompleta, incorrecta o no refleja la carga real, el dictamen emitido carecerá de valor técnico y GGM no asumirá responsabilidad alguna por los errores derivados de dicha inexactitud.
- **Límite de responsabilidad:** En todo caso, la responsabilidad máxima de GGM frente al cliente por cualquier reclamación derivada del servicio DG Pre-Check quedará limitada al monto pagado por la orden en cuestión.
- **Herramienta de verificación interna:** GGM utiliza internamente herramientas especializadas de verificación reglamentaria para la prestación de este servicio. GGM no hace declaraciones sobre la identidad, nombre o marca de dichas herramientas en el sitio web, formularios, correos electrónicos ni en ningún material publicitario o comercial.

### 2.6 Documentos Aceptados

| Documento | Formato | Obligatoriedad | Límite por orden |
|-----------|---------|---------------|-----------------|
| Declaración de Mercancías Peligrosas (DGD) | PDF únicamente | **Obligatorio** | 1 archivo |
| Fichas de Datos de Seguridad (SDS / FDS) | PDF únicamente | Opcional | Hasta 5 archivos (uno por entrada DG) |
| Fotografías del embarque | JPG, JPEG, PNG o WebP | **Obligatorio al menos 1** | Hasta 5 archivos |

- Tamaño máximo por archivo: 20 MB.
- El servicio no se activa (el SLA de 2 horas no inicia) hasta que se reciben la DGD **y** al menos una fotografía.
- Los archivos cargados serán eliminados conforme a la política de retención descrita en el Aviso de Privacidad (sección [X]).

### 2.7 Confidencialidad

GGM tratará como confidencial toda la información y los documentos proporcionados por el cliente para la prestación del servicio DG Pre-Check. Dicha información no será divulgada a terceros sin el consentimiento expreso del cliente, salvo cuando sea requerida por autoridades competentes en el ejercicio de sus atribuciones legales.

---

## 3. Notas de implementación (para el equipo de GGM)

- [ ] Revisar y validar con asesor legal antes de publicar.
- [ ] Determinar el domicilio fiscal exacto para incluirlo en el Aviso de Privacidad.
- [ ] Confirmar el correo oficial para derechos ARCO (`privacidad@globalgatemexico.com` u otro).
- [ ] Integrar el texto del Aviso de Privacidad como nueva sección en `/aviso-legal` (ruta ES) y `/legal` (ruta EN).
- [ ] Integrar los Términos y Condiciones como nueva sección en las mismas páginas.
- [ ] Agregar un checkbox de aceptación de Términos y Condiciones en el formulario de checkout de DG Pre-Check (paso 1 o paso 2), con enlace al texto.
- [ ] Revisar si la limitación de responsabilidad en USD requiere cláusula especial bajo derecho mexicano.
- [ ] Evaluar si se requiere registro del tratamiento de datos ante el INAI.
