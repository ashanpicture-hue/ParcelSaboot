# Code & UI Punch List — ParcelSaboot Legal Compliance

Generated 2026-10-31. These are the code and UI changes needed to match what the Privacy Policy and Terms of Service now promise. Shipping the docs without these changes creates liability drift.

## 1. Signup consent (sign-in-wrap) — DONE
**Status:** Completed. Consent checkbox added to the signup form linking to `/terms` and `/privacy`. Checkbox is required before submission.
**Files:** `src/SabootLanding.jsx`

## 2. Legal pages — DONE
**Status:** Completed. `/privacy` and `/terms` routes added via client-side routing in `src/SabootLanding.jsx`. `vercel.json` added for SPA fallback on refresh. Footer links point to both pages.
**Files:** `src/SabootLanding.jsx`, `vercel.json` (~line 920)

## 3. Contact email and physical address — DONE
**Status:** Completed. Contact email set to hello@parcelsaboot.com. Physical address not published (independent developer).
**Files:** `src/legal/PrivacyPolicy.md`, `src/legal/TermsOfService.md

## 4. Cookie banner / GA4 consent — DONE
**Status:** Completed. Cookie banner added that appears on first visit. GA4 config only fires after user accepts. Decline blocks gtag.
**Files:** `index.html`, `src/SabootLanding.jsx`

## 5. Data export endpoint
**Issue:** The Privacy Policy says data export is "on request" (manual) because no self-service endpoint exists.
**Fix:** Either build a `/api/export` endpoint that returns a user's signup data and video list, or keep the manual process and make sure the contact email actually works.
**Files:** new API route; `api/submit-signup.js` for reference

## 6. Account deletion endpoint
**Issue:** No account deletion endpoint exists. The Privacy Policy says deletion is handled manually on request.
**Fix:** Either build a `/api/delete-account` endpoint that removes the user's signup row and associated videos, or confirm the manual process works and is documented.
**Files:** new API route; `api/submit-signup.js`

## 7. WhatsApp opt-out
**Issue:** The site says "We'll message you on WhatsApp to set up your first packing station," but there is no STOP/opt-out handler for WhatsApp messages.
**Fix:** Add opt-out handling (e.g., "STOP" keyword) for any WhatsApp messaging you send, and record opt-outs in Supabase so you don't message opted-out users.
**Files:** `api/submit-signup.js` or whatever sends WhatsApp messages

## 8. Rate limiting and IP logging
**Issue:** The signup function logs IP addresses for rate limiting (`api/submit-signup.js` lines 13–38). This is personal data and should be disclosed.
**Fix:** The Privacy Policy already mentions rate limiting. Consider whether you need to retain IPs at all, and for how long. Add IP retention to the retention section if you keep logs.

## 9. Supabase RLS
**Issue:** Confirm row-level security is enabled on the `early_access_signups` table and on any video/storage buckets so users can only access their own data.
**Fix:** Enable RLS in Supabase and add policies. Verify the service role key is never exposed to the frontend (`src/supabase.js` confirms no frontend client — good).
**Files:** Supabase dashboard (RLS policies); `src/supabase.js`

## 10. Security headers
**Issue:** No CSP, HSTS, or other security headers are configured.
**Fix:** Add Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, and X-Frame-Options headers via your hosting provider (Vercel) or a middleware.
**Files:** `vercel.json` or equivalent; `vite.config.js`

## 11. Placeholder sweep
**Issue:** Both policies contain `[DATE]`, `[CONTACT_EMAIL_PLACEHOLDER]`, and `[PHYSICAL_ADDRESS_PLACEHOLDER]`.
**Fix:** Replace all placeholders before publishing. Do not ship with placeholder text.
**Files:** `src/legal/PrivacyPolicy.md`, `src/legal/TermsOfService.md`

## 12. Attorney review
**Issue:** No attorney has reviewed these documents.
**Fix:** Have a qualified lawyer in Pakistan review both policies before relying on them in production. The disclaimer in each document states this.
