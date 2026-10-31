# Legal Docs Update Rule — ParcelSaboot

## When to update
- Whenever you add a new data flow (new form field, new third-party SDK, new email/SMS tool, new analytics provider)
- Whenever you change retention periods, sub-processors, or contact details
- Before any paid launch or monetization
- At least once per year, or when Pakistan's data-protection rules change

## Where to update
- `src/legal/PrivacyPolicy.md` — canonical Privacy Policy
- `src/legal/TermsOfService.md` — canonical Terms of Service
- `specs/legal/code-ui-punch-list-*.md` — update the punch list when code changes are made
- `.compliance-auditor/intake.md` — update if jurisdictions or data flows change

## Open placeholders (do not ship with these)
- None — all placeholders resolved.
- Publish date: 2026-10-31
- Contact email: hello@parcelsaboot.com
- Physical address: not published (independent developer)

## Baseline references
- Code audit: `api/submit-signup.js`, `src/SabootLanding.jsx`, `src/supabase.js`, `index.html`
- Research: GDPR/UK GDPR/CCPA/Pakistan flagged `[model knowledge — verify]` — confirm with a lawyer
- Attorney review: none performed (pre-attorney)
