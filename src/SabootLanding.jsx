import React, { useState, useEffect } from "react";

/*
  Saboot (ثبوت) — marketing landing page, v2
  Single-file React component. No dependencies beyond React.

  Sections: nav (EN/اردو toggle) · hero with live scan-to-record demo · problem figures ·
  who it's for (tabs) · how it works · alternating feature rows · Daraz return checklist ·
  rules table · loss calculator · evidence standards · setup kit · comparison ·
  pricing (monthly/annual) · FAQ · sign-up · footer with sources · sticky mobile CTA.
*/

const css = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap");
/* Layout: zigzag feature rows between full-width bands; parcel-green accent on kraft-tinted neutrals; parcel-label details as the subject's signature. */
/* Pakistan flag colours: --pk-green #01411C and white lead the banner; the site accent follows that green. */
:root { --pk-green:#01411C; --pk-green-2:#0a5a2c; --pk-white:#ffffff; --ink:#17201b; --sub:#55625b; --line:#e0e4dc; --bg:#f6f5f0; --card:#fffefb; --kraft:#efe6d6; --brand:#01411C; --brand-soft:#e2eee5; --warn:#c2410c; --warn-soft:#fbeadf; --amber:#a16207; --amber-soft:#fbf1d6; --night:#10201a; --night-ink:#e8f0eb; --night-sub:#a9bdb3; --on-brand:#ffffff;
  --display:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif; --body:"Figtree","Segoe UI",system-ui,sans-serif; --mono:ui-monospace,"Cascadia Mono",Consolas,monospace; --urdu:"Noto Nastaliq Urdu","Jameel Noori Nastaleeq",serif; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --ink:#e8eee9; --sub:#a3b2aa; --line:#2a3a33; --bg:#0f1714; --card:#15201c; --kraft:#2a2419; --brand:#4cc38a; --brand-soft:#123a24; --warn:#f08a5d; --warn-soft:#3a2219; --amber:#e3b04b; --amber-soft:#382c12; --night:#0a110e; --on-brand:#06140e; color-scheme: dark; } }
:root[data-theme="dark"] { --ink:#e8eee9; --sub:#a3b2aa; --line:#2a3a33; --bg:#0f1714; --card:#15201c; --kraft:#2a2419; --brand:#4cc38a; --brand-soft:#123a24; --warn:#f08a5d; --warn-soft:#3a2219; --amber:#e3b04b; --amber-soft:#382c12; --night:#0a110e; --on-brand:#06140e; color-scheme: dark; }
body { background: var(--bg); }
.sb, .sb * { box-sizing: border-box; }
.sb { font-family: var(--body); color: var(--ink); background: var(--bg); line-height: 1.55; font-size: 16px; }
.sb[dir="rtl"] { font-family: var(--urdu); line-height: 2.1; }
.sb[dir="rtl"] h1, .sb[dir="rtl"] h2, .sb[dir="rtl"] h3 { font-family: var(--urdu); line-height: 1.9; letter-spacing: 0; }
.sb h1, .sb h2, .sb h3 { font-family: var(--display); text-wrap: balance; color: var(--ink); }
.sb a { color: inherit; }
.sb :focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; border-radius: 4px; }
.sb .wrap { max-width: 1140px; margin: 0 auto; padding-left: max(20px, env(safe-area-inset-left, 0px)); padding-right: max(20px, env(safe-area-inset-right, 0px)); }
.sb .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 22px; border-radius: 10px; font-weight: 600; font-size: 15px; text-decoration: none; border: 0; cursor: pointer; font-family: inherit; }
.sb .btn-p { background: var(--brand); color: var(--on-brand); }
.sb .btn-p:hover { filter: brightness(.93); }
.sb .btn-g { background: transparent; color: var(--ink); border: 1px solid var(--line); }
.sb .eyebrow { font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--brand); }
.sb h1 { font-size: clamp(34px, 5vw, 58px); line-height: 1.06; margin: 14px 0 18px; letter-spacing: -.025em; }
.sb h2 { font-size: clamp(26px, 3.4vw, 40px); line-height: 1.12; margin: 10px 0 14px; letter-spacing: -.015em; }
.sb h3 { font-size: 20px; margin: 0 0 8px; }
.sb p { margin: 0 0 14px; color: var(--sub); max-width: 62ch; }
.sb section { padding-block: 88px; }
.sb .band { background: var(--card); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.sb .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.sb .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.sb .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.sb .grid2 > *, .sb .grid3 > *, .sb .grid4 > * { min-width: 0; }
.sb .row.flip .text { order: 2; } .sb .row.flip .visual { order: 1; }
.sb .row + .row { margin-top: 104px; }
.sb .ticks { list-style: none; padding: 0; margin: 18px 0 0; display: grid; gap: 10px; }
.sb .ticks li { padding-inline-start: 28px; position: relative; color: var(--ink); }
.sb .ticks li::before { content: ""; position: absolute; inset-inline-start: 0; top: 5px; width: 16px; height: 16px; border-radius: 50%; background: var(--brand-soft); box-shadow: inset 0 0 0 5px var(--brand); }
.sb[dir="rtl"] .ticks li::before { top: 12px; }
.sb .panel { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 22px; box-shadow: 0 24px 60px -36px rgba(15,60,40,.45); }
.sb .tile { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 22px; }
.sb .big { display: block; font-family: var(--display); font-size: 32px; font-weight: 800; color: var(--ink); letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.sb .pill { display: inline-block; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; white-space: nowrap; }
.sb .mono { font-family: var(--mono); }
.sb .tscroll { overflow-x: auto; }
.sb table { width: 100%; border-collapse: collapse; font-size: 15px; min-width: 560px; }
.sb th, .sb td { padding: 14px 12px; border-bottom: 1px solid var(--line); text-align: start; vertical-align: top; }
.sb th { font-size: 13px; color: var(--sub); font-weight: 600; }
.sb .tabs { display: flex; flex-wrap: wrap; gap: 8px; }
.sb .tab { padding: 10px 16px; border-radius: 99px; border: 1px solid var(--line); background: var(--card); color: var(--ink); font: inherit; font-weight: 600; cursor: pointer; }
.sb .tab[aria-selected="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.sb .faq button { width: 100%; text-align: start; background: none; border: 0; padding: 18px 0; font: inherit; font-size: 17px; font-weight: 600; color: var(--ink); cursor: pointer; display: flex; justify-content: space-between; gap: 16px; }
.sb .faq > div { border-bottom: 1px solid var(--line); }
.sb label.f { display: grid; gap: 6px; font-size: 14px; font-weight: 600; color: var(--ink); }
.sb input[type=range] { width: 100%; accent-color: var(--brand); }
.sb .field { display: block; width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: var(--ink); font: inherit; font-size: 15px; }
.sb .night { background: var(--night); color: var(--night-ink); }
.sb .night p { color: var(--night-sub); }
.sb .night h2 { color: var(--night-ink); }
.sb .night .field { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.16); color: var(--night-ink); }
.sb .label-strip { background: repeating-linear-gradient(90deg, var(--ink) 0 2px, transparent 2px 4px, var(--ink) 4px 5px, transparent 5px 8px); height: 34px; border-radius: 2px; opacity: .85; }
.sb .scanline { position: absolute; left: 10%; right: 10%; height: 2px; background: #ff4d4d; box-shadow: 0 0 12px #ff4d4d; animation: scan 2.4s ease-in-out infinite; }
@keyframes scan { 0%,100% { top: 22%; } 50% { top: 74%; } }
.sb .blink { animation: blink 1.2s steps(2, start) infinite; }
@keyframes blink { to { visibility: hidden; } }
/* ---- Pakistan banner: white hoist stripe + green field, parcel travels the whole journey ---- */
.sb .pk { position: relative; overflow: hidden; color: var(--pk-white); background: linear-gradient(90deg, var(--pk-white) 0 clamp(18px, 6vw, 72px), var(--pk-green) clamp(18px, 6vw, 72px)); }
.sb .pk::after { content: ""; position: absolute; inset: 0; background: radial-gradient(1200px 400px at 80% -10%, rgba(255,255,255,.10), transparent 60%), repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 2px, transparent 2px 22px); pointer-events: none; }
.sb .pk .inner { position: relative; z-index: 1; padding-block: 64px 40px; padding-left: max(calc(clamp(18px, 6vw, 72px) + 24px), env(safe-area-inset-left, 0px)); padding-right: max(20px, env(safe-area-inset-right, 0px)); max-width: 1240px; margin: 0 auto; }
.sb .pk h1 { color: var(--pk-white); max-width: 17ch; }
.sb .pk p { color: rgba(255,255,255,.82); }
.sb .pk .eyebrow { color: #bfe3cb; }
.sb .pk .btn-p { background: var(--pk-white); color: var(--pk-green); }
.sb .pk .btn-g { color: var(--pk-white); border-color: rgba(255,255,255,.4); }
.sb .pk .moon { position: absolute; z-index: 0; right: -60px; top: -30px; width: min(520px, 70vw); opacity: .13; animation: moon 14s ease-in-out infinite alternate; }
@keyframes moon { from { transform: rotate(-6deg) translateY(0); } to { transform: rotate(4deg) translateY(16px); } }
.sb .journey { position: relative; margin-top: 44px; padding-top: 30px; }
.sb .journey .rail { position: absolute; left: 0; right: 0; top: 52px; height: 3px; background: repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 10px, transparent 10px 18px); }
.sb .journey .fill { position: absolute; left: 0; top: 52px; height: 3px; background: var(--pk-white); width: 0; animation: fill 14s linear infinite; }
@keyframes fill { 0% { width: 0; } 92% { width: 100%; } 100% { width: 100%; } }
.sb .journey .parcel { position: absolute; top: 34px; left: 0; width: 38px; height: 38px; margin-left: -19px; animation: travel 14s linear infinite; filter: drop-shadow(0 6px 10px rgba(0,0,0,.35)); }
@keyframes travel { 0% { left: 0; } 92% { left: 100%; } 100% { left: 100%; } }
.sb .journey ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(6, 1fr); position: relative; }
.sb .journey li { display: grid; justify-items: center; text-align: center; gap: 6px; padding-top: 4px; font-family: var(--body); }
.sb .journey li:first-child { justify-items: start; text-align: start; } .sb .journey li:last-child { justify-items: end; text-align: end; }
.sb .journey .dot { width: 16px; height: 16px; border-radius: 50%; background: var(--pk-green); border: 3px solid rgba(255,255,255,.6); margin-top: 10px; animation-duration: 14s; animation-timing-function: linear; animation-iteration-count: infinite; }
@keyframes lit { 0% { background: var(--pk-white); border-color: var(--pk-white); box-shadow: 0 0 0 6px rgba(255,255,255,.18); } 8% { box-shadow: 0 0 0 0 rgba(255,255,255,0); } 92% { background: var(--pk-white); border-color: var(--pk-white); } 100% { background: var(--pk-green); border-color: rgba(255,255,255,.6); } }
.sb .journey b { font-size: 15px; } .sb .journey small { font-size: 12.5px; color: rgba(255,255,255,.7); max-width: 16ch; }
.sb .ticker { position: relative; z-index: 1; border-top: 1px solid rgba(255,255,255,.18); overflow: hidden; white-space: nowrap; font-family: var(--body); font-size: 14px; color: rgba(255,255,255,.85); }
.sb .ticker div { display: inline-block; padding-block: 12px; animation: tick 40s linear infinite; }
.sb .ticker span { margin-inline: 22px; }
@keyframes tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.sb .issue { display: grid; gap: 10px; align-content: start; }
.sb .issue .big { font-size: 30px; }
.sb .tag { justify-self: start; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; }
.sb .sticky-cta { display: none; }
@media (max-width: 720px) {
  .sb .journey ol { grid-template-columns: repeat(3, 1fr); row-gap: 18px; }
  .sb .journey .rail, .sb .journey .fill, .sb .journey .parcel { display: none; }
  .sb .journey li, .sb .journey li:first-child, .sb .journey li:last-child { justify-items: center; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .sb .scanline, .sb .blink, .sb .moon, .sb .ticker div { animation: none; }
  .sb .journey .parcel { animation: none; left: 100%; } .sb .journey .fill { animation: none; width: 100%; }
  .sb .journey .dot { animation-name: none !important; background: var(--pk-white); border-color: var(--pk-white); }
}
@media (max-width: 880px) {
  .sb section { padding-block: 60px; }
  .sb .grid2 { grid-template-columns: 1fr; gap: 32px; }
  .sb .row.flip .text, .sb .row.flip .visual { order: initial; }
  .sb .row + .row { margin-top: 64px; }
  .sb .grid3, .sb .grid4 { grid-template-columns: 1fr 1fr; }
  .sb .hide-m { display: none !important; }
  .sb .sticky-cta { display: flex; position: fixed; z-index: 20; left: 0; right: 0; bottom: 0; gap: 10px; padding: 10px max(16px, env(safe-area-inset-right, 0px)) calc(10px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px)); background: var(--card); border-top: 1px solid var(--line); }
  .sb .sticky-cta .btn { flex: 1; }
  .sb footer { padding-bottom: 80px; }
}
@media (max-width: 520px) { .sb .grid3, .sb .grid4 { grid-template-columns: 1fr; } }
`;

/* ---------- copy: English and Urdu for the headline parts ---------- */

const T = {
  en: {
    nav: ["How it works", "Features", "Calculator", "Pricing", "FAQ"],
    start: "Join early access",
    eyebrow: "For Pakistani online sellers",
    h1: "Stop paying for returns that weren't your fault.",
    lead: "The customer says it was defective. The box comes back empty, swapped or missing parts. Saboot records every parcel you pack and every return you open, then hands you the proof to win the claim.",
    cta1: "Join early access",
    cta2: "Work out your losses",
    works: "Tracks published claim rules for Daraz, TCS, Leopards and PostEx. No official partnership with any of them.",
    probEyebrow: "The problem",
    probH: "No video, no claim. Short deadline, no second chance.",
    probP: "Marketplaces and couriers put the burden of proof on you. Without a packing video and a complete claim filed on time, the loss is yours.",
    howH: "Four steps from packing table to payout.",
    finalH: "Your next bad return is already on its way.",
    finalP: "Saboot is in development. Join early access and we will set up your first packing station with you when the pilot opens.",
  },
  ur: {
    nav: ["طریقہ کار", "خصوصیات", "حساب", "قیمت", "سوالات"],
    start: "شامل ہوں",
    eyebrow: "پاکستانی آن لائن سیلرز کے لیے",
    h1: "جن ریٹرنز میں آپ کی غلطی نہیں، ان کا نقصان اب نہیں۔",
    lead: "کسٹمر کہتا ہے چیز خراب تھی۔ پارسل خالی، بدلا ہوا یا ادھورا واپس آتا ہے۔ ثبوت ہر پیکنگ اور ہر ریٹرن کی ویڈیو بناتا ہے اور کلیم جیتنے کے لیے پورا ثبوت تیار کر دیتا ہے۔",
    cta1: "ابتدائی رسائی کے لیے شامل ہوں",
    cta2: "اپنا نقصان معلوم کریں",
    works: "دراز، ٹی سی ایس، لیپرڈز اور پوسٹ ایکس کے شائع شدہ کلیم قواعد۔ کسی کمپنی سے سرکاری شراکت نہیں۔",
    probEyebrow: "مسئلہ",
    probH: "ویڈیو نہیں تو کلیم نہیں۔ وقت کم، دوسرا موقع نہیں۔",
    probP: "مارکیٹ پلیس اور کوریئر ثبوت کی ذمہ داری آپ پر ڈالتے ہیں۔ پیکنگ ویڈیو اور وقت پر مکمل کلیم کے بغیر نقصان آپ کا ہے۔",
    howH: "پیکنگ ٹیبل سے رقم کی واپسی تک چار قدم۔",
    finalH: "آپ کا اگلا خراب ریٹرن راستے میں ہے۔",
    finalP: "ثبوت ابھی تیاری میں ہے۔ ابتدائی رسائی کے لیے شامل ہوں، پائلٹ شروع ہونے پر ہم آپ کے ساتھ پہلا پیکنگ اسٹیشن لگائیں گے۔",
  },
};

/* ---------- visuals ---------- */

const KV = ({ k, v, mono }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderTop: "1px solid var(--line)", paddingTop: 8 }}>
    <span style={{ color: "var(--sub)" }}>{k}</span>
    <span className={mono ? "mono" : ""} style={{ fontWeight: 600, textAlign: "end" }}>{v}</span>
  </div>
);

/* Hero demo: cycles through scan → record → saved, like a real packing station. */
const LiveCapture = () => {
  const steps = ["Scan label", "Recording", "Saved"];
  const [s, setS] = useState(1);
  const [sec, setSec] = useState(14);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setSec((x) => {
        if (x >= 24) { setS(2); setTimeout(() => { setS(0); setTimeout(() => { setS(1); setSec(3); }, 1400); }, 1600); return 24; }
        return x + 1;
      });
    }, 700);
    return () => clearInterval(id);
  }, []);
  const tone = s === 1 ? ["var(--warn-soft)", "var(--warn)"] : s === 2 ? ["var(--brand-soft)", "var(--brand)"] : ["var(--amber-soft)", "var(--amber)"];
  return (
    <div className="panel" style={{ maxWidth: 400, marginInline: "auto", width: "100%" }} dir="ltr">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "var(--sub)", fontFamily: "var(--body)" }}>
        <span>Packing station 1 · Bilal</span>
        <span className="pill" style={{ background: tone[0], color: tone[1] }}>
          {s === 1 ? <><span className="blink">●</span> REC 00:{String(sec).padStart(2, "0")}</> : steps[s]}
        </span>
      </div>
      <div style={{ marginTop: 14, height: 210, borderRadius: 12, background: "linear-gradient(135deg,#25443a,#0d1f18)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "18%", right: "18%", top: "26%", bottom: "20%", borderRadius: 6, background: "#c9a978", boxShadow: "inset 0 0 0 2px rgba(0,0,0,.15)" }}>
          <div style={{ position: "absolute", left: "12%", right: "12%", top: "16%", padding: 8, background: "#fbfaf6", borderRadius: 3 }}>
            <div className="label-strip" style={{ "--ink": "#17201b" }} />
            <div className="mono" style={{ fontSize: 10, color: "#17201b", marginTop: 4 }}>TCS 7781 2290 4410</div>
          </div>
        </div>
        {s === 0 && <div className="scanline" />}
        <div className="mono" style={{ position: "absolute", left: 12, bottom: 10, color: "#cfe9dd", fontSize: 11 }}>24-10-2026 14:32:{String(sec + 10).padStart(2, "0")} PKT</div>
      </div>
      <div style={{ marginTop: 14, display: "grid", gap: 8, fontSize: 14, fontFamily: "var(--body)" }}>
        <KV k="Order" v="DZ-4482190" />
        <KV k="Item" v="Wireless earbuds" />
        <KV k="On camera" v="Case · cable · warranty card · invoice" />
        <KV k="Fingerprint" v={s === 2 ? "9f2c…a71e ✓" : "pending"} mono />
      </div>
    </div>
  );
};

const ReturnCompare = () => (
  <div className="panel">
    <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 12 }}>Return check · DZ-4482190</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {[["Sent 24 Oct", ["Earbuds", "Case", "Cable", "Warranty card"], "var(--brand-soft)", "var(--brand)", []],
        ["Came back 2 Nov", ["Earbuds", "Case", "Cable", "Warranty card"], "var(--warn-soft)", "var(--warn)", ["Earbuds", "Warranty card"]]].map(([t, items, bg, fg, missing]) => (
        <div key={t} style={{ borderRadius: 12, background: bg, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: fg, textTransform: "uppercase", letterSpacing: ".06em" }}>{t}</div>
          <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "grid", gap: 6, fontSize: 14 }}>
            {items.map((x) => (
              <li key={x} style={{ display: "flex", gap: 8, color: missing.includes(x) ? "var(--warn)" : "var(--ink)", textDecoration: missing.includes(x) ? "line-through" : "none" }}>
                <span aria-hidden="true">{missing.includes(x) ? "✕" : "✓"}</span>{x}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: "var(--warn-soft)", color: "var(--warn)", fontSize: 14, fontWeight: 700 }}>
      Claim record opened in Saboot · Missing items
    </div>
  </div>
);

const DeadlineList = () => (
  <div className="panel">
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--sub)", marginBottom: 6 }}><span>Claims due</span><span>Today: 2 Nov</span></div>
    {[["Daraz", "DZ-4482190 · return", "Due today", "var(--warn)", "var(--warn-soft)"],
      ["Leopards", "LP-55821 · damaged", "2 days left", "var(--amber)", "var(--amber-soft)"],
      ["PostEx", "PX-118402 · lost", "9 days left", "var(--brand)", "var(--brand-soft)"],
      ["TCS", "7781 2290 4410 · lost", "21 days left", "var(--brand)", "var(--brand-soft)"]].map(([p, id, d, fg, bg]) => (
      <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ minWidth: 0 }}><div style={{ fontWeight: 700 }}>{p}</div><div style={{ fontSize: 13, color: "var(--sub)" }}>{id}</div></div>
        <span className="pill" style={{ background: bg, color: fg }}>{d}</span>
      </div>
    ))}
    <div style={{ marginTop: 10, fontSize: 13, color: "var(--sub)" }}>WhatsApp reminder sent to owner at 09:00</div>
  </div>
);

const BundlePreview = () => (
  <div className="panel" style={{ maxWidth: 400, marginInline: "auto" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
      <b>Evidence-DZ-4482190.pdf</b><span className="pill" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>Ready</span>
    </div>
    <ol style={{ margin: "14px 0 0", paddingInlineStart: 20, display: "grid", gap: 6, fontSize: 14 }}>
      <li>Order, courier and return tracking numbers</li>
      <li>Packing video · fingerprint · timestamp</li>
      <li>Return-opening video · fingerprint · timestamp</li>
      <li>Side-by-side item checklist</li>
      <li>Label and weight photos</li>
      <li>Seller statement you can paste into a Daraz or courier claim</li>
      <li>How anyone can verify the files</li>
    </ol>
    <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
      <span className="btn btn-p" style={{ padding: "9px 14px", fontSize: 14 }}>Share on WhatsApp</span>
      <span className="btn btn-g" style={{ padding: "9px 14px", fontSize: 14 }}>Download PDF</span>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="panel">
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--sub)", marginBottom: 12 }}><span>October · Example store</span><span>Sample figures</span></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {[["Parcels recorded", "1,284"], ["Bad returns", "37"], ["Claims filed", "31"], ["Rs recovered", "64,200"]].map(([k, v]) => (
        <div key={k} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 13, color: "var(--sub)" }}>{k}</div><div className="big" style={{ fontSize: 24 }}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 14, fontSize: 13, color: "var(--sub)" }}>Most bad returns: Lahore · Leopards · earbuds</div>
  </div>
);

/* Full-width banner in Pakistan's colours: the parcel travels the whole journey, pack to refund. */
const journey = [
  ["Pack", "Karachi · video saved"],
  ["Courier", "TCS picks up"],
  ["Customer", "Lahore · COD"],
  ["Return", "Box comes back empty"],
  ["Proof", "Clip vs. return video"],
  ["Refund", "Claim approved"],
];

const PakBanner = ({ t }) => {
  /* Keep each stop's light on the parcel's clock, even if the browser starts the animations at different moments. */
  useEffect(() => {
    const sync = () => {
      const parcel = document.querySelector(".sb .journey .parcel");
      const lead = parcel && parcel.getAnimations ? parcel.getAnimations()[0] : null;
      if (!lead) return;
      document.querySelectorAll(".sb .journey .dot").forEach((d) => d.getAnimations().forEach((a) => { a.currentTime = lead.currentTime; }));
    };
    const id = setTimeout(sync, 300);
    const again = setInterval(sync, 14000);
    document.addEventListener("visibilitychange", sync);
    return () => { clearTimeout(id); clearInterval(again); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return (
  <section className="pk" id="top" style={{ paddingBlock: 0 }}>
    <svg className="moon" viewBox="0 0 200 200" aria-hidden="true">
      <defs><mask id="cres"><rect width="200" height="200" fill="#fff" /><circle cx="118" cy="88" r="70" fill="#000" /></mask></defs>
      <circle cx="96" cy="104" r="84" fill="#fff" mask="url(#cres)" />
      <polygon fill="#fff" points="150,54 156,72 175,72 160,83 166,101 150,90 134,101 140,83 125,72 144,72" />
    </svg>
    {/* One keyframe per stop: each lights when the parcel (92% of a 14 s loop) reaches it, all reset together. */}
    <style>{journey.map((_, i) => {
      const p = +(i / (journey.length - 1) * 92).toFixed(2);
      const off = "background: var(--pk-green); border-color: rgba(255,255,255,.6); box-shadow: none;";
      const on = "background: var(--pk-white); border-color: var(--pk-white);";
      return `@keyframes lit${i} { 0% { ${off} } ${Math.max(p - 0.01, 0)}% { ${off} } ${p}% { ${on} box-shadow: 0 0 0 8px rgba(255,255,255,.25); } ${Math.min(p + 4, 96)}% { ${on} box-shadow: 0 0 0 0 rgba(255,255,255,0); } 97% { ${on} } 100% { ${off} } }`;
    }).join("\n")}</style>
    <div className="inner">
      <span className="eyebrow">{t.eyebrow}</span>
      <h1>{t.h1}</h1>
      <p style={{ fontSize: 19 }}>{t.lead}</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
        <a href="#start" className="btn btn-p">{t.cta1}</a>
        <a href="#calculator" className="btn btn-g">{t.cta2}</a>
      </div>

      <div className="journey" dir="ltr" aria-label="A parcel's journey from packing to refund">
        <div className="rail" /><div className="fill" />
        <svg className="parcel" viewBox="0 0 40 40" aria-hidden="true">
          <rect x="4" y="9" width="32" height="26" rx="3" fill="#c9a978" />
          <rect x="4" y="9" width="32" height="7" rx="2" fill="#b38f5e" />
          <rect x="17" y="9" width="6" height="26" fill="#e9d8b8" />
          <rect x="9" y="21" width="14" height="8" rx="1" fill="#fff" />
        </svg>
        <ol>
          {journey.map(([h, s], i) => (
            <li key={h}>
              <span className="dot" style={{ animationName: `lit${i}` }} />
              <b>{h}</b><small>{s}</small>
            </li>
          ))}
        </ol>
      </div>
    </div>
    <div className="ticker" dir="ltr" aria-hidden="true">
      <div>
        {[0, 1].map((k) => (
          <React.Fragment key={k}>
            <span>94.5% of orders are cash on delivery</span><span>·</span>
            <span>About 1 in 5 COD parcels comes back</span><span>·</span>
            <span>Daraz buyers have 14 days to return</span><span>·</span>
            <span>Leopards claims: 10 days</span><span>·</span>
            <span>TCS and PostEx claims: 30 days</span><span>·</span>
            <span>Priceoye faulty-item claims: 3 days, video required</span><span>·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
  );
};

/* Problems local retailers face, with what Saboot does about each. */
const issues = [
  { fig: "94.5%", what: "of orders are cash on delivery", why: "Buyers can refuse at the door or return at little cost to themselves.", src: ["OrderNation, June 2026", "https://www.ordernation.com/blogs/research/state-of-online-shopping-pakistan-2026"], help: "solves", how: "Parcels you record have a packing clip, so a false 'arrived broken' claim has an answer." },
  { fig: "19.4%", what: "of COD parcels return undelivered", why: "You pay courier charges both ways and earn nothing on the sale.", src: ["OrderNation, June 2026", "https://www.ordernation.com/blogs/research/state-of-online-shopping-pakistan-2026"], help: "helps", how: "Return check shows which refused parcels came back opened, tampered or short." },
  { fig: "~30%", what: "of item value is reported as the deduction when a return fails Daraz quality check", why: "A swapped or stripped return can cost you the item and a penalty.", src: ["Third-party commission guide, 2026", "https://digiteazy.com/daraz-commission-rate-pakistan/"], help: "solves", how: "The item checklist on camera follows the items Daraz's return policy lists." },
  { fig: "3–30 days", what: "to claim, depending on who you claim from", why: "Priceoye 3 days, Leopards 10, TCS and PostEx 30. Miss it and the claim is gone.", src: ["Published policies", "https://pakera.pk/claim-lost-or-damaged-courier-parcel-pakistan/"], help: "solves", how: "Each claim gets its own clock and a WhatsApp alert on the day the bad return arrives." },
  { fig: "7–14 days", what: "some couriers hold your COD cash before paying out", why: "Money for delivered parcels sits with the courier while you restock.", src: ["Logistics guide, 2026", "https://theeasyfinance.com/e-commerce-logistics-and-shipping-in-pakistan/"], help: "next", how: "Planned: match courier payout sheets against your recorded parcels." },
  { fig: "2% vs 1%", what: "tax withheld on COD versus digital payments", why: "COD costs you more, and since July 2025 marketplaces and couriers need you registered with FBR.", src: ["Tax guides, 2025–26", "https://pakera.pk/ecommerce-tax-register-online-sellers-pakistan/"], help: "no", how: "Outside Saboot. Your monthly report gives your accountant clean parcel and return counts." },
];

const helpTag = {
  solves: ["Saboot solves this", "var(--brand-soft)", "var(--brand)"],
  helps: ["Saboot helps", "var(--amber-soft)", "var(--amber)"],
  next: ["On our roadmap", "var(--line)", "var(--sub)"],
  no: ["Not our job, but we help", "var(--line)", "var(--sub)"],
};

/* ---------- content ---------- */

const features = [
  { eyebrow: "Record", title: "Scan the label. The camera does the rest.",
    body: "Put a phone on a stand above the packing table. Scan the courier barcode and recording starts. Scan the next parcel and the last clip saves itself. Packers keep both hands on the box.",
    ticks: ["Any Android phone or a USB webcam", "Order number, time and fingerprint stamped on every clip, up to 60 seconds each", "Compressed on the phone and uploaded straight to private storage, resuming after power or internet cuts"], visual: <LiveCapture /> },
  { eyebrow: "Check returns", title: "Open every return on camera.",
    body: "Scan a returned parcel and record the opening. Saboot puts the item list from the packing clip next to it, so a missing earbud or a swapped product shows up in seconds.",
    ticks: ["What you sent next to what came back", "One tap: OK, wrong item, missing parts, damaged, empty box", "Batch mode for a whole bag of courier returns"], visual: <ReturnCompare /> },
  { eyebrow: "Deadlines", title: "Every claim, every deadline, one list.",
    body: "Daraz, TCS, Leopards and PostEx each publish their own claim rules. Saboot starts the clock the moment a bad return is logged and messages you on WhatsApp before time runs out.",
    ticks: ["Claim windows for each marketplace and courier", "Checklist of the evidence each one asks for", "Alert on the same day a bad return arrives"], visual: <DeadlineList /> },
  { eyebrow: "Send proof", title: "All your evidence for a claim in one file.",
    body: "Each claim gets an evidence bundle: both videos with their fingerprints and timestamps, the item checklist, label photos and a statement you can paste into a Daraz Seller Support claim or a courier claim email. You submit the claim yourself.",
    ticks: ["No more screenshots and voice notes", "A verification page explains the fingerprint", "Private links that expire"], visual: <BundlePreview /> },
  { eyebrow: "Results", title: "See which returns cost you, and where from.",
    body: "Track parcels recorded, bad returns, claims filed and rupees recovered each month. Spot the courier, city or product that keeps causing trouble.",
    ticks: ["Rupees at stake and recovered", "Filters by courier, platform, city and date", "Separate owner and packer logins"], visual: <Dashboard /> },
];

const audiences = {
  daraz: { tab: "Daraz sellers", h: "Back up your Daraz return claims with video.",
    p: "Daraz checks every return at its quality-control centre and asks for tags, manuals, warranty cards, freebies, the invoice and the original box. When a buyer keeps the good unit or strips the accessories, you need to show exactly what left your hands.",
    pts: ["Packing clip shows every item Daraz's return policy lists", "Evidence bundle to attach to your Seller Support claim", "Log each claim's outcome yourself: under review, approved or rejected"] },
  social: { tab: "Instagram & WhatsApp sellers", h: "Settle 'it arrived broken' in one message.",
    p: "You ship with your own courier account and handle customers yourself. Send a buyer the packing clip when they complain, and file courier claims for lost or damaged parcels before the window closes.",
    pts: ["Share a private packing clip link on WhatsApp", "Courier claim deadlines where the courier publishes them", "Works without any marketplace account"] },
  brand: { tab: "Brands with a warehouse", h: "One record for every parcel, every packer.",
    p: "Several packing stations, hundreds of orders a day. Give each packer a login, run fixed webcams with barcode scanners, and see which station, courier or SKU causes the most disputes.",
    pts: ["Multiple stations and packer logins", "Order import from a Daraz or store CSV export", "Yearly video storage for long warranty disputes"] },
};

const daraZList = ["Product unused, with no flaws", "Original tags", "Manuals", "Warranty card", "Free gifts", "Invoice", "All accessories", "Original undamaged box"];

const rules = [
  ["Daraz", "14 days from delivery (buyer return window)", "Return goes through Daraz quality check. Seller claims go through Seller Support.", "https://www.daraz.pk/return-policy/"],
  ["Priceoye", "3 days from delivery", "Full unboxing video plus video of the fault. Priceoye records a packing video for every order.", "https://priceoye.pk/return-policy"],
  ["Leopards", "10 days from the incident", "Written claim within 30 days of booking. Insurance only if requested.", "https://pakera.pk/claim-lost-or-damaged-courier-parcel-pakistan/"],
  ["TCS", "30 days from booking", "Written claim with tracking number, invoice and proof of value.", "https://pakera.pk/claim-lost-or-damaged-courier-parcel-pakistan/"],
  ["PostEx", "30 days from booking", "Written claim. Insurance from 0.5% to 2% of declared value.", "https://postex.com.pk/FAQ.html"],
];

const faqs = [
  ["Does Daraz accept these videos?", "Daraz seller claims go through a Seller Support form that asks for proof. Saboot gives you a continuous, uncut, timestamped clip tied to the order and a written statement. We cannot promise Daraz or any courier will accept a claim. The decision is theirs."],
  ["Will the video hold up if it goes further?", "Pakistani law accepts electronic records as evidence, and courts look for proof a video is genuine and unedited. Each clip is continuous, stamped with the time and order number, and fingerprinted when it is saved, so any change would show."],
  ["Do I need special cameras?", "No. A phone on a stand or a basic USB webcam is enough. A barcode scanner makes it faster, but the phone camera can read labels too."],
  ["What if the internet or power goes out?", "Clips save on the device and upload when the connection is back."],
  ["I sell on Instagram and WhatsApp. Is this for me?", "Yes. Send the packing clip to a customer who disputes a parcel, and file courier claims for lost or damaged parcels on time."],
  ["Will you file the claim for me?", "No. Daraz and the couriers do not offer a way for outside tools to file claims, so you submit each claim yourself. Saboot prepares the evidence and tells you the deadline."],
  ["Does Saboot connect to my courier or Daraz account?", "Not in the first version. You scan the label or upload your booking or order sheet. Daraz and some couriers offer merchant APIs for orders and tracking, and we plan optional connections using your own API keys later."],
  ["Where are my videos stored?", "In private cloud storage run on Supabase, encrypted at rest. Only your store's logins can see them. A clip you share goes out as a private link that stops working after 30 days."],
  ["Why is each clip capped at 60 seconds?", "A minute covers packing one parcel from empty box to sealed label. The phone shrinks each clip to about 720p before upload, so it sends quickly on mobile data and keeps storage costs, and our prices, low."],
  ["What happens if I go over my parcel limit?", "Recording pauses for the rest of the month and your existing clips and claims stay available. Move up a plan at any time. If you pack more than 800 parcels a month, contact us."],
  ["How long are videos kept?", "30 days on Free, 180 days on Standard and a full year on Growth. Videos linked to an open claim are kept until it closes."],
];

const sources = [
  ["State of online shopping 2026", "https://www.ordernation.com/blogs/research/state-of-online-shopping-pakistan-2026"],
  ["Courier payout times", "https://theeasyfinance.com/e-commerce-logistics-and-shipping-in-pakistan/"],
  ["FBR registration for sellers", "https://pakera.pk/ecommerce-tax-register-online-sellers-pakistan/"],
  ["Daraz return policy", "https://www.daraz.pk/return-policy/"],
  ["Priceoye return policy", "https://priceoye.pk/return-policy"],
  ["Courier claim deadlines", "https://pakera.pk/claim-lost-or-damaged-courier-parcel-pakistan/"],
  ["PostEx FAQ", "https://postex.com.pk/FAQ.html"],
  ["COD return rates", "https://www.dhl.com/discover/en-pk/e-commerce-advice/e-commerce-best-practice/subscription-marketing/how-pakistani-e-commerce-sellers-can-reduce-cod-returns"],
  ["Daraz seller claims", "https://blog.sellerdash.pk/seller-claims/"],
];

const rs = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");

/* ---------- page ---------- */

export default function SabootLanding() {
  const [lang, setLang] = useState("en");
  const [aud, setAud] = useState("daraz");
  const [open, setOpen] = useState(0);
  const [yearly, setYearly] = useState(false);
  const [sent, setSent] = useState(false);
  const [calc, setCalc] = useState({ orders: 400, ret: 20, bad: 15, value: 3500 });
  const t = T[lang];
  const rtl = lang === "ur";

  const badReturns = (calc.orders * calc.ret * calc.bad) / 10000;
  const monthlyLoss = badReturns * calc.value;
  const recoverable = monthlyLoss * 0.6;
  const setC = (k) => (e) => setCalc({ ...calc, [k]: Number(e.target.value) });

  const price = (m) => (m === 0 ? "Rs 0" : rs(yearly ? m * 10 / 12 : m));

  return (
    <div className="sb" dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ur" : "en"}>
      <style>{css}</style>

      {/* NAV */}
      <header style={{ position: "sticky", top: "env(safe-area-inset-top, 0px)", zIndex: 15, background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, height: 66 }}>
          <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 20, textDecoration: "none", fontFamily: "var(--display)" }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--brand)", color: "var(--on-brand)", display: "grid", placeItems: "center", fontSize: 16 }}>S</span>
            Saboot <span style={{ fontFamily: "var(--urdu)", fontWeight: 400, color: "var(--sub)", fontSize: 15 }}>ثبوت</span>
          </a>
          <nav className="hide-m" style={{ display: "flex", gap: 24, fontSize: 15 }}>
            {["#how", "#features", "#calculator", "#pricing", "#faq"].map((h, i) => <a key={h} href={h} style={{ textDecoration: "none" }}>{t.nav[i]}</a>)}
          </nav>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="tab" style={{ padding: "8px 12px", fontFamily: rtl ? "var(--body)" : "var(--urdu)" }} onClick={() => setLang(rtl ? "en" : "ur")} aria-label="Switch language">
              {rtl ? "English" : "اردو"}
            </button>
            <a href="#start" className="btn btn-p hide-m" style={{ padding: "10px 16px" }}>{t.start}</a>
          </div>
        </div>
      </header>

      {/* END-TO-END ANIMATED BANNER — Pakistan green and white */}
      <PakBanner t={t} />

      {/* WORKS WITH */}
      <div className="band" style={{ borderTop: 0 }}>
        <div className="wrap" style={{ paddingBlock: 18, fontSize: 14, color: "var(--sub)", textAlign: "center" }}>{t.works}</div>
      </div>

      {/* LOCAL RETAILER PROBLEMS */}
      <section id="problems">
        <div className="wrap">
          <span className="eyebrow">{t.probEyebrow}</span>
          <h2>{t.probH}</h2>
          <p>{t.probP} Here is what local sellers deal with every week, and where Saboot fits.</p>
          <div className="grid3" style={{ marginTop: 32 }} dir="ltr">
            {issues.map((x) => {
              const [label, bg, fg] = helpTag[x.help];
              return (
                <article key={x.what} className="tile issue">
                  <span className="big">{x.fig}</span>
                  <b style={{ fontSize: 16 }}>{x.what}</b>
                  <span style={{ color: "var(--sub)", fontSize: 15 }}>{x.why}</span>
                  <span className="tag" style={{ background: bg, color: fg }}>{label}</span>
                  <span style={{ fontSize: 15 }}>{x.how}</span>
                  <a href={x.src[1]} style={{ fontSize: 12.5, color: "var(--sub)" }}>{x.src[0]}</a>
                </article>
              );
            })}
          </div>
          <p style={{ fontSize: 13, marginTop: 16 }}>Figures come from industry datasets, vendor reports and published policies, checked October 2026. Treat vendor figures as estimates.</p>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="band">
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

      {/* HOW IT WORKS */}
      <section id="how" className="band">
        <div className="wrap">
          <span className="eyebrow">How it works</span>
          <h2>{t.howH}</h2>
          <div className="grid4" style={{ marginTop: 36 }}>
            {[["Pack", "Scan the label. The packing is recorded."], ["Return", "Scan the return. The opening is recorded."], ["Claim", "Saboot opens the claim and starts the clock."], ["Recover", "Send the bundle and track it to a decision."]].map(([h, d], i) => (
              <div key={h} className="tile">
                <div className="mono" style={{ fontSize: 13, color: "var(--brand)", fontWeight: 700, marginBottom: 10 }}>Step {i + 1}</div>
                <h3>{h}</h3><p style={{ margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALTERNATING FEATURES */}
      <section id="features">
        <div className="wrap">
          {features.map((f, i) => (
            <div key={f.title} className={`row grid2 ${i % 2 ? "flip" : ""}`}>
              <div className="text">
                <span className="eyebrow">{f.eyebrow}</span>
                <h2>{f.title}</h2>
                <p style={{ fontSize: 17 }}>{f.body}</p>
                <ul className="ticks">{f.ticks.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="visual">{f.visual}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DARAZ CHECKLIST — alternating, kraft band */}
      <section style={{ background: "var(--kraft)" }}>
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
            <h2>Show every item Daraz will look for, before it ships.</h2>
            <p style={{ fontSize: 17 }}>Save a checklist for each product. During packing, Saboot prompts the packer to hold each item to the camera: tags, manual, warranty card, free gift, invoice. If a return comes back without them, your clip shows they went out.</p>
          </div>
        </div>
      </section>

      {/* RULES TABLE */}
      <section>
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

      {/* CALCULATOR */}
      <section id="calculator" className="band">
        <div className="wrap grid2">
          <div>
            <span className="eyebrow">Loss calculator</span>
            <h2>What bad returns cost you every month.</h2>
            <p>Move the sliders to match your store. The estimate assumes you win 6 in 10 claims once you have proof.</p>
            <div style={{ display: "grid", gap: 18, marginTop: 20 }}>
              <label className="f" htmlFor="c-orders">Orders a month: {calc.orders.toLocaleString("en-PK")}<input id="c-orders" type="range" min="50" max="3000" step="50" value={calc.orders} onChange={setC("orders")} /></label>
              <label className="f" htmlFor="c-ret">Parcels returned: {calc.ret}%<input id="c-ret" type="range" min="2" max="40" value={calc.ret} onChange={setC("ret")} /></label>
              <label className="f" htmlFor="c-bad">Returns that come back wrong, empty or missing parts: {calc.bad}%<input id="c-bad" type="range" min="2" max="50" value={calc.bad} onChange={setC("bad")} /></label>
              <label className="f" htmlFor="c-value">Average order value: {rs(calc.value)}<input id="c-value" type="range" min="500" max="20000" step="100" value={calc.value} onChange={setC("value")} /></label>
            </div>
          </div>
          <div className="panel" dir="ltr">
            <div style={{ display: "grid", gap: 18 }}>
              <div><div style={{ color: "var(--sub)", fontSize: 14 }}>Bad returns a month</div><span className="big">{Math.round(badReturns)}</span></div>
              <div><div style={{ color: "var(--sub)", fontSize: 14 }}>Money at risk a month</div><span className="big" style={{ color: "var(--warn)" }}>{rs(monthlyLoss)}</span></div>
              <div><div style={{ color: "var(--sub)", fontSize: 14 }}>Estimated recoverable with proof</div><span className="big" style={{ color: "var(--brand)" }}>{rs(recoverable)}</span></div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, fontSize: 15 }}>
                Standard plan costs <b>Rs 1,999</b> a month. {recoverable > 1999 ? <>That is about <b>{Math.max(1, Math.round(recoverable / 1999))}×</b> back.</> : <>At your volume, the Free plan is the better fit.</>}
              </div>
            </div>
            <p style={{ fontSize: 12, marginTop: 14, marginBottom: 0 }}>An estimate, not a promise. The 6 in 10 win rate is an assumption until our pilot gives real numbers. Outcomes depend on Daraz and courier decisions.</p>
          </div>
        </div>
      </section>

      {/* EVIDENCE STANDARD + SETUP — alternating pair */}
      <section>
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

      {/* COMPARISON */}
      <section className="band">
        <div className="wrap">
          <span className="eyebrow">Why not your phone gallery?</span>
          <h2>A video only counts when it is tied to the order.</h2>
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

      {/* PRICING */}
      <section id="pricing">
        <div className="wrap">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
            <div>
              <span className="eyebrow">Pricing</span>
              <h2>One saved return pays for the month.</h2>
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
              <div key={n} className="tile" style={hot ? { border: "2px solid var(--brand)", position: "relative" } : { position: "relative" }}>
                {hot && <span className="pill" style={{ position: "absolute", top: -12, insetInlineStart: 22, background: "var(--brand)", color: "var(--on-brand)" }}>Most popular</span>}
                <h3>{n}</h3>
                <span className="big">{price(m)}<span style={{ fontSize: 15, color: "var(--sub)", fontWeight: 500, fontFamily: "var(--body)" }}> / month</span></span>
                <div style={{ color: "var(--sub)", minHeight: 24 }}>{yearly && m ? `Billed ${rs(m * 10)} a year · ` : ""}{q}</div>
                <ul className="ticks">{items.map((x) => <li key={x}>{x}</li>)}</ul>
                <a href="#start" className={`btn ${hot ? "btn-p" : "btn-g"}`} style={{ width: "100%", marginTop: 18 }}>Choose {n}</a>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, marginTop: 16 }}>Planned prices for launch. Each parcel covers one packing clip of up to 60 seconds and, if it comes back, one return clip. Clips are kept for the storage period of your plan, and longer while a claim is open. Payment methods will be confirmed before billing starts. Prices exclude tax.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="band">
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

      {/* FINAL CTA */}
      <section id="start" className="night">
        <div className="wrap grid2">
          <div>
            <h2>{t.finalH}</h2>
            <p style={{ fontSize: 18 }}>{t.finalP}</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 22, display: "grid", gap: 14 }} dir="ltr">
            {sent ? (
              <div style={{ padding: "24px 4px" }}>
                <h3 style={{ color: "var(--night-ink)" }}>You're on the list.</h3>
                <p style={{ margin: 0 }}>We'll message you on WhatsApp to set up your first packing station.</p>
              </div>
            ) : (<>
              <label className="f" htmlFor="store" style={{ color: "var(--night-ink)" }}>Store name<input id="store" className="field" required placeholder="e.g. Karachi Gadgets" /></label>
              <label className="f" htmlFor="phone" style={{ color: "var(--night-ink)" }}>WhatsApp number<input id="phone" className="field" required placeholder="03xx xxxxxxx" inputMode="tel" pattern="[0-9 +\-]{10,15}" /></label>
              <label className="f" htmlFor="volume" style={{ color: "var(--night-ink)" }}>Where do you sell?
                <select id="volume" className="field" defaultValue="daraz"><option value="daraz">Daraz</option><option value="social">Instagram / WhatsApp</option><option value="site">My own website</option><option value="all">More than one</option></select>
              </label>
              <button className="btn btn-p" type="submit">Get early access</button>
            </>)}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="night" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div className="wrap" style={{ paddingBlock: 28, display: "grid", gap: 14, fontSize: 13, color: "var(--night-sub)" }} dir="ltr">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
            <span style={{ fontWeight: 700 }}>Sources:</span>
            {sources.map(([n, u]) => <a key={u} href={u}>{n}</a>)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
            <span>© 2026 Saboot · Made in Pakistan</span>
            <span>Not affiliated with, endorsed by or integrated with Daraz, Priceoye, TCS, Leopards, PostEx or Trax.</span>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="sticky-cta">
        <a href="#calculator" className="btn btn-g">Calculator</a>
        <a href="#start" className="btn btn-p">{t.start}</a>
      </div>
    </div>
  );
}
