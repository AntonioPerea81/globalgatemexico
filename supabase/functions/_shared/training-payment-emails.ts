const FROM_EMAIL = 'Global Gate México <noreply@globalgatemexico.com>';
const ADMIN_EMAIL = Deno.env.get('TRAINING_NOTIFICATION_EMAIL') ?? 'antonio.perea@globalgatemexico.com';

const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const money = (cents: number, currency: string) => new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency,
}).format(cents / 100);

const displayDate = (date: string) => new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${date}T12:00:00Z`));

const row = (label: string, value: unknown) => `
  <tr>
    <td style="padding:7px 12px 7px 0;color:#64748b;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
    <td style="padding:7px 0;color:#0f172a;vertical-align:top">${escapeHtml(value || '—')}</td>
  </tr>`;

const layout = (title: string, content: string) => `<!doctype html>
<html lang="en"><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a">
  <div style="max-width:680px;margin:0 auto;padding:30px 16px">
    <div style="background:#071525;color:#fff;padding:22px 28px;border-radius:12px 12px 0 0">
      <div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd">Global Gate México</div>
      <h1 style="font-size:24px;line-height:1.25;margin:8px 0 0">${escapeHtml(title)}</h1>
    </div>
    <div style="background:#fff;padding:28px;border-radius:0 0 12px 12px">${content}</div>
  </div>
</body></html>`;

export async function sendTrainingPaymentEmails(admin: any, orderId: string) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');

  const { data: order, error: orderError } = await admin.from('training_orders').select(
    'id, reference, course_id, cohort_id, buyer_name, buyer_email, buyer_phone, company_name, billing_country, referral_code, seats, subtotal_cents, tax_cents, total_cents, currency, paypal_order_id, paypal_capture_id, paid_at',
  ).eq('id', orderId).single();
  if (orderError || !order) throw orderError ?? new Error('Training order not found for email');

  const [{ data: course, error: courseError }, { data: cohort, error: cohortError }, { data: participants, error: participantsError }] = await Promise.all([
    admin.from('training_courses').select('title, function_code, training_type').eq('id', order.course_id).single(),
    admin.from('training_cohorts').select('code, start_date, end_date, start_time, end_time, timezone').eq('id', order.cohort_id).single(),
    admin.from('training_participants').select('full_name, email, job_title').eq('order_id', order.id).order('created_at'),
  ]);
  if (courseError || cohortError || participantsError || !course || !cohort) {
    throw courseError ?? cohortError ?? participantsError ?? new Error('Training details not found for email');
  }

  const participantRows = (participants ?? []).map((participant: any, index: number) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${index + 1}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(participant.full_name)}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(participant.email)}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(participant.job_title || '—')}</td>
    </tr>`).join('');
  const participantNames = (participants ?? []).map((participant: any) => escapeHtml(participant.full_name)).join(', ');
  const courseLabel = `${course.title} (${course.function_code}, ${course.training_type})`;
  const dates = cohort.start_date === cohort.end_date
    ? displayDate(cohort.start_date)
    : `${displayDate(cohort.start_date)}–${displayDate(cohort.end_date)}`;
  const schedule = `${dates}, ${cohort.start_time.slice(0, 5)}–${cohort.end_time.slice(0, 5)} ${cohort.timezone}`;
  const referral = order.referral_code || 'Organic / no referral code';

  const adminHtml = layout('New paid training enrollment', `
    <p style="margin-top:0">A payment has been confirmed. The enrollment is ready for administrative follow-up.</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px">
      ${row('Reference', order.reference)}
      ${row('Course', courseLabel)}
      ${row('Cohort', cohort.code)}
      ${row('Schedule', schedule)}
      ${row('Buyer', order.buyer_name)}
      ${row('Email', order.buyer_email)}
      ${row('Phone', order.buyer_phone)}
      ${row('Company', order.company_name)}
      ${row('Country', order.billing_country)}
      ${row('Referral Code', referral)}
      ${row('Seats', order.seats)}
      ${row('Subtotal', money(order.subtotal_cents, order.currency))}
      ${row('Tax (0%)', money(order.tax_cents, order.currency))}
      ${row('Total paid', money(order.total_cents, order.currency))}
      ${row('PayPal order', order.paypal_order_id)}
      ${row('PayPal capture', order.paypal_capture_id)}
      ${row('Paid at', order.paid_at)}
    </table>
    <h2 style="font-size:17px;margin:26px 0 8px">Participants</h2>
    <table style="border-collapse:collapse;width:100%;font-size:13px">
      <thead><tr style="background:#eff6ff"><th style="padding:8px;text-align:left">#</th><th style="padding:8px;text-align:left">Name</th><th style="padding:8px;text-align:left">Email</th><th style="padding:8px;text-align:left">Job title</th></tr></thead>
      <tbody>${participantRows}</tbody>
    </table>`);

  const buyerHtml = layout('Your enrollment is confirmed', `
    <p style="margin-top:0">Hello ${escapeHtml(order.buyer_name)},</p>
    <p>Thank you. We have received your payment and confirmed your enrollment with Global Gate México.</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px;margin:18px 0">
      ${row('Confirmation', order.reference)}
      ${row('Course', courseLabel)}
      ${row('Schedule', schedule)}
      ${row('Participants', participantNames)}
      ${row('Total paid', money(order.total_cents, order.currency))}
    </table>
    <p>We will email the live online access instructions and course preparation details before the training begins.</p>
    <p style="margin-bottom:0">Questions? Contact <a href="mailto:antonio.perea@globalgatemexico.com" style="color:#1454d4">antonio.perea@globalgatemexico.com</a>.</p>`);

  const response = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `training-payment-${order.id}`,
    },
    body: JSON.stringify([
      {
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Paid enrollment ${order.reference} · ${course.function_code} · ${order.seats} seat${order.seats === 1 ? '' : 's'}`,
        html: adminHtml,
      },
      {
        from: FROM_EMAIL,
        to: [order.buyer_email],
        reply_to: ADMIN_EMAIL,
        subject: `Enrollment confirmed · ${order.reference} · Global Gate México`,
        html: buyerHtml,
      },
    ]),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend batch failed (${response.status}): ${detail}`);
  }
}
