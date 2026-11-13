# DG Pre-Check Lite — Deploy Checklist

## 1. SQL — Execute Once (Supabase Dashboard)

Run `supabase/dg-precheck-requests.sql` from the SQL Editor in the Supabase dashboard.
**Never execute directly against production without review.**

## 2. New Secrets (Supabase Edge Function environment)

| Secret | Default fallback | Notes |
|--------|-----------------|-------|
| `PRECHECK_NOTIFY_EMAIL` | `antonio.perea@globalgatemexico.com,cesar.betancourt@globalgatemexico.com` | Comma-separated team recipients |
| `PRECHECK_ACCOUNTING_EMAIL` | `yareni@globalgatemexico.com` | Accounting recipient for CFDI billing |

Existing secrets reused (must already be set):
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3. Vercel Environment Variables

| Variable | Environment | Notes |
|----------|------------|-------|
| `VITE_PAYPAL_PRECHECK_LINK_MX` | Production | Fixed-price PayPal link for México (USD 92.80 incl. IVA) |
| `VITE_PAYPAL_PRECHECK_LINK_INTL` | Production | Fixed-price PayPal link for US/CA (USD 80.00) |
| `VITE_TURNSTILE_SITE_KEY` | Production | Already set — no action needed |

## 4. Creating PayPal Fixed-Price Links

### VITE_PAYPAL_PRECHECK_LINK_MX (USD 92.80)
1. Log in to PayPal Business account
2. Go to **Tools → PayPal Buttons** (or use PayPal.me / Pay Link feature)
3. Create a fixed-price pay link: amount **92.80 USD**, no shipping, no quantity selector
4. Description: "DG Pre-Check — Revisión Previa DG (incl. IVA 16%)"
5. Set the URL as `VITE_PAYPAL_PRECHECK_LINK_MX`

### VITE_PAYPAL_PRECHECK_LINK_INTL (USD 80.00)
1. Same steps as above, amount **80.00 USD**
2. Description: "DG Pre-Check Review"
3. Set the URL as `VITE_PAYPAL_PRECHECK_LINK_INTL`

## 5. Deploy Command

```bash
npx supabase functions deploy precheck-request
```

Also deploy to Vercel via your normal CI/CD pipeline (`git push` to master after merge).

## 6. Database Considerations

- `pg_cron` and `pg_net` extensions are **not** required for this feature (no webhooks, no scheduled jobs).
- The `quote-documents` bucket public INSERT policy has no path restriction, so the `precheck/` prefix is permitted without policy changes.

## 7. Operational Procedure

After a submission arrives:

1. **Verify payment**: Open PayPal dashboard, search for transaction ID from the team email.
2. **Review documents**: Use the signed download links in the team email (valid 7 days).
3. **Start 2-hour clock**: Once payment is confirmed and documentation is complete.
4. **Issue PDF report**: Send to customer's email (contact_email from team email).
5. **CFDI**: Accounting team contacts customer via their email.

## 8. Test Plan

### Happy path
- [ ] **TC-01** EN form: complete submission with 1 PDF + 4 PNGs + correct TX ID → 200, 3 emails, DB row
- [ ] **TC-02** ES form: same as TC-01 in Spanish → email subjects in Spanish
- [ ] **TC-03** MX billing country: price shows USD 92.80, correct PayPal link opens
- [ ] **TC-04** US/CA billing country: price shows USD 80.00, correct PayPal link opens

### File validation
- [ ] **TC-05** Wrong file type (`.docx`): client rejects with error message, no upload
- [ ] **TC-06** WebP image: client rejects — WebP is not in accepted types
- [ ] **TC-07** < 4 photos (e.g. 3 PNGs + 1 PDF): submit blocked, error shown
- [ ] **TC-08** No PDF (5 PNGs only): submit blocked, error shown
- [ ] **TC-09** > 16 files: submit blocked, error shown
- [ ] **TC-10** < 5 files total: submit blocked, error shown
- [ ] **TC-11** File > 20 MB: client rejects with error message

### DG entry validation
- [ ] **TC-12** Total packages = 6 across 2 entries: over-limit warning shown, submit disabled
- [ ] **TC-13** 1 entry with 0 packages: validate rejects
- [ ] **TC-14** 6 UN entries (attempt to add 6th): "Add" button disappears at entry 5

### TX ID validation
- [ ] **TC-15** TX ID < 10 chars: submit blocked
- [ ] **TC-16** TX ID with special chars (e.g. `-`): stripped automatically on input
- [ ] **TC-17** Duplicate TX ID: team email shows ⚠ warning, submission still succeeds

### Error handling
- [ ] **TC-18** VITE_PAYPAL_PRECHECK_LINK_MX not set: button replaced by "Pago no disponible…" message
- [ ] **TC-19** VITE_TURNSTILE_SITE_KEY not set: "Servicio no disponible" shown, submit disabled
- [ ] **TC-20** TURNSTILE_SECRET_KEY not set on function: 503 returned from Edge Function

### UI / UX
- [ ] **TC-21** Mobile viewport (375px): form is usable, no horizontal scroll
- [ ] **TC-22** UN number normalisation: type `3480` → blurs to `UN3480`; type `un 3480` → `UN3480`
- [ ] **TC-23** Comments counter: shows `X/1000` and stops at 1000 chars

### Email recipients
- [ ] **TC-24** Team email arrives at both `antonio.perea@` and `cesar.betancourt@`
- [ ] **TC-25** Accounting email arrives at `yareni@`
- [ ] **TC-26** Client confirmation email arrives at address entered in form, reply-to = `ggm@`
