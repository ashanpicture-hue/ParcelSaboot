# ParcelSaboot — Privacy Policy

**Last Updated:** 2026-10-31

## Who we are

ParcelSaboot (ثبوت) is a proof-collection tool for Pakistani e-commerce sellers. We record continuous, timestamped packing videos and return-opening clips that serve as evidence for return claims on marketplaces like Daraz and couriers like TCS, Leopards, and PostEx.

**Controller:** ParcelSaboot  
**Based in:** Pakistan  
**Contact:** hello@parcelsaboot.com  
**Physical address:** Not provided — independent developer, no physical address published

> **⚠️ Attorney review:** This privacy policy has NOT been reviewed by a licensed attorney. It is a draft produced from an automated code audit. Have a qualified lawyer in Pakistan review it before you rely on it in production, especially if you monetize the product or handle EU, UK, or California users at scale.

## What this policy covers

This policy explains what personal information we collect, how we use it, who we share it with, and your rights over that information. It applies to the ParcelSaboot website at https://parcelsaboot.vercel.app/ and to the early-access signup flow.

## Information we collect

### Information you give us directly

When you sign up for early access through the form on our site, we collect:

- **Store name** — the name of your online shop or business
- **WhatsApp number** — your phone number on WhatsApp, used to message you about setup
- **Where you sell** — the marketplace or platform you sell on (Daraz, Instagram/WhatsApp, your own website, or more than one)

This data is submitted through the signup form in `src/SabootLanding.jsx` (lines 907–911) and sent to our serverless function at `api/submit-signup.js` (lines 53–58), which stores it in a Supabase table called `early_access_signups` (`api/submit-signup.js` lines 64–81).

### Information collected automatically

When you visit our site, we use Google Analytics 4 (GA4, measurement ID `G-DLB08DLTKL`) to collect page-view and session data. This is loaded in `index.html` (lines 16–23). GA4 may set cookies and collect information such as your IP address, browser type, and pages visited. This is standard website analytics; we do not use it to identify individual users beyond aggregated, anonymized reporting.

### Video recordings

If you use the ParcelSaboot recording feature, your packing and return-opening video clips are stored in private cloud storage on Supabase, encrypted at rest. Clips are associated with your store account. Clips you share go out as private links that stop working after 30 days. Video retention depends on your plan: 30 days on Free, 180 days on Standard, and one year on Growth. Videos linked to an open claim are kept until the claim closes.

## How we use your information

- To process your early-access signup and confirm you are not a duplicate (we check for duplicate WhatsApp numbers before inserting, `api/submit-signup.js` lines 64–77)
- To message you on WhatsApp about setting up your first packing station
- To operate and improve the website and recording features
- To enforce our Terms of Service and protect against fraud or abuse
- To comply with legal obligations

We do not sell your personal information. We do not use your videos or signup data to train AI models.

## Who we share your information with

### Service providers

- **Supabase** — hosts our database and file storage. Your signup data and videos are stored on Supabase servers. Supabase is a sub-processor; we have a data processing agreement with them.
- **Vercel** — hosts our serverless function that receives signup submissions.
- **Google (GA4)** — receives analytics data from your browser when you visit the site.

We do not share your personal information with Daraz, TCS, Leopards, PostEx, or any other courier or marketplace. We are not affiliated with or integrated with them (see our site footer disclaimer).

## Your rights

Depending on where you are located, you may have the right to:

- Request a copy of the personal information we hold about you
- Request correction of inaccurate information
- Request deletion of your information
- Object to or restrict certain processing
- Withdraw consent where we rely on it

**There is no self-service export or deletion endpoint in the current version of the site.** To exercise any of these rights, contact us at hello@parcelsaboot.com and we will handle your request manually. We aim to respond within 30 days.

## Data retention

- **Signup data (store name, WhatsApp, selling platform):** Kept until you ask us to delete it, or until the early-access program ends.
- **Video clips:** 30 days (Free), 180 days (Standard), 1 year (Growth). Clips linked to an open claim are kept until the claim closes.
- **Analytics data:** Retained by Google per Google's own retention policies; we do not control this directly.

## Cookies and similar technologies

Our site uses Google Analytics 4, which sets cookies for session and traffic measurement. We do not run our own advertising or tracking cookies. If you do not want GA4 cookies, you can disable cookies in your browser or use a browser extension that blocks analytics scripts.

We do not currently display a cookie banner. If you are subject to the EU ePrivacy Directive or similar rules, you should add one before serving EU users.

## Children

ParcelSaboot is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has given us personal information, contact us at hello@parcelsaboot.com and we will delete it.

## International transfers

Your data is stored on Supabase, which may process data in multiple regions including outside Pakistan. By using ParcelSaboot, you consent to this transfer. If you are in the EU or UK, note that we do not currently have an EU/UK representative (Article 27 GDPR) — add one if you serve EU/UK users at scale.

## Security

We use Supabase with row-level security and encryption at rest for video storage. The Supabase service role key is kept secret on the server side (`api/submit-signup.js` line 6; `src/supabase.js` line 1 — no Supabase client on the frontend). Signup submissions are rate-limited to 3 requests per minute per IP (`api/submit-signup.js` lines 8–38).

No method of transmission or electronic storage is 100% secure. We cannot guarantee absolute security.

## Changes to this policy

We may update this privacy policy from time to time. When we make material changes, we will post the new version on this page with an updated "Last Updated" date. Your continued use of the site after changes are posted constitutes acceptance of the revised policy.

## Contact us

Questions about this policy or your data: hello@parcelsaboot.com

---

**Drafting notes (for the maintainer):**

- Publish date is set to 2026-10-31.
- Contact email is set to hello@parcelsaboot.com — verify this mailbox works before publishing.
- No physical address is published (independent developer). If you later add marketing emails, include a physical address per CAN-SPAM.
- The code audit found no self-service data export or deletion endpoint. If you build one, update the "Your rights" section to describe it.
- If you add email marketing, add a CAN-SPAM-compliant physical address and one-click unsubscribe to every marketing email footer.
- GDPR/UK GDPR/CCPA citations are flagged `[model knowledge — verify]` — confirm applicability with a lawyer before relying on them.
