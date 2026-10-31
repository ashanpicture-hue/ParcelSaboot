# ParcelSaboot — Terms of Service

**Last Updated:** 2026-10-31

## Who we are

ParcelSaboot (ثبوت) is a proof-collection tool for Pakistani e-commerce sellers. We record continuous, timestamped packing videos and return-opening clips that serve as evidence for return claims on marketplaces like Daraz and couriers like TCS, Leopards, and PostEx.

**Operator:** ParcelSaboot  
**Based in:** Pakistan  
**Contact:** hello@parcelsaboot.com  
**Physical address:** Not provided — independent developer, no physical address published

> **⚠️ Attorney review:** These terms of service have NOT been reviewed by a licensed attorney. They are a draft produced from an automated code audit. Have a qualified lawyer in Pakistan review them before you rely on them in production, especially if you monetize the product or handle EU, UK, or California users at scale.

## Acceptance of terms

By accessing or using https://parcelsaboot.vercel.app/ (the "Site") and the ParcelSaboot service, you agree to these Terms of Service. If you do not agree, do not use the service.

## Description of service

ParcelSaboot helps Pakistani online sellers win return claims by recording continuous, timestamped packing videos and return-opening clips. The service includes:

- A landing page and early-access signup form
- A return-loss calculator
- Video recording and storage for packing and return-opening clips
- Claim deadline tracking

ParcelSaboot does **not** file claims for you. Daraz and couriers do not offer a way for outside tools to file claims, so you submit each claim yourself. ParcelSaboot prepares the evidence and tells you the deadline. We cannot promise that Daraz, TCS, Leopards, PostEx, or any other marketplace or courier will accept a claim. The decision is theirs.

## Eligibility

You must be at least 13 years old to use ParcelSaboot. By using the service, you represent that you are at least 13. If you are under 18, you represent that you have a parent or guardian's permission.

## Early-access signup

When you sign up for early access, you provide:

- Store name
- WhatsApp number
- Where you sell (Daraz, Instagram/WhatsApp, your own website, or more than one)

We store this in Supabase and check for duplicate WhatsApp numbers before inserting. We may message you on WhatsApp about setting up your first packing station.

## Video recordings and storage

If you use the recording feature:

- Clips are stored in private cloud storage on Supabase, encrypted at rest
- Only your store's logins can see your clips
- Clips you share go out as private links that stop working after 30 days
- Retention: 30 days (Free), 180 days (Standard), 1 year (Growth). Clips linked to an open claim are kept until the claim closes.
- Each clip is capped at 60 seconds and compressed to about 720p before upload

You are responsible for the content of your recordings. Do not record people without their consent where the law requires it.

## No connection to Daraz, TCS, Leopards, or PostEx

ParcelSaboot is not affiliated with, endorsed by, or integrated with Daraz, Priceoye, TCS, Leopards, PostEx, or Trax. We do not connect to your courier or marketplace accounts in the first version. You scan labels or upload booking/order sheets yourself. Any future API connections would use your own API keys.

## Pricing and plans

The service offers Free, Standard, and Growth plans with different video retention and parcel limits. If you go over your parcel limit, recording pauses for the rest of the month and your existing clips and claims stay available. You can move up a plan at any time. If you pack more than 800 parcels a month, contact us at hello@parcelsaboot.com.

## Your content

You retain ownership of your videos and data. By uploading content to ParcelSaboot, you grant us a license to store, process, and display it as necessary to provide the service. We do not use your videos to train AI models.

## Disclaimer of warranties

ParcelSaboot is provided "as is" and "as available" without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that your videos will be accepted as evidence by any marketplace, courier, or court. We do not guarantee the service will be error-free, uninterrupted, or secure.

## Limitation of liability

To the fullest extent permitted by law, ParcelSaboot and its operators are not liable for any indirect, incidental, consequential, special, or punitive damages, or for any loss of profits, revenue, data, or use, arising out of or related to your use of the service. Our total liability for any claim arising out of these terms is limited to the amount you paid us, if any, in the three months before the claim.

## Indemnification

You agree to indemnify and hold harmless ParcelSaboot and its operators from any claims, damages, or expenses (including reasonable legal fees) arising from your use of the service, your violation of these terms, or your infringement of any third-party rights.

## Termination

We may suspend or terminate your access to the service at any time, with or without cause, and without notice. Upon termination, your right to use the service ends immediately. We will delete your personal data on request per our Privacy Policy.

## Governing law and venue

These terms are governed by the laws of Pakistan. Any dispute arising out of these terms will be resolved in the courts of Pakistan. [review — confirm the appropriate city/venue clause with a Pakistani lawyer; consider whether Karachi, Lahore, or Islamabad is the proper venue.]

## Changes to these terms

We may update these terms from time to time. When we make material changes, we will post the new version on this page with an updated "Last Updated" date. Your continued use of the service after changes are posted constitutes acceptance of the revised terms.

## Contact us

Questions about these terms: hello@parcelsaboot.com

---

**Drafting notes (for the maintainer):**

- Publish date is set to 2026-10-31.
- Contact email is set to hello@parcelsaboot.com — verify this mailbox works before publishing.
- No physical address is published (independent developer). If you later add marketing emails, include a physical address per CAN-SPAM.
- The governing-law clause defaults to Pakistan because your users are primarily from Pakistan. Confirm the venue city with a Pakistani lawyer `[review]`.
- If you add paid subscriptions, add payment terms, refund policy, and auto-renewal language.
- If you connect to Daraz or courier APIs via user API keys, add API-key handling and third-party terms language.
- Pakistan-specific e-commerce and consumer-protection rules are flagged `[model knowledge — verify]` — confirm with a lawyer before relying on them.
