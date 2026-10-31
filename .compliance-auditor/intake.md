# Compliance Auditor — Phase 0 Intake

## 1. Project identity
- **Product:** ParcelSaboot (ثبوت) — a proof-collection tool for Pakistani e-commerce sellers. Records continuous, timestamped packing videos and return-opening clips that serve as evidence for return claims on marketplaces (Daraz) and couriers (TCS, Leopards, PostEx).
- **Domain:** E-commerce / logistics / seller tools (Pakistan)
- **Codebase:** `E:\Saboot\saboot-site` — React + Vite frontend (`src/SabootLanding.jsx`), Vercel serverless function (`api/submit-signup.js`), Supabase database (`@supabase/supabase-js`)
- **Legal surface:** Single-page React site; signup form posts to `/api/submit-signup`; GA4 analytics (`G-DLB08DLTKL`); Supabase storage for videos
- **Live URL:** https://parcelsaboot.vercel.app/

## 2. Jurisdictions in scope
- **Business based:** Pakistan (users primarily from Pakistan)
- **Users:** Primarily Pakistan; site is globally accessible
- **Frameworks to research:** Pakistan (primary), with GDPR/UK GDPR/CCPA noted as potentially applicable if EU/UK/CA users sign up (flagged as `[model knowledge — verify]` where cited)

## 3. What exists today
- No `/privacy` or `/terms` pages exist yet — writing from scratch
- No existing legal documents in the repo

## 4. Real gaps vs. aspirational
- **Existing data flows:** signup form (store name, WhatsApp, selling platform) → Supabase; GA4 page-view analytics; video uploads to Supabase storage
- **Not yet shipped:** payments/subscriptions, email marketing, AI features, Chrome extension, mobile app, OAuth connections to Daraz/courier accounts (planned for later versions)
- **No self-service data export or account deletion endpoint exists** — policy language must say "on request" rather than promising self-service

## 5. Attorney review status
- **Pre-attorney** — no lawyer on retainer, no attorney has reviewed the application
- Final docs must include a disclaimer noting no professional legal review was performed

## Real mailboxes
- **None confirmed** — user has no email address set. Do not invent `privacy@`, `legal@`, `support@`, or `noreply@`. Use placeholder language for contact.

## Physical address
- **None provided** — user has no physical address. Leave as placeholder rather than inventing one.
