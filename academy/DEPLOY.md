# GGM Academy — Deployment Notes

## Subdomain
academy.globalgatemexico.com

## How to deploy (Vercel)

1. Create a **new Vercel project** (separate from the main site).
2. Set the **root directory** to `academy/` when importing the repo, or deploy this folder as its own repo.
3. In Vercel → Project Settings → Domains, add: `academy.globalgatemexico.com`
4. Add the CNAME record in your DNS: `academy → cname.vercel-dns.com`
5. No build step required — this is a static HTML file.

## Thinkific Integration (future)

The HTML file contains `<!-- THINKIFIC INTEGRATION NOTE -->` comments marking
where LMS content should be embedded. When the platform launches:

- Replace the program card interior (`section#program`) with a Thinkific
  course embed or enrollment widget.
- Replace the "Launching Soon" disabled button with the live enrollment CTA.
- The page shell, header, footer, and credential section require no changes.
