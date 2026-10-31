# ParcelSaboot — Project Memory

## Legal documents
- Privacy Policy: `src/legal/PrivacyPolicy.md`
- Terms of Service: `src/legal/TermsOfService.md`
- Code-UI punch list: `specs/legal/code-ui-punch-list-2026-10-31.md`
- Intake: `.compliance-auditor/intake.md`
- Update rule: `memory/legal-docs-update-rule.md`
- Vercel config: `vercel.json`

## Real mailboxes
- Contact email: hello@parcelsaboot.com (set by independent developer, not yet verified as owned)

## Physical address
- None provided. No physical address published (independent developer).

## Attorney review
- None performed. Both legal documents carry a disclaimer stating no attorney review.

## Data flows
- Signup form (store name, WhatsApp, selling platform) → `api/submit-signup.js` → Supabase `early_access_signups`
- GA4 analytics (`G-DLB08DLTKL`) → `index.html` (loads only after cookie consent)
- Cookie consent state → managed in `src/SabootLanding.jsx` (bubble at bottom-right)
- Video storage → Supabase (encrypted at rest)

## Routes
- `/` — Landing page
- `/privacy` — Privacy Policy page (client-side route)
- `/terms` — Terms of Service page (client-side route)
- `vercel.json` — SPA fallback for direct URL access
