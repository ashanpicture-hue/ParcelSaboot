import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const css = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap");
:root {
  --bg:#f7f6f2;
  --ink:#1a1a18;
  --sub:#5c5c55;
  --line:#d9d7cf;
  --card:#ffffff;
  --brand:#0b3d2e;
  --brand-soft:#e8f0e8;
  --warn:#a33a1e;
  --warn-soft:#fbeae3;
  --night:#0f1410;
  --night-ink:#e8efe9;
  --night-sub:#a9bdb3;
  --on-brand:#ffffff;
  --display:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;
  --body:"Figtree","Segoe UI",system-ui,sans-serif;
  --mono:ui-monospace,"Cascadia Mono",Consolas,monospace;
  --urdu:"Noto Nastaliq Urdu","Jameel Noori Nastaleeq",serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:#0b110e; --ink:#e8efe9; --sub:#a9bdb3; --line:#2a332c; --card:#121915;
    --brand:#4cc38a; --brand-soft:#123a24; --warn:#f08a5d; --warn-soft:#3a2219;
    --night:#0a110e; --night-ink:#e8efe9; --night-sub:#a9bdb3; --on-brand:#06140e;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --bg:#0b110e; --ink:#e8efe9; --sub:#a9bdb3; --line:#2a332c; --card:#121915;
  --brand:#4cc38a; --brand-soft:#123a24; --warn:#f08a5d; --warn-soft:#3a2219;
  --night:#0a110e; --night-ink:#e8efe9; --night-sub:#a9bdb3; --on-brand:#06140e;
  color-scheme: dark;
}
body { background: var(--bg); margin: 0; }
.sb, .sb * { box-sizing: border-box; }
.sb { font-family: var(--body); color: var(--ink); background: var(--bg); line-height: 1.55; font-size: 16px; }
.sb[dir="rtl"] { font-family: var(--urdu); line-height: 2.1; }
.sb[dir="rtl"] h1, .sb[dir="rtl"] h2, .sb[dir="rtl"] h3 { font-family: var(--urdu); line-height: 1.9; letter-spacing: 0; }
.sb h1, .sb h2, .sb h3 { font-family: var(--display); text-wrap: balance; color: var(--ink); }
.sb a { color: inherit; text-decoration: none; }
.sb :focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; border-radius: 4px; }
.sb .wrap { max-width: 1140px; margin: 0 auto; padding-left: max(20px, env(safe-area-inset-left, 0px)); padding-right: max(20px, env(safe-area-inset-right, 0px)); }
.sb .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 22px; border-radius: 8px; font-weight: 600; font-size: 15px; border: 0; cursor: pointer; font-family: inherit; transition: transform .12s ease, box-shadow .12s ease, background-color .12s ease, border-color .12s ease; }
.sb .btn-p { background: var(--brand); color: var(--on-brand); box-shadow: 0 1px 2px rgba(11,61,46,.18); }
.sb .btn-p:hover { filter: brightness(1.05); transform: translateY(-1px); box-shadow: 0 8px 20px -8px rgba(11,61,46,.45); }
.sb .btn-p:active { transform: translateY(0) scale(.98); box-shadow: none; }
.sb .btn-g { background: transparent; color: var(--ink); border: 1px solid var(--line); }
.sb .btn-g:hover { border-color: var(--brand); color: var(--brand); background: color-mix(in srgb, var(--brand) 6%, transparent); }
.sb .btn-g:active { transform: scale(.98); }
.sb h1 { font-size: clamp(34px, 5vw, 56px); line-height: 1.06; margin: 14px 0 18px; letter-spacing: -.025em; text-wrap: balance; }
.sb h2 { font-size: clamp(26px, 3.4vw, 40px); line-height: 1.12; margin: 10px 0 14px; letter-spacing: -.015em; text-wrap: balance; }
.sb h3 { font-size: 20px; margin: 0 0 8px; text-wrap: balance; }
.sb p { margin: 0 0 14px; color: var(--sub); max-width: 62ch; }
.sb .eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--brand); display: inline-flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.sb .eyebrow::before { content: ""; width: 16px; height: 1px; background: var(--brand); }
.sb .grad { color: var(--brand); }
.sb .display-num { font-family: var(--display); font-weight: 800; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.sb section { padding-block: 96px; scroll-margin-top: 78px; }
.sb html { scroll-behavior: smooth; }
.sb .band { background: var(--card); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.sb .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.sb .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.sb .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.sb .grid2 > *, .sb .grid3 > *, .sb .grid4 > * { min-width: 0; }
.sb .row.flip .text { order: 2; } .sb .row.flip .visual { order: 1; }
.sb .row + .row { margin-top: 104px; }
.sb .ticks { list-style: none; padding: 0; margin: 18px 0 0; display: grid; gap: 10px; }
.sb .ticks li { padding-inline-start: 26px; position: relative; color: var(--ink); }
.sb .ticks li::before { content: ""; position: absolute; inset-inline-start: 0; top: 7px; width: 14px; height: 14px; border-radius: 50%; background: var(--brand-soft); box-shadow: inset 0 0 0 4px var(--brand); }
.sb[dir="rtl"] .ticks li::before { top: 14px; }
.sb .panel { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 24px; box-shadow: 0 1px 2px rgba(15,60,40,.04); }
.sb .tile { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 24px; transition: border-color .12s ease, box-shadow .12s ease; }
.sb .tile:hover { border-color: color-mix(in srgb, var(--brand) 30%, var(--line)); box-shadow: 0 8px 24px -10px rgba(15,60,40,.12); }
.sb .big { display: block; font-family: var(--display); font-size: 30px; font-weight: 800; color: var(--ink); letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.sb .pill { display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 99px; white-space: nowrap; }
.sb .mono { font-family: var(--mono); }
.sb .tscroll { overflow-x: auto; }
.sb table { width: 100%; border-collapse: collapse; font-size: 15px; min-width: 620px; }
.sb th, .sb td { padding: 14px 12px; border-bottom: 1px solid var(--line); text-align: start; vertical-align: top; }
.sb th { font-size: 13px; color: var(--sub); font-weight: 600; }
.sb .tabs { display: flex; flex-wrap: wrap; gap: 8px; }
.sb .tab { padding: 10px 16px; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: var(--ink); font: inherit; font-weight: 600; cursor: pointer; transition: background-color .12s ease, color .12s ease, border-color .12s ease; }
.sb .tab:hover:not([aria-selected="true"]) { border-color: color-mix(in srgb, var(--brand) 40%, var(--line)); background: color-mix(in srgb, var(--brand) 5%, var(--card)); color: var(--brand); }
.sb .tab:active { transform: scale(.96); }
.sb .tab[aria-selected="true"] { background: var(--brand); color: var(--on-brand); border-color: var(--brand); }
.sb .faq button { width: 100%; text-align: start; background: none; border: 0; padding: 16px 0; font: inherit; font-size: 16px; font-weight: 600; color: var(--ink); cursor: pointer; display: flex; justify-content: space-between; gap: 14px; border-bottom: 1px solid var(--line); }
.sb .faq button:active { color: var(--brand); }
.sb .faq > div:last-child button { border-bottom: none; }
.sb label.f { display: grid; gap: 6px; font-size: 14px; font-weight: 600; color: var(--ink); }
.sb input[type=range] { width: 100%; -webkit-appearance: none; appearance: none; height: 26px; background: transparent; cursor: pointer; }
.sb input[type=range]::-webkit-slider-runnable-track { height: 5px; border-radius: 99px; background: linear-gradient(90deg, var(--brand) 0 var(--fill, 50%), var(--line) var(--fill, 50%)); }
.sb input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; margin-top: -7px; border-radius: 50%; background: var(--brand); border: 2px solid var(--card); box-shadow: 0 1px 3px rgba(15,60,40,.35), 0 0 0 1px var(--line); transition: transform .12s ease, box-shadow .12s ease; }
.sb input[type=range]:hover::-webkit-slider-thumb { transform: scale(1.1); box-shadow: 0 2px 6px rgba(15,60,40,.4), 0 0 0 5px color-mix(in srgb, var(--brand) 15%, transparent); }
.sb .field { display: block; width: 100%; padding: 12px 14px; border-radius: 8px; border: 1px solid var(--line); background: var(--bg); color: var(--ink); font: inherit; font-size: 15px; }
.sb .field:focus { border-color: var(--brand); outline: none; }
.sb .night { background: var(--night); color: var(--night-ink); }
.sb .night p { color: var(--night-sub); }
.sb .night h2 { color: var(--night-ink); }
.sb .night .field { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.14); color: var(--night-ink); }
/* Professional hero: deep charcoal + parcel green */
.sb .pk { position: relative; overflow: hidden; color: var(--pk-white); background: var(--night); }
.sb .pk .inner { position: relative; z-index: 1; padding-block: 80px 56px; padding-left: max(24px, env(safe-area-inset-left, 0px)); padding-right: max(20px, env(safe-area-inset-right, 0px)); max-width: 1240px; margin: 0 auto; }
.sb .pk h1 { color: var(--pk-white); max-width: 16ch; }
.sb .pk p { color: rgba(255,255,255,.82); }
.sb .pk .eyebrow { color: #8fc9a8; }
.sb .pk .eyebrow::before { background: #8fc9a8; }
.sb .pk .btn-p { background: var(--pk-white); color: var(--night); }
.sb .pk .btn-g { color: var(--pk-white); border-color: rgba(255,255,255,.35); }
.sb .pk .btn-g:hover { border-color: var(--pk-white); color: var(--pk-white); background: rgba(255,255,255,.08); }
/* Journey: clean step markers, no infinite animation */
.sb .journey { position: relative; margin-top: 48px; padding-top: 32px; }
.sb .journey .rail { position: absolute; left: 0; right: 0; top: 52px; height: 2px; background: rgba(255,255,255,.12); }
.sb .journey ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); position: relative; }
.sb .journey li { display: grid; justify-items: center; text-align: center; gap: 6px; padding-top: 4px; font-family: var(--body); }
.sb .journey li:first-child { justify-items: start; text-align: start; } .sb .journey li:last-child { justify-items: end; text-align: end; }
.sb .journey .dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.35); border: 2px solid rgba(255,255,255,.5); margin-top: 10px; }
.sb .journey b { font-size: 14px; } .sb .journey small { font-size: 12px; color: rgba(255,255,255,.6); max-width: 16ch; }
/* Remove ticker entirely - vibecoded element */
.sb .sticky-cta { display: none; }
.sb .preview-box { height: 200px; background: var(--kraft); border-radius: 10px; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; color: var(--sub); font-size: 14px; font-weight: 500; }
@media (max-width: 720px) {
  .sb .journey ol { grid-template-columns: repeat(2, 1fr); row-gap: 20px; }
  .sb .journey .rail { display: none; }
  .sb .journey li, .sb .journey li:first-child, .sb .journey li:last-child { justify-items: center; text-align: center; }
}
@media (max-width: 880px) {
  .sb section { padding-block: 64px; }
  .sb .grid2 { grid-template-columns: 1fr; gap: 36px; }
  .sb .row.flip .text, .sb .row.flip .visual { order: initial; }
  .sb .row + .row { margin-top: 72px; }
  .sb .grid3, .sb .grid4 { grid-template-columns: 1fr 1fr; }
  .sb .hide-m { display: none !important; }
  .sb .sticky-cta { display: flex; position: fixed; z-index: 20; left: 0; right: 0; bottom: 0; gap: 10px; padding: 10px max(16px, env(safe-area-inset-right, 0px)) calc(10px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px)); background: var(--card); border-top: 1px solid var(--line); }
  .sb .sticky-cta .btn { flex: 1; }
  .sb footer { padding-bottom: 80px; }
}
@media (max-width: 520px) { .sb .grid3, .sb .grid4 { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
`;

const T = {
  en: {
    nav: ["How it works", "Features", "Calculator", "Pricing", "FAQ"],
    start: "Join early access",
    eyebrow: "For Pakistani online sellers",
    h1: "Stop paying for returns that weren't your fault.",
    lead: "The customer says it was defective. The box comes back empty, swapped or missing parts. ParcelSaboot records every parcel you pack and every return you open, then hands you the proof to win the claim.",
    cta1: "Join early access",
    cta2: "Work out your losses",
    works: "Tracks published claim rules for Daraz, TCS, Leopards and PostEx. No official partnership with any of them.",
    probEyebrow: "The problem",
    probH: "No video, no claim. Short deadline, no second chance.",
    probP: "Marketplaces and couriers put the burden of proof on you. Without a packing video and a complete claim filed on time, the loss is yours.",
    howH: "Four steps from packing table to payout.",
    finalH: "Your next bad return is already on its way.",
    finalP: "ParcelSaboot is in development. Join early access and we will set up your first packing station with you when the pilot opens.",
    cookie: {
      title: "Cookies & Analytics",
      desc: "We use Google Analytics to improve our site. Accept or decline below:",
      accept: "Accept",
      decline: "Decline",
      privacy: "Privacy Policy",
    },
  },
  ur: {
    nav: ["طریقہ کار", "خصوصیات", "حساب", "قیمت", "سوالات"],
    start: "شامل ہوں",
    eyebrow: "پاکستانی آن لائن سیلرز کے لیے",
    h1: "جن ریٹرنز میں آپ کی غلطی نہیں، ان کا نقصان اب نہیں۔",
    lead: "کسٹمر کہتا ہے چیز خراب تھی۔ پارسل خالی، بدلا ہوا یا ادھورا واپس آتا ہے۔ پرسل سبوت ہر پیکنگ اور ہر ریٹرن کی ویڈیو بناتا ہے اور کلیم جیتنے کے لیے پورا ثبوت تیار کر دیتا ہے۔",
    cta1: "ابتدائی رسائی کے لیے شامل ہوں",
    cta2: "اپنا نقصان معلوم کریں",
    works: "دراز، ٹی سی ایس، لیپرڈز اور پوسٹ ایکس کے شائع شدہ کلیم قواعد۔ کسی کمپنی سے سرکاری شراکت نہیں۔",
    probEyebrow: "مسئلہ",
    probH: "ویڈیو نہیں تو کلیم نہیں۔ وقت کم، دوسرا موقع نہیں۔",
    probP: "مارکیٹ پلیس اور کوریئر ثبوت کی ذمہ داری آپ پر ڈالتے ہیں۔ پیکنگ ویڈیو اور وقت پر مکمل کلیم کے بغیر نقصان آپ کا ہے۔",
    howH: "پیکنگ ٹیبل سے رقم کی واپسی تک چار قدم۔",
    finalH: "آپ کا اگلا خراب ریٹرن راستے میں ہے۔",
    finalP: "پرسل سبوت ابھی تیاری میں ہے۔ ابتدائی رسائی کے لیے شامل ہوں، پائلٹ شروع ہونے پر ہم آپ کے ساتھ پہلا پیکنگ اسٹیشن لگائیں گے۔",
    cookie: {
      title: "کوکيز اور تجزیات",
      desc: "ہم سائٹ کو بہتر بنانے کے لیے گوگل اینالیٹکس استعمال کرتے ہیں۔ قبول یا مسترد کریں:",
      accept: "قبول کریں",
      decline: "مسترد کریں",
      privacy: "پرائیویسی پالیسی",
    },
  },
};

const issues = [
  { fig: "48h", what: "Daraz claim window", why: "You must file within 48 hours of delivery. No video, no claim.", help: "daraz", src: ["Daraz policy", "https://www.daraz.pk/return-policy/"] },
  { fig: "7d", what: "TCS damaged parcel", why: "TCS allows 7 days to report a damaged or lost parcel. Proof must be attached.", help: "tcs", src: ["TCS help", "https://tcs.com.pk/"] },
  { fig: "14d", what: "Leopards claim", why: "Leopards expects claims within 14 days with parcel evidence.", help: "leopards", src: ["Leopards", "https://leopardscourier.com/"] },
  { fig: "30d", what: "PostEx lost parcel", why: "PostEx lost-parcel claims need tracking evidence and a filed report.", help: "postex", src: ["PostEx", "https://postex.com.pk/"] },
];

const helpTag = {
  daraz: ["Daraz", "#e8f0e8", "#0b3d2e"],
  tcs: ["TCS", "#e8f0e8", "#0b3d2e"],
  leopards: ["Leopards", "#fbeae3", "#a33a1e"],
  postex: ["PostEx", "#e8f0e8", "#0b3d2e"],
};

const audiences = {
  daraz: { tab: "Daraz sellers", h: "Daraz sellers", p: "Daraz puts the burden of proof on you. A packing video tied to the order number is your best chance of winning a return claim.", pts: ["Packing video per order", "Claim deadline tracker", "Evidence bundle for Daraz claims"] },
  social: { tab: "Instagram / WhatsApp", h: "Social sellers", p: "You sell on Instagram and WhatsApp. When a customer disputes a parcel, send them the clip and settle it fast.", pts: ["Share clip with customer", "File courier claim on time", "Proof for COD disputes"] },
  brand: { tab: "Your own site", h: "Your own website", p: "You run your own store. Saboot gives you the evidence file to back up every refund or replacement decision.", pts: ["Evidence PDF per order", "Packer logins per station", "1-year storage on Growth"] },
};

const daraZList = [
  "Item condition at delivery",
  "Original packaging intact",
  "All accessories included",
  "Invoice and warranty card",
  "No signs of use or damage",
];

const rules = [
  ["Daraz", "48 hours", "Order video + item photos", "https://www.daraz.pk/return-policy/"],
  ["TCS", "7 days", "Tracking + damage proof", "https://tcs.com.pk/"],
  ["Leopards", "14 days", "Parcel evidence + report", "https://leopardscourier.com/"],
  ["PostEx", "30 days", "Tracking + filed report", "https://postex.com.pk/"],
];

const features = [
  { eyebrow: "Continuous recording", title: "One take, no cuts", body: "Saboot records from empty box to sealed parcel in a single continuous clip. No editing means no one can claim the video was staged.", ticks: ["Continuous from start to finish", "Order number burned into frame", "Tamper-evident fingerprint"], visual: <div className="preview-box">Packing station preview</div> },
  { eyebrow: "Claim deadlines", title: "Never miss a window", body: "Every marketplace and courier sets its own claim window. Saboot tracks them and alerts you on WhatsApp before the deadline passes.", ticks: ["48-hour Daraz window", "7-day TCS window", "WhatsApp deadline alerts"], visual: <div className="preview-box">Deadline tracker preview</div> },
  { eyebrow: "Evidence bundle", title: "One-click claim file", body: "Export a ready-to-send evidence file with the packing clip, return clip, and a written statement. Attach it to your Daraz or courier claim.", ticks: ["Evidence PDF per order", "Clip fingerprint included", "Ready for Daraz / TCS"], visual: <div className="preview-box">Evidence bundle preview</div> },
];

const faqs = [
  ["Does Daraz accept ParcelSaboot videos as return claim proof?", "Daraz seller claims go through a Seller Support form that asks for proof. ParcelSaboot gives you a continuous, uncut, timestamped clip tied to the order and a written statement. We cannot promise Daraz or any courier will accept a claim. The decision is theirs."],
  ["Will ParcelSaboot video hold up if a return claim goes further?", "Pakistani law accepts electronic records as evidence, and courts look for proof a video is genuine and unedited. Each clip is continuous, stamped with the time and order number, and fingerprinted when it is saved, so any change would show."],
  ["Do I need special cameras for ParcelSaboot parcel recording?", "No. A phone on a stand or a basic USB webcam is enough. A barcode scanner makes it faster, but the phone camera can read labels too."],
  ["What if the internet or power goes out during packing?", "Clips save on the device and upload when the connection is back."],
  ["I sell on Instagram and WhatsApp. Is ParcelSaboot for me?", "Yes. Send the packing clip to a customer who disputes a parcel, and file courier claims for lost or damaged parcels on time."],
  ["Will ParcelSaboot file the claim for me?", "No. Daraz and the couriers do not offer a way for outside tools to file claims, so you submit each claim yourself. ParcelSaboot prepares the evidence and tells you the deadline."],
  ["Does ParcelSaboot connect to my courier or Daraz account?", "Not in the first version. You scan the label or upload your booking or order sheet. Daraz and some couriers offer merchant APIs for orders and tracking, and we plan optional connections using your own API keys later."],
  ["Where are my videos stored?", "In private cloud storage run on Supabase, encrypted at rest. Only your store's logins can see them. A clip you share goes out as a private link that stops working after 30 days."],
  ["Why is each clip capped at 60 seconds?", "A minute covers packing one parcel from empty box to sealed label. The phone shrinks each clip to about 720p before upload, so it sends quickly on mobile data and keeps storage costs, and our prices, low."],
  ["What happens if I go over my parcel limit?", "Recording pauses for the rest of the month and your existing clips and claims stay available. Move up a plan at any time. If you pack more than 800 parcels a month, contact us."],
  ["How long are videos kept?", "30 days on Free, 180 days on Standard and a full year on Growth. Videos linked to an open claim are kept until it closes."],
];

const sources = [
  ["Daraz return policy", "https://www.daraz.pk/return-policy/"],
  ["Priceoye return policy", "https://priceoye.pk/return-policy"],
  ["Courier claim deadlines", "https://pakera.pk/claim-lost-or-damaged-courier-parcel-pakistan/"],
  ["FBR registration for sellers", "https://pakera.pk/ecommerce-tax-register-online-sellers-pakistan/"],
  ["State of online shopping Pakistan 2026", "https://www.ordernation.com/blogs/research/state-of-online-shopping-pakistan-2026"],
];

const rs = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");

function PrivacyPolicyPage({ lang }) {
  const isUr = lang === "ur";
  return (
    <div style={{ padding: 32, maxWidth: 640, margin: "0 auto", lineHeight: 1.7, color: "var(--ink)" }} dir={isUr ? "rtl" : "ltr"}>
      <a href="/" style={{ display: "inline-block", marginBottom: 20, color: "var(--brand)", textDecoration: "underline" }}>{isUr ? "واپس گھر پر" : "Back to home"}</a>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>{isUr ? "پرائیویسی پالیسی" : "Privacy Policy"}</h1>
      <p style={{ fontSize: 13, color: "var(--sub)" }}>{isUr ? "آخری تازہ ترین: 31 اکتوبر 2026" : "Last Updated: 2026-10-31"}</p>
      <h2 style={{ fontSize: 16, marginTop: 20 }}>{isUr ? "ہم کون ہیں" : "Who we are"}</h2>
      <p>{isUr ? "پرسل سبوت (ثبوت) پاکستانی آن لائن سیلرز کے لیے ثبوت اکٹھا کرنے والا ٹول ہے۔ ہم ہر پیکنگ اور ہر ریٹرن کی مسلسل، ٹائم سٹیمپڈ ویڈیوز ریکارڈ کرتے ہیں جو دراز، ٹی سی ایس، لیپرڈز اور پوسٹ ایکس جیسے مارکیٹ پلیسز اور کوریئرز کے ساتھ کلیم جیتنے کے لیے ثبوت کا کام آتی ہیں۔" : "ParcelSaboot (ثبوت) is a proof-collection tool for Pakistani e-commerce sellers. We record continuous, timestamped packing and return-opening videos that serve as evidence for return claims on marketplaces like Daraz and couriers like TCS, Leopards, and PostEx."}</p>
      <p><strong>{isUr ? "رابطہ:" : "Contact:"}</strong> hello@parcelsaboot.com</p>
      <p><strong>{isUr ? "مادی پتہ:" : "Physical address:"}</strong> {isUr ? "شائع نہیں کیا گیا — آزاد ڈویلپر" : "Not published — independent developer"}</p>
      <p style={{ marginTop: 30, fontSize: 12, color: "var(--sub)" }}>{isUr ? "یہ ڈرافٹ ایک خودکار کوڈ آڈٹ سے تیار کیا گیا ہے۔ اس کی کسی لائسنس یافتہ وکیل سے جائزہ نہیں لیا گیا۔ producción پر انحصار کرنے سے پہلے پاکستان کے کسی ماہر وکیل سے جائزہ ضرور لیں۔" : "This draft was produced from an automated code audit. It has NOT been reviewed by a licensed attorney. Have a qualified lawyer in Pakistan review it before relying on it in production."}</p>
    </div>
  );
}

function TermsOfServicePage({ lang }) {
  const isUr = lang === "ur";
  return (
    <div style={{ padding: 32, maxWidth: 640, margin: "0 auto", lineHeight: 1.7, color: "var(--ink)" }} dir={isUr ? "rtl" : "ltr"}>
      <a href="/" style={{ display: "inline-block", marginBottom: 20, color: "var(--brand)", textDecoration: "underline" }}>{isUr ? "واپس گھر پر" : "Back to home"}</a>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>{isUr ? "شرائطِ خدمت" : "Terms of Service"}</h1>
      <p style={{ fontSize: 13, color: "var(--sub)" }}>{isUr ? "آخری تازہ ترین: 31 اکتوبر 2026" : "Last Updated: 2026-10-31"}</p>
      <h2 style={{ fontSize: 16, marginTop: 20 }}>{isUr ? "ہم کون ہیں" : "Who we are"}</h2>
      <p>{isUr ? "پرسل سبوت (ثبوت) پاکستانی آن لائن سیلرز کے لیے ثبوت اکٹھا کرنے والا ٹول ہے۔ ہم ہر پیکنگ اور ہر ریٹرن کی مسلسل، ٹائم سٹیمپڈ ویڈیوز ریکارڈ کرتے ہیں جو دراز، ٹی سی ایس، لیپرڈز اور پوسٹ ایکس جیسے مارکیٹ پلیسز اور کوریئرز کے ساتھ کلیم جیتنے کے لیے ثبوت کا کام آتی ہیں۔" : "ParcelSaboot (ثبوت) is a proof-collection tool for Pakistani e-commerce sellers. We record continuous, timestamped packing and return-opening videos that serve as evidence for return claims on marketplaces like Daraz and couriers like TCS, Leopards, and PostEx."}</p>
      <p>{isUr ? "پرسل سبوت آپ کے لیے کلیم فائل نہیں کرتا۔ دراز اور کوریئرز باہر کے ٹولز کے ذریعے کلیم فائل کرنے کا کوئی طریقہ فراہم نہیں کرتے، لہذا آپ کو ہر کلیم خود فائل کرنا پڑے گا۔ پرسل سبوت ثبوت تیار کرتا ہے اور آپ کو ڈڈ لائن بتاتا ہے۔ ہم یہ وعدہ نہیں کرتے کہ دراز، ٹی سی ایس، لیپرڈز، پوسٹ ایکس یا کوئی بھی دوسرا مارکیٹ پلیس یا کوریئر آپ کا کلیم قبول کرے گا۔ فیصلہ ان کا ہے۔" : "ParcelSaboot does not file claims for you. Daraz and couriers do not offer a way for outside tools to file claims, so you submit each claim yourself. ParcelSaboot prepares the evidence and tells you the deadline. We cannot promise that Daraz, TCS, Leopards, PostEx, or any other marketplace or courier will accept a claim. The decision is theirs."}</p>
      <p><strong>{isUr ? "رابطہ:" : "Contact:"}</strong> hello@parcelsaboot.com</p>
      <p style={{ marginTop: 30, fontSize: 12, color: "var(--sub)" }}>{isUr ? "یہ ڈرافٹ ایک خودکار کوڈ آڈٹ سے تیار کیا گیا ہے۔ اس کی کسی لائسنس یافتہ وکیل سے جائزہ نہیں لیا گیا۔ producción پر انحصار کرنے سے پہلے پاکستان کے کسی ماہر وکیل سے جائزہ ضرور لیں۔" : "This draft was produced from an automated code audit. It has NOT been reviewed by a licensed attorney. Have a qualified lawyer in Pakistan review it before relying on it in production."}</p>
    </div>
  );
}

export default function SabootLanding() {
  const [lang, setLang] = useState("en");
  const [aud, setAud] = useState("daraz");
  const [open, setOpen] = useState(0);
  const [yearly, setYearly] = useState(false);
  const [sent, setSent] = useState(false);
  const [route, setRoute] = useState(window.location.pathname);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [calc, setCalc] = useState({ orders: 400, ret: 20, bad: 15, value: 3500 });
  const [cookieConsent, setCookieConsent] = useState(null);
  const [termsConsent, setTermsConsent] = useState(false);
  const t = T[lang];
  const rtl = lang === "ur";

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".sb .reveal"));
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) el.classList.add("in");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [lang]);

  useEffect(() => {
    if (cookieConsent === true) {
      window.cookieConsentGranted = true;
      if (typeof window.gtag !== "undefined") {
        window.gtag('config', 'G-DLB08DLTKL');
      }
    } else if (cookieConsent === false) {
      window.cookieConsentGranted = false;
      window.gtag = function() {};
    }
  }, [cookieConsent]);

  const badReturns = (calc.orders * calc.ret * calc.bad) / 10000;
  const monthlyLoss = badReturns * calc.value;
  const recoverable = monthlyLoss * 0.6;
  const setC = (k) => (e) => setCalc({ ...calc, [k]: Number(e.target.value) });
  const fillFor = (v, min, max) => `${((v - min) / (max - min)) * 100}%`;
  const rangeStyle = (v, min, max) => ({ "--fill": fillFor(v, min, max) });
  const price = (m) => (m === 0 ? "Rs 0" : rs(yearly ? m * 10 / 12 : m));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const store = document.getElementById('store')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const volume = document.getElementById('volume')?.value || '';
    try {
      const response = await fetch('/api/submit-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_name: store, whatsapp: phone, sells_on: volume }),
      });
      const result = await response.json();
      if (!response.ok) { throw new Error(result.error || 'Submission failed'); }
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'early_access_signup', { method: 'form', sells_on: volume, store_name: store });
      }
      setSent(true);
      setSubmitting(false);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="sb" dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ur" : "en"}>
      <style>{css}</style>

      {route === "/privacy" && <PrivacyPolicyPage lang={lang} />}
      {route === "/terms" && <TermsOfServicePage lang={lang} />}

      {route !== "/privacy" && route !== "/terms" && (
        <>
          <header style={{ position: "sticky", top: "env(safe-area-inset-top, 0px)", zIndex: 15, background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
            <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, height: 66 }}>
              <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 20, textDecoration: "none", fontFamily: "var(--display)" }}>
                <span style={{ width: 32, height: 32, borderRadius: 6, background: "var(--brand)", color: "var(--on-brand)", display: "grid", placeItems: "center", fontSize: 16 }}>S</span>
                Saboot <span style={{ fontFamily: "var(--urdu)", fontWeight: 400, color: "var(--sub)", fontSize: 15 }}>ثبوت</span>
              </a>
              <nav className="hide-m" style={{ display: "flex", gap: 24, fontSize: 15 }}>
                {["#how", "#features", "#calculator", "#pricing", "#faq"].map((h, i) => <a key={h} href={h} style={{ textDecoration: "none" }}>{t.nav[i]}</a>)}
              </nav>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button className="tab" style={{ padding: "8px 12px", fontFamily: rtl ? "var(--body)" : "var(--urdu)" }} onClick={() => setLang(rtl ? "en" : "ur")} aria-label="Switch language">{rtl ? "English" : "اردو"}</button>
                <a href="#start" className="btn btn-p hide-m" style={{ padding: "10px 16px" }}>{t.start}</a>
              </div>
            </div>
          </header>

          <section className="pk reveal">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inner"
            >
              <span className="eyebrow">{t.eyebrow}</span>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {t.h1}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: 18, maxWidth: "42ch" }}
              >
                {t.lead}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}
              >
                <a href="#start" className="btn btn-p" style={{ padding: "14px 24px", fontSize: 16 }}>{t.cta1}</a>
                <a href="#calculator" className="btn btn-g" style={{ padding: "14px 24px", fontSize: 16 }}>{t.cta2}</a>
              </motion.div>
              <div className="journey">
                <div className="rail"></div>
                <ol>
                  {["Pack", "Return", "Claim", "Recover"].map((step, i) => (
                    <motion.li
                      key={step}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="dot"></div>
                      <b>{step}</b>
                      <small>{i === 0 ? "Scan label" : i === 1 ? "Scan return" : i === 2 ? "Open claim" : "Track to decision"}</small>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </section>

          <div className="band" style={{ borderTop: 0 }}>
            <div className="wrap" style={{ paddingBlock: 18, fontSize: 14, color: "var(--sub)", textAlign: "center" }}>{t.works}</div>
          </div>

          <section id="problems" className="reveal">
            <div className="wrap">
              <span className="eyebrow">{t.probEyebrow}</span>
              <h2>{t.probH}</h2>
              <p>{t.probP} Here is what local sellers deal with every week, and where Saboot fits.</p>
              <div className="grid3" style={{ marginTop: 32 }} dir="ltr">
                {issues.map((x) => {
                  const [label, bg, fg] = helpTag[x.help];
                  return (
                    <motion.article
                      key={x.what}
                      className="tile issue"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + issues.indexOf(x) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="big">{x.fig}</span>
                      <b style={{ fontSize: 16 }}>{x.what}</b>
                      <span style={{ color: "var(--sub)", fontSize: 15 }}>{x.why}</span>
                      <span className="tag" style={{ background: bg, color: fg }}>{label}</span>
                      <span style={{ fontSize: 15 }}>{x.how}</span>
                      <a href={x.src[1]} style={{ fontSize: 12.5, color: "var(--sub)" }}>{x.src[0]}</a>
                    </motion.article>
                  );
                })}
              </div>
              <p style={{ fontSize: 13, marginTop: 16 }}>Figures come from industry datasets, vendor reports and published policies, checked October 2026. Treat vendor figures as estimates.</p>
            </div>
          </section>

          <section className="band reveal">
            <div className="wrap">
              <span className="eyebrow">Who it's for</span>
              <div className="tabs" role="tablist" style={{ margin: "14px 0 32px" }}>
                {Object.entries(audiences).map(([k, a]) => (
                  <button key={k} role="tab" className="tab" aria-selected={aud === k} onClick={() => setAud(k)}>{a.tab}</button>
                ))}
              </div>
              <div className="grid2" style={{ alignItems: "start" }}>
                <div>
                  <h2>{audiences[aud].h}</h2>
                  <p style={{ fontSize: 17 }}>{audiences[aud].p}</p>
                </div>
                <ul className="ticks tile" style={{ margin: 0 }}>{audiences[aud].pts.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </div>
          </section>

          <section id="how" className="band reveal">
            <div className="wrap">
              <span className="eyebrow">How it works</span>
              <h2>{t.howH}</h2>
              <div className="grid4" style={{ marginTop: 36 }}>
                {[["Pack", "Scan the label. The packing is recorded."], ["Return", "Scan the return. The opening is recorded."], ["Claim", "Saboot opens the claim and starts the clock."], ["Recover", "Send the bundle and track it to a decision."]].map(([h, d], i) => (
                  <motion.div
                    key={h}
                    className="tile"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mono" style={{ fontSize: 13, color: "var(--brand)", fontWeight: 700, marginBottom: 10 }}>Step {i + 1}</div>
                    <h3>{h}</h3><p style={{ margin: 0 }}>{d}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="features" className="reveal">
            <div className="wrap">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className={`row grid2 ${i % 2 ? "flip" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text">
                    <span className="eyebrow">{f.eyebrow}</span>
                    <h2 className="grad">{f.title}</h2>
                    <p style={{ fontSize: 17 }}>{f.body}</p>
                    <ul className="ticks">{f.ticks.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                  <div className="visual preview-box">{f.visual}</div>
                </motion.div>
              ))}
            </div>
          </section>

          <section style={{ background: "var(--card)" }} className="reveal">
            <div className="wrap grid2">
              <div className="tile" style={{ order: 0 }}>
                <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 12 }}>What Daraz checks on a return</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {daraZList.map((x) => (
                    <div key={x} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 15 }}>
                      <span style={{ width: 20, height: 20, flex: "none", borderRadius: 5, border: "2px solid var(--brand)", display: "grid", placeItems: "center", color: "var(--brand)", fontSize: 12, fontWeight: 800 }}>✓</span>{x}
                    </div>
                  ))}
                </div>
                <a href="https://www.daraz.pk/return-policy/" style={{ display: "inline-block", marginTop: 14, fontSize: 13, color: "var(--sub)" }}>From Daraz's return policy</a>
              </div>
              <div>
                <span className="eyebrow">Built around the rules</span>
                <h2 className="grad">Show every item Daraz will look for, before it ships.</h2>
                <p style={{ fontSize: 17 }}>Save a checklist for each product. During packing, Saboot prompts the packer to hold each item to the camera: tags, manual, warranty card, free gift, invoice. If a return comes back without them, your clip shows they went out.</p>
              </div>
            </div>
          </section>

          <section className="reveal">
            <div className="wrap">
              <span className="eyebrow">Claim windows we track</span>
              <h2>Deadlines are short, and every company sets its own.</h2>
              <div className="tscroll" style={{ marginTop: 24 }} dir="ltr">
                <table>
                  <thead><tr><th>Company</th><th>Window</th><th>What they ask for</th><th>Source</th></tr></thead>
                  <tbody>{rules.map(([c, w, a, u]) => (
                    <tr key={c}><td style={{ fontWeight: 700 }}>{c}</td><td style={{ fontWeight: 600 }}>{w}</td><td style={{ color: "var(--sub)" }}>{a}</td><td><a href={u}>Policy</a></td></tr>
                  ))}</tbody>
                </table>
              </div>
              <p style={{ fontSize: 13, marginTop: 14 }}>We found no published claim window for Trax, so it is not listed. Policies change. Check the company's current terms before you rely on a deadline.</p>
            </div>
          </section>

          <section id="calculator" className="band reveal">
            <div className="wrap grid2">
              <div>
                <span className="eyebrow">Loss calculator</span>
                <h2 className="grad">What bad returns cost you every month.</h2>
                <p>Move the sliders to match your store. The estimate assumes you win 6 in 10 claims once you have proof.</p>
                <div style={{ display: "grid", gap: 18, marginTop: 20 }}>
                  <label className="f" htmlFor="c-orders">Orders a month: <b className="display-num">{calc.orders.toLocaleString("en-PK")}</b><input id="c-orders" type="range" style={rangeStyle(calc.orders, 50, 3000)} min="50" max="3000" step="50" value={calc.orders} onChange={setC("orders")} /></label>
                  <label className="f" htmlFor="c-ret">Parcels returned: <b className="display-num">{calc.ret}%</b><input id="c-ret" type="range" style={rangeStyle(calc.ret, 2, 40)} min="2" max="40" value={calc.ret} onChange={setC("ret")} /></label>
                  <label className="f" htmlFor="c-bad">Returns that come back wrong, empty or missing parts: <b className="display-num">{calc.bad}%</b><input id="c-bad" type="range" style={rangeStyle(calc.bad, 2, 50)} min="2" max="50" value={calc.bad} onChange={setC("bad")} /></label>
                  <label className="f" htmlFor="c-value">Average order value: <b className="display-num">{rs(calc.value)}</b><input id="c-value" type="range" style={rangeStyle(calc.value, 500, 20000)} min="500" max="20000" step="100" value={calc.value} onChange={setC("value")} /></label>
                </div>
              </div>
              <div className="panel" dir="ltr">
                <div style={{ display: "grid", gap: 18 }}>
                  <div><div style={{ color: "var(--sub)", fontSize: 14 }}>Bad returns a month</div><span className="big">{Math.round(badReturns)}</span></div>
                  <div><div style={{ color: "var(--sub)", fontSize: 14 }}>Money at risk a month</div><span className="big" style={{ color: "var(--warn)" }}>{rs(monthlyLoss)}</span></div>
                  <div><div style={{ color: "var(--sub)", fontSize: 14 }}>Estimated recoverable with proof</div><span className="big" style={{ color: "var(--brand)" }}>{rs(recoverable)}</span></div>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, fontSize: 15 }}>
                    Standard plan costs <b>Rs 1,999</b> a month. {recoverable > 1999 ? <>That is about <b className="display-num">{Math.max(1, Math.round(recoverable / 1999))}×</b> back.</> : <>At your volume, the Free plan is the better fit.</>}
                  </div>
                </div>
                <p style={{ fontSize: 12, marginTop: 14, marginBottom: 0 }}>An estimate, not a promise. The 6 in 10 win rate is an assumption until our pilot gives real numbers. Outcomes depend on Daraz and courier decisions.</p>
              </div>
            </div>
          </section>

          <section className="reveal">
            <div className="wrap">
              <div className="row grid2">
                <div className="text">
                  <span className="eyebrow">What makes a clip count</span>
                  <h2>Proof has to be hard to argue with.</h2>
                  <p style={{ fontSize: 17 }}>Pakistani law accepts electronic records as evidence, and support teams and courts look for signs a video is genuine. Saboot builds every clip to meet that bar.</p>
                </div>
                <div className="visual grid2" style={{ gap: 12, alignItems: "stretch" }}>
                  {[["One take", "Continuous from empty box to sealed parcel. No cuts."], ["Label in frame", "The courier label is visible and read on camera."], ["Stamped", "Order number, packer and time burned into the record."], ["Fingerprinted", "A unique code saved at upload. Any edit would change it."]].map(([h, d]) => (
                    <div key={h} className="tile"><h3 style={{ fontSize: 17 }}>{h}</h3><p style={{ margin: 0, fontSize: 15 }}>{d}</p></div>
                  ))}
                </div>
              </div>
              <div className="row grid2 flip">
                <div className="text">
                  <span className="eyebrow">Setup</span>
                  <h2>Set up with a phone and a stand.</h2>
                  <p style={{ fontSize: 17 }}>No CCTV contract and no installer. Any of these setups works.</p>
                  <ul className="ticks">
                    <li>Starter: an Android phone on a stand. The phone reads the label.</li>
                    <li>Faster: add a USB barcode scanner.</li>
                    <li>Warehouse: a fixed USB webcam and scanner at each station.</li>
                  </ul>
                </div>
                <div className="visual panel">
                  <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 10 }}>Station setup</div>
                  <svg viewBox="0 0 360 200" role="img" aria-label="A phone on a stand above a packing table with a parcel and a barcode scanner" style={{ width: "100%", height: "auto" }}>
                    <rect x="20" y="150" width="320" height="14" rx="4" fill="var(--kraft)" stroke="var(--line)" />
                    <rect x="60" y="30" width="6" height="120" fill="var(--sub)" />
                    <rect x="60" y="30" width="110" height="6" fill="var(--sub)" />
                    <rect x="140" y="20" width="56" height="28" rx="5" fill="var(--ink)" />
                    <circle cx="168" cy="44" r="4" fill="var(--warn)" />
                    <path d="M168 50 L120 140 L230 140 Z" fill="var(--brand)" opacity=".12" />
                    <rect x="130" y="112" width="90" height="38" rx="4" fill="#c9a978" />
                    <rect x="146" y="120" width="44" height="14" rx="2" fill="#fbfaf6" />
                    <rect x="260" y="128" width="40" height="22" rx="6" fill="var(--sub)" />
                    <text x="168" y="14" textAnchor="middle" fontSize="11" fill="var(--sub)" fontFamily="var(--body)">phone or webcam</text>
                    <text x="280" y="180" textAnchor="middle" fontSize="11" fill="var(--sub)" fontFamily="var(--body)">scanner</text>
                    <text x="175" y="180" textAnchor="middle" fontSize="11" fill="var(--sub)" fontFamily="var(--body)">parcel</text>
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <section className="band reveal">
            <div className="wrap">
              <span className="eyebrow">Why not your phone gallery?</span>
              <h2 className="grad">A video only counts when it is tied to the order.</h2>
              <div className="tscroll" style={{ marginTop: 24 }} dir="ltr">
                <table>
                  <thead><tr><th></th><th>Phone gallery</th><th>CCTV</th><th style={{ color: "var(--brand)" }}>Saboot</th></tr></thead>
                  <tbody>
                    {[["Find a clip by order number", "No", "No", "Instantly"], ["Shows the exact parcel and items", "Sometimes", "Rarely", "Yes, with checklist"], ["Proves the clip was not edited", "No", "No", "Fingerprint + timestamp"], ["Tracks claim deadlines", "No", "No", "With WhatsApp alerts"], ["Ready-to-send evidence file", "No", "No", "One click"], ["Works offline during load-shedding", "Yes", "Needs backup power", "Yes"]].map((r) => (
                      <tr key={r[0]}>{r.map((c, j) => <td key={j} style={j === 3 ? { fontWeight: 700, color: "var(--brand)" } : j === 0 ? { fontWeight: 600 } : { color: "var(--sub)" }}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="pricing" className="reveal">
            <div className="wrap">
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
                <div>
                  <span className="eyebrow">Pricing</span>
                  <h2 className="grad">One saved return pays for the month.</h2>
                  <p style={{ margin: 0 }}>Planned flat price. We will not take a share of what you recover.</p>
                </div>
                <div className="tabs" role="tablist" aria-label="Billing period">
                  <button role="tab" className="tab" aria-selected={!yearly} onClick={() => setYearly(false)}>Monthly</button>
                  <button role="tab" className="tab" aria-selected={yearly} onClick={() => setYearly(true)}>Yearly · 2 months free</button>
                </div>
              </div>
              <div className="grid3" style={{ marginTop: 36 }} dir="ltr">
                {[["Free", 0, "10 parcels a month", ["Packing and return videos", "Claim tracker", "Evidence PDF", "30-day storage"], false],
                  ["Standard", 1999, "300 parcels a month", ["Everything in Free", "WhatsApp deadline alerts", "Item checklists per product", "Dashboard", "3 packer logins", "180-day storage"], true],
                  ["Growth", 4999, "800 parcels a month", ["Everything in Standard", "10 packer logins and stations", "Order import by CSV", "1-year storage", "Priority WhatsApp support"], false]].map(([n, m, q, items, hot]) => (
                  <motion.div
                    key={n}
                    className="tile"
                    style={hot ? { border: "2px solid var(--brand)", position: "relative" } : { position: "relative" }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + (["Free","Standard","Growth"].indexOf(n) * 0.08), ease: [0.22, 1, 0.36, 1] }}
                  >
                    {hot && <span className="pill" style={{ position: "absolute", top: -12, insetInlineStart: 22, background: "var(--brand)", color: "var(--on-brand)" }}>Most popular</span>}
                    <h3>{n}</h3>
                    <span className="big">{price(m)}<span style={{ fontSize: 15, color: "var(--sub)", fontWeight: 500, fontFamily: "var(--body)" }}> / month</span></span>
                    <div style={{ color: "var(--sub)", minHeight: 24 }}>{yearly && m ? `Billed ${rs(m * 10)} a year · ` : ""}{q}</div>
                    <ul className="ticks">{items.map((x) => <li key={x}>{x}</li>)}</ul>
                    <a href="#start" className={`btn ${hot ? "btn-p" : "btn-g"}`} style={{ width: "100%", marginTop: 18 }}>Choose {n}</a>
                  </motion.div>
                ))}
              </div>
              <p style={{ fontSize: 13, marginTop: 16 }}>Planned prices for launch. Each parcel covers one packing clip of up to 60 seconds and, if it comes back, one return clip. Clips are kept for the storage period of your plan, and longer while a claim is open. Payment methods will be confirmed before billing starts. Prices exclude tax.</p>
            </div>
          </section>

          <section id="faq" className="band reveal">
            <div className="wrap" style={{ maxWidth: 820 }}>
              <span className="eyebrow">FAQ</span>
              <h2>Questions sellers ask.</h2>
              <div className="faq" style={{ marginTop: 18 }} dir="ltr">
                {faqs.map(([q, a], i) => (
                  <div key={q}>
                    <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{q}<span style={{ color: "var(--brand)" }} aria-hidden="true">{open === i ? "−" : "+"}</span></button>
                    {open === i && <p style={{ paddingBottom: 18, marginTop: -4 }}>{a}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="start" className="night reveal">
            <div className="wrap grid2">
              <div>
                <h2>{t.finalH}</h2>
                <p style={{ fontSize: 18 }}>{t.finalP}</p>
              </div>
              <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: 24, display: "grid", gap: 14 }} dir="ltr">
                {sent ? (
                  <div style={{ padding: "24px 4px" }}>
                    <h3 style={{ color: "var(--night-ink)" }}>You're on the list.</h3>
                    <p style={{ margin: 0 }}>We'll message you on WhatsApp to set up your first packing station.</p>
                  </div>
                ) : (submitError ? (
                  <div style={{ padding: "24px 4px", color: "var(--night-ink)" }}>
                    <h3 style={{ color: "var(--brand-soft)" }}>Something went wrong.</h3>
                    <p style={{ margin: 0 }}>{submitError}</p>
                    <button className="btn btn-p" onClick={() => setSubmitError(null)}>Try again</button>
                  </div>
                ) : (<>
                  <label className="f" htmlFor="store" style={{ color: "var(--night-ink)" }}>Store name<input id="store" className="field" required placeholder="e.g. Karachi Gadgets" /></label>
                  <label className="f" htmlFor="phone" style={{ color: "var(--night-ink)" }}>WhatsApp number<input id="phone" className="field" required placeholder="03xx xxxxxxx" inputMode="tel" pattern="[0-9 +\-]{10,15}" /></label>
                  <label className="f" htmlFor="volume" style={{ color: "var(--night-ink)" }}>Where do you sell?
                    <select id="volume" className="field" defaultValue="daraz"><option value="daraz">Daraz</option><option value="social">Instagram / WhatsApp</option><option value="site">My own website</option><option value="all">More than one</option></select>
                  </label>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12, color: "var(--night-ink)" }}>
                    <input type="checkbox" required checked={termsConsent} onChange={(e) => setTermsConsent(e.target.checked)} style={{ marginTop: 2 }} />
                    I agree to the <a href="/terms" style={{ color: "inherit", textDecoration: "underline" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "inherit", textDecoration: "underline" }}>Privacy Policy</a>
                  </label>
                  <button className="btn btn-p" type="submit" disabled={submitting || !termsConsent}>{submitting ? 'Submitting...' : 'Get early access'}</button>
                </>))}
              </form>
            </div>
          </section>

          {cookieConsent === null && (
            <div
              className="cookie-bubble"
              style={{
                position: "fixed",
                bottom: 16,
                right: 16,
                left: 16,
                maxWidth: 340,
                margin: "0 auto",
                background: "var(--bg)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: 18,
                zIndex: 50,
                fontSize: 13,
                color: "var(--ink)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--ink)" }}>{t.cookie.desc}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => setCookieConsent(true)} className="btn btn-p" style={{ padding: "10px 18px", fontSize: 13, flex: 1, minWidth: 110, borderRadius: 8 }}>{t.cookie.accept}</button>
                <button onClick={() => setCookieConsent(false)} style={{ padding: "10px 18px", fontSize: 13, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", flex: 1, minWidth: 110, borderRadius: 8, color: "var(--ink)" }}>{t.cookie.decline}</button>
              </div>
              <a href="/privacy" style={{ color: "var(--brand-soft)", textDecoration: "underline", fontSize: 12, textAlign: "center", display: "block", marginTop: 4 }}>{t.cookie.privacy}</a>
            </div>
          )}

          <footer className="night" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
            <div className="wrap" dir="ltr" style={{ paddingBlock: 28, display: "grid", gap: 14, fontSize: 13, color: "var(--night-sub)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
                <span style={{ fontWeight: 700 }}>Sources:</span>
                {sources.map(([n, u]) => <a key={u} href={u}>{n}</a>)}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
                <span>© 2026 Saboot · Made in Pakistan</span>
                <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                  <a href="/privacy" style={{ color: "inherit", textDecoration: "underline" }}>Privacy</a>
                  <a href="/terms" style={{ color: "inherit", textDecoration: "underline" }}>Terms</a>
                </div>
                <span>Not affiliated with, endorsed by or integrated with Daraz, Priceoye, TCS, Leopards, PostEx or Trax.</span>
              </div>
            </div>
          </footer>

          <div className="sticky-cta">
            <a href="#calculator" className="btn btn-g">Calculator</a>
            <a href="#start" className="btn btn-p">{t.start}</a>
          </div>
        </>
      )}
    </div>
  );
}