import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Cookie consent is remembered in localStorage so the banner never returns after a choice. */
const CONSENT_KEY = "saboot.cookieConsent";
const GA_ID = "G-DLB08DLTKL";
const readConsent = () => {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" ? true : v === "denied" ? false : null;
  } catch { return null; }
};
const saveConsent = (granted) => {
  try { window.localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied"); } catch { /* private mode: choice lasts for this visit only */ }
};
/* Google Analytics is only fetched after the visitor accepts. */
function loadAnalytics() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") window.gtag = function () { window.dataLayer.push(arguments); };
  if (document.getElementById("ga-script")) return;
  const el = document.createElement("script");
  el.id = "ga-script"; el.async = true;
  el.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(el);
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/*  Fonts (Archivo, Source Serif 4, Noto Nastaliq Urdu) are loaded in   */
/*  index.html so they do not block rendering.                          */
/* ------------------------------------------------------------------ */
const css = `
:root {
  --paper:#eef2f6; --surface:#ffffff; --ink:#101c2e; --sub:#4a5a70; --line:#cad4e0;
  --brand:#1d3fbb; --on-brand:#ffffff;
  --deep:#0f1e3d; --on-deep:#eaf0fb; --on-deep-sub:#b5c4e0; --deep-line:rgba(255,255,255,.2);
  --tape:#ff8a1f; --on-tape:#1f0f00; --alarm:#c8203a;
  --display:"Archivo","Segoe UI",system-ui,sans-serif;
  --ui:"Archivo","Segoe UI",system-ui,sans-serif;
  --prose:"Source Serif 4",Georgia,"Times New Roman",serif;
  --urdu:"Noto Nastaliq Urdu","Jameel Noori Nastaleeq",serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper:#0a111c; --surface:#111b2a; --ink:#e8eef8; --sub:#9fb0c6; --line:#223247;
    --brand:#8aa8ff; --on-brand:#06122e; --deep:#0d1a30; --on-deep-sub:#a9b9d6; --alarm:#ff7a8c;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --paper:#0a111c; --surface:#111b2a; --ink:#e8eef8; --sub:#9fb0c6; --line:#223247;
  --brand:#8aa8ff; --on-brand:#06122e; --deep:#0d1a30; --on-deep-sub:#a9b9d6; --alarm:#ff7a8c;
  color-scheme: dark;
}
html { scroll-behavior: smooth; scroll-padding-top: 76px; }
body { background: var(--paper); margin: 0; }
.sb, .sb * { box-sizing: border-box; }
.sb { font-family: var(--ui); color: var(--ink); background: var(--paper); line-height: 1.55; font-size: 16px; -webkit-font-smoothing: antialiased; overflow-x: clip; }
.sb[dir="rtl"] { font-family: var(--urdu); line-height: 2.1; }
.sb [dir="ltr"] { font-family: var(--ui); line-height: 1.55; }
.sb h1, .sb h2, .sb h3 { font-family: var(--display); color: inherit; margin: 0; text-wrap: balance; }
.sb[dir="rtl"] h1, .sb[dir="rtl"] h2, .sb[dir="rtl"] h3 { font-family: var(--urdu); line-height: 1.9; letter-spacing: 0; font-stretch: 100%; }
.sb h1 { font-size: clamp(40px, 7.2vw, 96px); line-height: 1; font-weight: 600; letter-spacing: -.03em; }
.sb[dir="rtl"] h1 { font-size: clamp(30px, 5vw, 64px); }
.sb h2 { font-size: clamp(28px, 3.5vw, 48px); line-height: 1.08; font-weight: 600; font-stretch: 108%; letter-spacing: -.02em; margin-bottom: 18px; }
.sb h3 { font-size: 20px; line-height: 1.25; font-weight: 600; letter-spacing: -.005em; margin-bottom: 8px; }
.sb p { font-family: var(--prose); font-size: 18px; line-height: 1.6; margin: 0 0 14px; color: var(--sub); max-width: 60ch; text-wrap: pretty; }
.sb[dir="rtl"] p { font-family: var(--urdu); font-size: 17px; }
.sb [dir="ltr"] p { font-family: var(--prose); }
.sb a { color: inherit; text-decoration: none; }
.sb .lnk { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
@media (hover: hover) and (pointer: fine) { .sb .lnk:hover { text-decoration-thickness: 2px; } }
.sb :focus-visible { outline: 2px solid var(--brand); outline-offset: 3px; border-radius: 2px; }
.sb .deep :focus-visible, .sb .deep.hd :focus-visible { outline-color: var(--tape); }
.sb .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.sb .skip { position: absolute; inset-inline-start: 12px; top: -60px; z-index: 100; background: var(--ink); color: var(--paper); padding: 10px 14px; border-radius: 3px; font-weight: 600; }
.sb .skip:focus { top: 8px; }
.sb .wrap { max-width: 1280px; margin: 0 auto; padding-inline: max(clamp(20px, 4vw, 48px), env(safe-area-inset-left, 0px)) max(clamp(20px, 4vw, 48px), env(safe-area-inset-right, 0px)); }

/* Buttons */
.sb .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 3px; font-family: inherit; font-weight: 600; font-size: 15px; line-height: 1.2; border: 1.5px solid transparent; cursor: pointer; transition: background-color .15s var(--ease-out), color .15s var(--ease-out), border-color .15s var(--ease-out), transform .1s var(--ease-out); }
.sb .btn:active { transform: scale(.98); }
.sb .btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.sb .btn-p { background: var(--brand); color: var(--on-brand); }
@media (hover: hover) and (pointer: fine) { .sb .btn-p:hover:not(:disabled) { background: color-mix(in srgb, var(--brand) 82%, var(--ink)); } }
.sb .btn-g { background: transparent; color: var(--ink); border-color: var(--ink); }
@media (hover: hover) and (pointer: fine) { .sb .btn-g:hover { background: var(--ink); color: var(--paper); } }
.sb .btn-t { background: var(--tape); color: var(--on-tape); }
@media (hover: hover) and (pointer: fine) { .sb .btn-t:hover:not(:disabled) { background: color-mix(in srgb, var(--tape) 88%, #fff); } }
.sb .btn-lg { padding: 16px 28px; font-size: 16px; }

/* Header */
.sb .hd { position: sticky; top: 0; z-index: 30; background: var(--paper); border-bottom: 1px solid var(--line); padding-top: env(safe-area-inset-top, 0px); }
.sb .hd .bar { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; height: 68px; }
.sb .hd .bar.min { display: flex; justify-content: space-between; }
.sb .logo { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; font-size: 20px; font-stretch: 112%; letter-spacing: -.02em; justify-self: start; }
.sb .logo svg { display: block; }
.sb .logo .ur { font-family: var(--urdu); font-weight: 400; font-stretch: 100%; color: var(--sub); font-size: 15px; letter-spacing: 0; }
.sb .nav { display: flex; align-items: center; gap: 4px; font-size: 15px; font-weight: 500; }
.sb .nav-i { position: relative; }
.sb .nav-i > a, .sb .nav-b { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border: 0; border-radius: 999px; background: none; color: var(--ink); font: inherit; cursor: pointer; transition: background-color .15s var(--ease-out); }
@media (hover: hover) and (pointer: fine) { .sb .nav-i > a:hover, .sb .nav-b:hover { background: color-mix(in srgb, var(--ink) 7%, transparent); } }
.sb .nav-b[aria-expanded="true"] { background: color-mix(in srgb, var(--ink) 7%, transparent); }
.sb .nav-b svg { width: 12px; height: 12px; transition: transform .15s var(--ease-out); }
.sb .nav-b[aria-expanded="true"] svg { transform: rotate(180deg); }
.sb .dd { position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); width: 360px; padding: 8px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 16px 32px -16px rgba(0,0,0,.28); display: grid; gap: 2px; z-index: 40; }
.sb .dd::before { content: ""; position: absolute; inset-inline: 0; top: -9px; height: 9px; }
.sb .dd a { display: grid; gap: 2px; padding: 12px; border-radius: 4px; transition: background-color .15s var(--ease-out); }
@media (hover: hover) and (pointer: fine) { .sb .dd a:hover { background: var(--paper); } }
.sb .dd b { font-size: 15px; font-weight: 600; }
.sb .dd span { font-size: 14px; line-height: 1.4; color: var(--sub); font-weight: 400; }
.sb .hd .act { display: flex; gap: 8px; align-items: center; justify-self: end; }
.sb .hd .chip { border: 0; border-radius: 999px; padding: 8px 12px; }
@media (hover: hover) and (pointer: fine) { .sb .hd .chip:hover { background: color-mix(in srgb, var(--ink) 7%, transparent); } }
.sb .hd .join { border-radius: 999px; padding: 8px 20px; }
.sb .chip { padding: 8px 12px; border-radius: 3px; border: 1.5px solid var(--line); background: transparent; color: var(--ink); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: border-color .15s var(--ease-out), background-color .15s var(--ease-out); }
@media (hover: hover) and (pointer: fine) { .sb .chip:hover { border-color: var(--ink); } }
.sb .menu-btn { display: none; }
.sb .mnav { display: none; }
.sb .mnav .mg { padding: 16px 0 4px; font-size: 13px; font-weight: 500; color: var(--sub); }
@media (prefers-reduced-motion: no-preference) {
  .sb .dd { animation: sbdd .16s var(--ease-out); }
  @keyframes sbdd { from { opacity: 0; transform: translate(-50%, -4px); } to { opacity: 1; transform: translate(-50%, 0); } }
}

/* Layout: title-block margin + content */
.sb .sec { padding-block: clamp(64px, 9vw, 128px); border-top: 1px solid var(--line); scroll-margin-top: 78px; }
.sb .sec.surface { background: var(--surface); }
.sb .deep { background: var(--deep); color: var(--on-deep); border-top-color: transparent; }
.sb .deep p { color: var(--on-deep-sub); }
.sb .sg { display: grid; grid-template-columns: minmax(140px, 190px) minmax(0, 1fr); column-gap: clamp(24px, 5vw, 72px); }
.sb .note { font-size: 14px; font-weight: 600; color: var(--sub); }
.sb .note span { position: sticky; top: 92px; display: block; max-width: 170px; padding-top: 12px; border-top: 3px solid var(--ink); }
.sb .deep .note, .sb .deep .note span { color: var(--on-deep-sub); border-top-color: var(--on-deep); }
.sb .body { min-width: 0; }
.sb .two { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 5vw, 64px); align-items: start; }
.sb .two > * { min-width: 0; }
.sb .rule-top { border-top: 2px solid var(--ink); }

/* Hero */
.sb .hero { padding-top: clamp(36px, 6vw, 80px); padding-bottom: clamp(56px, 8vw, 104px); }
.sb .kicker { display: inline-flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 600; color: var(--sub); margin-bottom: clamp(16px, 2.4vw, 28px); }
.sb .kicker::before { content: ""; width: 34px; height: 10px; background: var(--tape); border-radius: 1px; flex: none; }
.sb .hero h1 { margin-bottom: clamp(32px, 5vw, 60px); max-width: 17em; }
.sb .hero-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(28px, 5vw, 72px); align-items: start; }
.sb .lead { font-size: 20px; max-width: 36ch; color: var(--ink); }
.sb[dir="rtl"] .lead { font-size: 18px; }
.sb .cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 32px; }
.sb .fine { font-size: 14px; line-height: 1.55; margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--line); max-width: 42ch; }
.sb .journey { list-style: none; margin: clamp(48px, 7vw, 96px) 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 2px solid var(--ink); }
.sb .journey li { position: relative; padding: 18px 16px 0 0; }
.sb .journey li::before { content: ""; position: absolute; inset-inline-start: 0; top: -2px; width: 2px; height: 14px; background: var(--ink); }
.sb .journey li { padding-inline-start: 14px; }
.sb .journey b { display: block; font-size: 17px; font-weight: 650; }
.sb .journey small { display: block; font-size: 14px; color: var(--sub); }

/* Viewfinder (the one memorable element) */
.sb .vf-fig { margin: 0; }
.sb .vf { position: relative; aspect-ratio: 16 / 10; background: #0f1a2b; border-radius: 4px; overflow: hidden; color: #f4f7f3; font-variant-numeric: tabular-nums; box-shadow: 0 0 0 1px var(--line); }
.sb .vf svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.sb .vf .ov { position: absolute; font-family: var(--ui); font-size: clamp(11px, 1.3vw, 13px); font-weight: 600; letter-spacing: .02em; line-height: 1.5; text-shadow: 0 1px 2px rgba(0,0,0,.7); }
.sb .vf .tl { top: 8%; inset-inline-start: 6%; } .sb .vf .tr { top: 8%; inset-inline-end: 6%; text-align: end; }
.sb .vf .bl { bottom: 12%; inset-inline-start: 6%; } .sb .vf .br { bottom: 12%; inset-inline-end: 6%; text-align: end; }
.sb .vf .rec i { display: inline-block; width: .7em; height: .7em; border-radius: 50%; background: #ff4b36; margin-inline-end: .5em; }
.sb .vf .chk { display: block; opacity: .45; transition: opacity .4s var(--ease-out); }
.sb .vf .chk.on { opacity: 1; }
.sb .vf .chk::before { content: ""; display: inline-block; width: .55em; height: .55em; margin-inline-end: .55em; border: 1.5px solid currentColor; vertical-align: .05em; }
.sb .vf .chk.on::before { background: var(--tape); border-color: var(--tape); }
.sb .vf .fp { opacity: 0; transition: opacity .5s var(--ease-out); display: block; color: var(--tape); }
.sb .vf .fp.on { opacity: 1; }
.sb .vf .prog { position: absolute; inset-inline: 6%; bottom: 6%; height: 3px; background: rgba(255,255,255,.22); }
.sb .vf .prog i { display: block; height: 100%; width: 100%; background: #ff4b36; transform-origin: 0 50%; transform: scaleX(calc(var(--p) / 100)); transition: transform 1s linear; }
.sb .vf .s { opacity: 0; transition: opacity .5s var(--ease-out); }
.sb .vf .s.on { opacity: 1; }
.sb .vf .tape { transform-box: fill-box; transform-origin: top; transform: scaleY(0); transition: transform .7s var(--ease-out); }
.sb .vf .tape.on { transform: scaleY(1); }
.sb .vf-cap { font-size: 13px; color: var(--sub); margin-top: 10px; max-width: 60ch; }
@media (prefers-reduced-motion: no-preference) {
  .sb .vf .rec i { animation: sbblink 1.2s steps(2, start) infinite; }
  @keyframes sbblink { to { visibility: hidden; } }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .sb .vf .s, .sb .vf .tape, .sb .vf .chk, .sb .vf .fp, .sb .vf .prog i { transition: none; }
}

/* Deadlines (problem) */
.sb .deadlines { list-style: none; margin: 36px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); border-top: 2px solid var(--ink); }
.sb .deadlines li { padding: 22px 22px 8px 0; border-inline-end: 1px solid var(--line); margin-inline-end: 22px; }
.sb .deadlines li:last-child { border-inline-end: 0; margin-inline-end: 0; }
.sb .fig { display: block; font-family: var(--display); font-weight: 600; font-stretch: 125%; font-size: clamp(48px, 6vw, 84px); line-height: .95; letter-spacing: -.04em; color: var(--brand); font-variant-numeric: tabular-nums; margin-bottom: 14px; }
.sb .deadlines b { display: block; font-size: 17px; font-weight: 650; margin-bottom: 6px; }
.sb .deadlines span.why { display: block; font-size: 15px; color: var(--sub); margin-bottom: 10px; }
.sb .deadlines a { font-size: 13px; color: var(--sub); }

/* Tabs / toggles */
.sb .tabs { display: flex; flex-wrap: wrap; gap: 0; border-bottom: 1px solid var(--line); margin-bottom: 36px; }
.sb .tab { padding: 12px 16px; border: 0; border-bottom: 3px solid transparent; margin-bottom: -1px; background: none; color: var(--sub); font: inherit; font-weight: 600; cursor: pointer; transition: color .15s var(--ease-out), border-color .15s var(--ease-out); }
@media (hover: hover) and (pointer: fine) { .sb .tab:hover { color: var(--ink); } }
.sb .tab[aria-selected="true"], .sb .tab[aria-pressed="true"] { color: var(--ink); border-bottom-color: var(--brand); }
.sb .tabs.tight { margin-bottom: 0; }

/* Lists */
.sb .ticks { list-style: none; padding: 0; margin: 20px 0 0; display: grid; gap: 12px; }
.sb .ticks li { position: relative; padding-inline-start: 32px; color: inherit; font-size: 16px; }
.sb .ticks li::before { content: ""; position: absolute; inset-inline-start: 6px; top: .28em; width: 7px; height: 13px; border: solid var(--brand); border-width: 0 2.5px 2.5px 0; transform: rotate(40deg); }
.sb[dir="rtl"] .ticks li::before { top: .7em; }
.sb .rows { list-style: none; margin: 0; padding: 0; border-top: 2px solid var(--ink); }
.sb .rows li { padding: 16px 0; border-bottom: 1px solid var(--line); font-size: 18px; font-weight: 600; font-family: var(--display); }
.sb .steps { list-style: none; margin: 0; padding: 0; border-top: 2px solid var(--ink); counter-reset: s; }
.sb .steps li { display: grid; grid-template-columns: 64px 1fr; gap: 8px 16px; padding: 24px 0; border-bottom: 1px solid var(--line); }
.sb .steps .n { grid-row: span 2; font-family: var(--display); font-weight: 600; font-stretch: 125%; font-size: 40px; line-height: 1; color: var(--brand); font-variant-numeric: tabular-nums; }
.sb .steps h3 { margin: 0; align-self: end; }
.sb .steps p { margin: 0; font-size: 17px; }

/* Feature rows + visuals */
.sb .feat { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: center; padding-block: clamp(40px, 5vw, 64px); border-top: 1px solid var(--line); }
.sb .feat:first-of-type { border-top: 2px solid var(--ink); padding-top: 40px; }
.sb .art { background: var(--surface); border: 1px solid var(--line); border-radius: 3px; padding: 24px; font-size: 14px; }
.sb .strip { position: relative; height: 34px; background: color-mix(in srgb, var(--brand) 14%, var(--surface)); border: 1px solid var(--brand); border-radius: 2px; }
.sb .strip .mk { position: absolute; top: -1px; bottom: -1px; width: 2px; background: var(--brand); }
.sb .strip-l { display: flex; flex-wrap: wrap; gap: 4px 14px; justify-content: space-between; margin-top: 8px; font-weight: 600; font-variant-numeric: tabular-nums; font-size: 13px; }
.sb .strip-l span { color: var(--sub); }
.sb .msg { max-width: 300px; background: color-mix(in srgb, var(--brand) 12%, var(--surface)); border: 1px solid color-mix(in srgb, var(--brand) 35%, var(--line)); padding: 12px 16px; border-radius: 3px 14px 14px 14px; font-size: 15px; line-height: 1.45; }
.sb .msg + .msg { margin-top: 12px; }
.sb .msg small { display: block; margin-top: 6px; color: var(--sub); font-size: 12px; }
.sb .sheet { background: var(--surface); }
.sb .sheet h4 { margin: 0 0 12px; font-size: 15px; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid var(--ink); display: flex; justify-content: space-between; gap: 12px; }
.sb .sheet ul { list-style: none; margin: 0; padding: 0; }
.sb .sheet li { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px dashed var(--line); font-size: 14px; }
.sb .sheet li b { color: var(--brand); font-variant-numeric: tabular-nums; }

/* Checklist paper */
.sb .paper { background: var(--surface); border: 1px solid var(--line); border-top: 4px solid var(--tape); padding: 24px; border-radius: 0 0 3px 3px; }
.sb .paper .hd2 { font-size: 14px; font-weight: 600; color: var(--sub); margin-bottom: 14px; }
.sb .paper ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; }
.sb .paper li { display: flex; gap: 10px; align-items: flex-start; font-size: 15px; }
.sb .paper li i { flex: none; width: 20px; height: 20px; border: 2px solid var(--brand); border-radius: 2px; position: relative; margin-top: 1px; }
.sb .paper li i::after { content: ""; position: absolute; left: 5px; top: 1px; width: 5px; height: 10px; border: solid var(--brand); border-width: 0 2.5px 2.5px 0; transform: rotate(40deg); }

/* Tables */
.sb .tscroll { overflow-x: auto; }
.sb table { width: 100%; border-collapse: collapse; font-size: 15px; min-width: 620px; }
.sb th, .sb td { padding: 16px 16px 16px 0; border-bottom: 1px solid var(--line); text-align: start; vertical-align: middle; }
.sb th { font-size: 13px; color: var(--sub); font-weight: 600; border-bottom: 2px solid var(--ink); padding-block: 12px; }
.sb .bar-t { display: block; width: 100%; max-width: 220px; height: 8px; background: var(--line); border-radius: 1px; margin-top: 8px; }
.sb .bar-t i { display: block; height: 100%; background: var(--brand); border-radius: 1px; }
.sb .cmp th, .sb .cmp td { padding-inline: 16px; }
.sb .cmp th:first-child, .sb .cmp td:first-child { padding-inline-start: 0; }
.sb .cmp .me { background: color-mix(in srgb, var(--brand) 9%, transparent); color: var(--brand); font-weight: 600; }
.sb .cmp th.me { background: var(--brand); color: var(--on-brand); border-bottom-color: var(--brand); }

/* Calculator */
.sb label.f { display: grid; gap: 8px; font-size: 15px; font-weight: 600; }
.sb .fl { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
.sb .fl b { font-family: var(--display); font-weight: 600; font-size: 20px; font-stretch: 112%; font-variant-numeric: tabular-nums; flex: none; }
.sb input[type=range] { width: 100%; -webkit-appearance: none; appearance: none; height: 28px; background: transparent; cursor: pointer; margin: 0; }
.sb input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 1px; background: linear-gradient(90deg, var(--brand) 0 var(--fill, 50%), var(--line) var(--fill, 50%)); }
.sb input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; margin-top: -9px; border-radius: 50%; background: var(--brand); border: 3px solid var(--surface); box-shadow: 0 0 0 1.5px var(--brand); transition: box-shadow .15s var(--ease-out); }
@media (hover: hover) and (pointer: fine) { .sb input[type=range]:hover::-webkit-slider-thumb { box-shadow: 0 0 0 1.5px var(--brand), 0 0 0 7px color-mix(in srgb, var(--brand) 18%, transparent); } }
.sb input[type=range]::-moz-range-track { height: 4px; border-radius: 1px; background: var(--line); }
.sb input[type=range]::-moz-range-progress { height: 4px; border-radius: 1px; background: var(--brand); }
.sb input[type=range]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: var(--brand); border: 3px solid var(--surface); box-shadow: 0 0 0 1.5px var(--brand); }
.sb .receipt { background: var(--surface); border: 1px solid var(--line); border-top: 4px solid var(--ink); padding: 28px; }
.sb .receipt dl { margin: 0; display: grid; gap: 0; }
.sb .receipt .r { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 16px 0; border-bottom: 1px dashed var(--line); }
.sb .receipt dt { font-size: 15px; color: var(--sub); }
.sb .receipt dd { white-space: nowrap; margin: 0; font-family: var(--display); font-weight: 600; font-stretch: 112%; font-size: clamp(22px, 2.6vw, 30px); letter-spacing: -.02em; font-variant-numeric: tabular-nums; text-align: end; }
.sb .receipt .hi dd { background: var(--tape); color: var(--on-tape); padding: 2px 10px; border-radius: 2px; }
.sb .receipt .warn dd { color: var(--alarm); }
.sb .receipt .verdict { padding-top: 20px; font-size: 15px; }
.sb .receipt .verdict b { font-weight: 600; }
.sb .receipt p.fine2 { font-family: var(--ui); font-size: 12px; line-height: 1.5; margin: 16px 0 0; }

/* Clip proof definitions */
.sb .defs { display: grid; grid-template-columns: 1fr 1fr; gap: 0 clamp(24px, 4vw, 48px); margin: 32px 0 0; }
.sb .defs > div { border-top: 2px solid var(--ink); padding: 16px 0 24px; }
.sb .defs dt { font-family: var(--display); font-weight: 600; font-size: 20px; margin-bottom: 8px; }
.sb .defs dd { margin: 0; color: var(--sub); font-family: var(--prose); font-size: 16px; line-height: 1.55; }

/* Pricing */
.sb .phead { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 20px; }
.sb .plans { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 40px; border-top: 2px solid var(--ink); }
.sb .plan { position: relative; padding: 32px 28px; border-inline-end: 1px solid var(--line); display: flex; flex-direction: column; }
.sb .plan:last-child { border-inline-end: 0; }
.sb .plan.hot { background: var(--deep); color: var(--on-deep); border-inline-end-color: transparent; margin-top: -2px; padding-top: 34px; }
.sb .plan .price { font-family: var(--display); font-weight: 600; font-stretch: 112%; font-size: clamp(30px, 3.1vw, 42px); letter-spacing: -.03em; line-height: 1.05; font-variant-numeric: tabular-nums; }
.sb .plan .price small { white-space: nowrap; font-size: 15px; font-weight: 500; font-stretch: 100%; letter-spacing: 0; color: var(--sub); }
.sb .plan .qty { color: var(--sub); min-height: 24px; margin: 4px 0 0; font-size: 15px; }
.sb .plan.hot .price small, .sb .plan.hot .qty { color: var(--on-deep-sub); }
.sb .plan .ticks { flex: 1; align-content: start; margin-bottom: 24px; }
.sb .plan.hot .ticks li::before { border-color: var(--tape); }
.sb .plan .btn { width: 100%; }
.sb .plan.hot .btn-t { margin-top: 0; }
.sb .flag { position: absolute; top: 0; inset-inline-start: 28px; transform: translateY(-100%); background: var(--tape); color: var(--on-tape); font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 2px 2px 0 0; }

/* FAQ */
.sb .faq { margin-top: 28px; border-top: 2px solid var(--ink); }
.sb .faq h3 { margin: 0; font-size: inherit; }
.sb .faq-q { width: 100%; text-align: start; background: none; border: 0; padding: 24px 0; font: inherit; font-size: 18px; font-weight: 600; color: var(--ink); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 20px; border-bottom: 1px solid var(--line); }
@media (hover: hover) and (pointer: fine) { .sb .faq-q:hover { color: var(--brand); } }
.sb .faq-q .pm { position: relative; width: 16px; height: 16px; flex: none; }
.sb .faq-q .pm::before, .sb .faq-q .pm::after { content: ""; position: absolute; background: currentColor; transition: transform .25s var(--ease-out); }
.sb .faq-q .pm::before { left: 0; right: 0; top: 7px; height: 2px; }
.sb .faq-q .pm::after { top: 0; bottom: 0; left: 7px; width: 2px; }
.sb .faq-q[aria-expanded="true"] .pm::after { transform: scaleY(0); }
.sb .ans { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .28s var(--ease-out); }
.sb .ans.open { grid-template-rows: 1fr; }
.sb .ans > div { overflow: hidden; visibility: hidden; transition: visibility 0s .28s; }
.sb .ans.open > div { visibility: visible; transition-delay: 0s; }
.sb .ans p { padding: 16px 0 8px; margin: 0; max-width: 64ch; }

/* Form + final */
.sb .final h2 { font-size: clamp(32px, 4.6vw, 64px); font-stretch: 112%; max-width: 12em; }
.sb .final .lede { font-size: 20px; max-width: 34ch; }
.sb .form { background: var(--paper); color: var(--ink); border-radius: 3px; padding: clamp(24px, 3vw, 32px); display: grid; gap: 16px; }
.sb .form h3 { margin: 0; }
.sb .form p { color: var(--sub); }
.sb .field { display: block; width: 100%; padding: 12px 16px; border-radius: 3px; border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); font: inherit; font-size: 16px; font-weight: 400; }
.sb .field:focus { border-color: var(--brand); outline: 2px solid var(--brand); outline-offset: 1px; }
.sb .consent { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; line-height: 1.5; font-weight: 400; }
.sb .consent input { margin-top: 3px; width: 16px; height: 16px; accent-color: var(--brand); flex: none; }
.sb .err { border-inline-start: 4px solid var(--alarm); background: color-mix(in srgb, var(--alarm) 9%, var(--paper)); padding: 12px 16px; font-size: 14px; }
.sb .err b { display: block; color: var(--alarm); }

/* Cookie */
.sb .cookie { position: fixed; bottom: 16px; inset-inline: 16px; margin-inline-start: auto; max-width: 360px; z-index: 50; background: var(--surface); border: 1px solid var(--ink); border-radius: 3px; padding: 16px; font-size: 14px; display: grid; gap: 12px; box-shadow: 0 12px 32px -8px rgba(0,0,0,.28); }
.sb .cookie b { font-size: 16px; }
.sb .cookie p { font-family: var(--ui); font-size: 14px; line-height: 1.5; margin: 4px 0 0; color: var(--sub); }
.sb .cookie .btns { display: flex; gap: 8px; }
.sb .cookie .btn { flex: 1; padding: 12px 16px; font-size: 14px; }

/* Footer */
.sb footer.deep { border-top: 1px solid var(--deep-line); }
.sb .ft { padding-block: clamp(56px, 8vw, 104px) 24px; display: grid; gap: clamp(40px, 6vw, 72px); color: var(--on-deep-sub); }
.sb .ft-top { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 40px; align-items: start; }
.sb .ft h2 { font-size: clamp(36px, 5.4vw, 76px); line-height: 1.02; font-weight: 500; font-stretch: 100%; letter-spacing: -.03em; color: var(--on-deep); max-width: 9em; margin: 0 0 32px; }
.sb .ft-cta { display: flex; flex-wrap: wrap; gap: 12px; }
.sb .pill { display: inline-flex; align-items: center; gap: 12px; padding: 12px 24px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--on-deep) 35%, transparent); color: var(--on-deep); font-size: 15px; font-weight: 500; line-height: 1.2; transition: background-color .15s var(--ease-out), color .15s var(--ease-out), border-color .15s var(--ease-out); }
.sb .pill svg { width: 16px; height: 16px; flex: none; }
@media (hover: hover) and (pointer: fine) { .sb .pill:hover { background: var(--on-deep); color: var(--deep); border-color: var(--on-deep); } }
.sb .ft-nav { display: grid; gap: 24px; justify-items: start; min-width: 200px; }
.sb .ft-links, .sb .ft-src { list-style: none; margin: 0; padding: 0; display: grid; }
.sb .ft-links { gap: 4px; font-size: clamp(20px, 2vw, 28px); line-height: 1.25; color: var(--on-deep); }
.sb .ft-src { gap: 8px; font-size: 14px; }
.sb .ft-h { margin: 0 0 12px; font-family: var(--ui); font-size: 14px; line-height: 1.4; color: var(--on-deep); max-width: none; }
@media (hover: hover) and (pointer: fine) { .sb .ft a:hover { color: var(--on-deep); text-decoration: underline; text-underline-offset: 4px; } }
.sb .ft-mark { display: block; width: 100%; height: auto; color: var(--on-deep); }
.sb .ft-disc { font-family: var(--ui); font-size: 14px; line-height: 1.5; margin: 0; max-width: 72ch; color: var(--on-deep-sub); }
.sb .ft-bot { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; font-size: 14px; }
.sb .ft-bot > :nth-child(2) { justify-self: center; }
.sb .ft-bot > :last-child { justify-self: end; }
.sb .ft-badge { display: inline-flex; background: #fff; padding: 4px 8px; border-radius: 4px; }
.sb .ft-badge img { display: block; width: 160px; height: auto; }
.sb .ft-lang { padding: 4px 12px; border: 0; border-radius: 4px; background: var(--on-deep); color: var(--deep); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; }

/* Sticky mobile CTA */
.sb .sticky-cta { display: none; }

/* Legal */
.sb .legal { max-width: 680px; margin: 0 auto; padding: clamp(32px, 6vw, 72px) clamp(20px, 4vw, 32px) 96px; color: var(--ink); }
.sb .legal h1 { font-size: clamp(32px, 5vw, 48px); margin: 18px 0 8px; }
.sb .legal h2 { font-size: 20px; margin: 32px 0 8px; font-stretch: 100%; }
.sb .legal p { max-width: none; font-size: 17px; }
.sb .legal .meta { font-family: var(--ui); font-size: 13px; }
.sb .legal .disc { margin-top: 36px; padding-top: 14px; border-top: 1px solid var(--line); font-family: var(--ui); font-size: 13px; }
.sb .legal .lnk { color: var(--brand); font-weight: 600; font-size: 15px; }

@media (max-width: 1000px) {
  .sb .hero-grid { grid-template-columns: 1fr; }
  .sb .lead { max-width: 46ch; }
}
@media (max-width: 880px) {
  .sb .sg { grid-template-columns: 1fr; }
  .sb .note span { position: static; display: inline-block; margin-bottom: 22px; padding-inline-end: 28px; }
  .sb .two, .sb .feat { grid-template-columns: 1fr; }
  .sb .nav, .sb .hd .join { display: none; }
  .sb .menu-btn { display: inline-flex; }
  .sb .mnav.open { display: grid; border-top: 1px solid var(--line); padding: 8px 0 16px; }
  .sb .mnav a { padding: 12px 0; font-weight: 600; border-bottom: 1px solid var(--line); }
  .sb .plans { grid-template-columns: 1fr; }
  .sb .plan { border-inline-end: 0; border-bottom: 1px solid var(--line); }
  .sb .plan.hot { margin-top: 24px; border-bottom: 0; }
  .sb .journey { grid-template-columns: repeat(2, 1fr); row-gap: 22px; }
  .sb .journey li:nth-child(n+3) { border-top: 1px solid var(--line); margin-top: 0; padding-top: 18px; }
  .sb .sticky-cta { display: flex; position: fixed; z-index: 20; left: 0; right: 0; bottom: 0; gap: 12px; padding: 12px max(16px, env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px)); background: var(--paper); border-top: 1px solid var(--ink); }
  .sb .sticky-cta .btn { flex: 1; padding: 12px 16px; }
  .sb .hd .bar { grid-template-columns: 1fr auto; }
  .sb .ft { padding-bottom: 96px; }
  .sb .ft-top { grid-template-columns: 1fr; }
  .sb .ft-cta { flex-direction: column; align-items: flex-start; }
  .sb .ft-nav { justify-self: end; }
  .sb .ft-bot { grid-template-columns: 1fr; justify-items: center; text-align: center; gap: 16px; }
  .sb .ft-bot > :nth-child(2), .sb .ft-bot > :last-child { justify-self: center; }
  .sb .cookie { bottom: calc(76px + env(safe-area-inset-bottom, 0px)); }
}
@media (max-width: 560px) {
  .sb .paper ul, .sb .defs { grid-template-columns: 1fr; }
  .sb .deadlines li { border-inline-end: 0; margin-inline-end: 0; border-bottom: 1px solid var(--line); padding-bottom: 22px; }
  .sb .steps li { grid-template-columns: 48px 1fr; }
  .sb .steps .n { font-size: 30px; }
  .sb .vf .ov { font-size: 11px; }
}

/* Added: headline mask, taped clip frame, press and touch behaviour */
:root { --ease-out: cubic-bezier(0.23, 1, 0.32, 1); }
html { -webkit-tap-highlight-color: transparent; -webkit-text-size-adjust: 100%; }
.sb a, .sb button, .sb [role="button"] { touch-action: manipulation; }
.sb .btn, .sb .chip, .sb .tab, .sb .faq-q { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
.sb .btn { transition: background-color .15s var(--ease-out), color .15s var(--ease-out), border-color .15s var(--ease-out), transform .12s var(--ease-out); }
.sb input, .sb select, .sb textarea { font-size: 16px; }
.sb .w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .14em; margin-bottom: -.14em; }
.sb .wi { display: inline-block; }
.sb .sec h2 { max-width: 22ch; }
.sb .hero { padding-top: clamp(40px, 7vw, 96px); }
.sb .hero h1 { margin-bottom: clamp(28px, 4vw, 52px); }
.sb .vf-fig { position: relative; }
.sb .vf-fig::before, .sb .vf-fig::after { content: ""; position: absolute; top: -11px; width: 84px; height: 24px; background: color-mix(in srgb, var(--tape) 90%, transparent); box-shadow: 0 2px 4px rgba(0,0,0,.18); z-index: 2; pointer-events: none; }
.sb .vf-fig::before { inset-inline-start: -18px; transform: rotate(-36deg); }
.sb .vf-fig::after { inset-inline-end: -18px; transform: rotate(36deg); }
.sb .bar-t { height: 10px; }
.sb .cookie { background: var(--surface); }
@media (prefers-reduced-motion: no-preference) {
  .sb .cookie { animation: sbcookie .35s var(--ease-out) .4s both; }
  @keyframes sbcookie { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
}
@media (max-width: 880px) { .sb .vf-fig::before, .sb .vf-fig::after { width: 64px; } }

/* Polish pass: 4px rhythm, logical (RTL-safe) padding, Urdu line boxes, touch targets, form details */
.sb .hd .bar { height: 64px; }
.sb .sec h2 { margin-bottom: 20px; }
.sb .journey li { padding-block: 16px 0; padding-inline: 16px 16px; }
.sb .journey b { font-weight: 600; }
.sb .deadlines li { padding-block: 24px 8px; padding-inline: 0 24px; margin-inline-end: 24px; }
.sb .deadlines li:last-child { padding-inline-end: 0; margin-inline-end: 0; }
.sb th, .sb td { padding-block: 16px; padding-inline: 0 16px; }
.sb th { padding-block: 12px; }
.sb .cmp th, .sb .cmp td { padding-inline: 16px; }
.sb .cmp th:first-child, .sb .cmp td:first-child { padding-inline-start: 0; }
.sb .consent { gap: 12px; }
.sb .legal .disc { padding-top: 16px; }
.sb .legal h1 { margin: 16px 0 8px; }

/* Hero moment: the clip reads as a real object on the bench */
.sb .vf { box-shadow: 0 0 0 1px var(--line), 0 28px 48px -28px rgba(16, 28, 46, .5); }
.sb .vf .chk { opacity: .6; }
.sb .vf-fig::before, .sb .vf-fig::after { top: -12px; width: 80px; }

/* Small text that was under 13px */
.sb .msg small, .sb .receipt p.fine2, .sb .flag { font-size: 13px; }

/* Touch targets */
.sb .btn { min-height: 48px; }
.sb .chip { min-height: 40px; }
.sb .faq-q { min-height: 64px; }
.sb .consent input { width: 20px; height: 20px; margin-top: 2px; }

/* Form */
.sb .field { min-height: 48px; }
.sb .field::placeholder { color: color-mix(in srgb, var(--sub) 70%, transparent); }
.sb .field:user-invalid { border-color: var(--alarm); }
.sb select.field { -webkit-appearance: none; appearance: none; padding-inline-end: 44px; background-image: linear-gradient(45deg, transparent 50%, var(--sub) 50%), linear-gradient(135deg, var(--sub) 50%, transparent 50%); background-position: calc(100% - 22px) 50%, calc(100% - 16px) 50%; background-size: 6px 6px; background-repeat: no-repeat; }

/* Calculator slider: same track in every browser */
.sb input[type=range]::-webkit-slider-runnable-track { height: 6px; }
.sb input[type=range]::-webkit-slider-thumb { margin-top: -8px; }
.sb input[type=range]::-moz-range-track, .sb input[type=range]::-moz-range-progress { height: 6px; }

/* Urdu (Nastaliq) needs taller line boxes than Latin, and no tracking */
.sb[dir="rtl"] * { letter-spacing: 0; }
.sb[dir="rtl"] h1 { line-height: 1.6; }
.sb[dir="rtl"] h2 { line-height: 1.7; }
.sb[dir="rtl"] h3 { line-height: 1.8; }
.sb[dir="rtl"] p, .sb[dir="rtl"] .lead { line-height: 2; }
.sb[dir="rtl"] .btn, .sb[dir="rtl"] .pill, .sb[dir="rtl"] .chip, .sb[dir="rtl"] .tab, .sb[dir="rtl"] .flag, .sb[dir="rtl"] .kicker, .sb[dir="rtl"] .nav-i > a, .sb[dir="rtl"] .nav-b, .sb[dir="rtl"] .journey b, .sb[dir="rtl"] .deadlines b { line-height: 1.8; }
.sb[dir="rtl"] .btn { padding-block: 8px; }
.sb[dir="rtl"] .faq-q { line-height: 1.9; }
.sb[dir="rtl"] .kicker::before { align-self: center; }
/* English blocks inside the Urdu page keep Latin metrics */
.sb [dir="ltr"] .btn, .sb [dir="ltr"] .pill, .sb [dir="ltr"] .faq-q { line-height: 1.2; }
.sb [dir="ltr"] .btn { padding-block: 12px; }
.sb [dir="ltr"] .btn-lg { padding-block: 16px; }
.sb [dir="ltr"] .faq-q { line-height: 1.4; }

@media (max-width: 880px) {
  .sb .hd .bar { height: 60px; }
  .sb .journey { row-gap: 24px; }
  .sb .journey li:nth-child(n+3) { padding-top: 16px; }
  .sb .vf-fig::before { inset-inline-start: -8px; }
  .sb .vf-fig::after { inset-inline-end: -8px; }
}
@media (max-width: 560px) {
  .sb .cta-row .btn { flex: 1 1 100%; }
  .sb .plan { padding: 28px 20px; }
  .sb .plan.hot { padding-top: 32px; }
  .sb .receipt { padding: 20px; }
  .sb .deadlines li { padding-inline-end: 0; margin-inline-end: 0; }
}

`;

/* ------------------------------------------------------------------ */
/*  Content (unchanged from the original build)                        */
/* ------------------------------------------------------------------ */
const T = {
  en: {
    nav: ["How it works", "Features", "Calculator", "Pricing", "FAQ"],
    start: "Join early access",
    eyebrow: "For Pakistani online sellers",
    h1: "Stop paying for returns that weren't your fault",
    lead: "The customer says it was defective. The box comes back empty, swapped or missing parts. ParcelSaboot records every parcel you pack and every return you open, then hands you the proof to win the claim.",
    cta1: "Join early access",
    cta2: "Work out your losses",
    works: "Tracks published claim rules for Daraz, TCS, Leopards and PostEx. No official partnership with any of them.",
    probEyebrow: "The problem",
    probH: "If you can't show how the parcel left you, the loss is yours",
    probP: "Marketplaces and couriers put the burden of proof on you. Without a packing video and a complete claim filed on time, the loss is yours.",
    howH: "From packing table to claim decision",
    finalH: "Get your first packing station set up",
    finalP: "ParcelSaboot is in development. Join early access and we will set up your first packing station with you when the pilot opens.",
    cookie: {
      title: "Cookies and analytics",
      desc: "We use Google Analytics to improve our site.",
      accept: "Accept",
      decline: "Decline",
      privacy: "Privacy Policy",
    },
  },
  ur: {
    nav: ["طریقہ کار", "خصوصیات", "حساب", "قیمت", "سوالات"],
    start: "شامل ہوں",
    eyebrow: "پاکستانی آن لائن سیلرز کے لیے",
    h1: "جن ریٹرنز میں آپ کی غلطی نہیں، ان کا نقصان اب نہیں",
    lead: "کسٹمر کہتا ہے چیز خراب تھی۔ پارسل خالی، بدلا ہوا یا ادھورا واپس آتا ہے۔ پرسل سبوت ہر پیکنگ اور ہر ریٹرن کی ویڈیو بناتا ہے اور کلیم جیتنے کے لیے پورا ثبوت تیار کر دیتا ہے۔",
    cta1: "ابتدائی رسائی کے لیے شامل ہوں",
    cta2: "اپنا نقصان معلوم کریں",
    works: "دراز، ٹی سی ایس، لیپرڈز اور پوسٹ ایکس کے شائع شدہ کلیم قواعد۔ کسی کمپنی سے سرکاری شراکت نہیں۔",
    probEyebrow: "مسئلہ",
    probH: "ویڈیو نہیں تو کلیم نہیں۔ وقت کم، دوسرا موقع نہیں",
    probP: "مارکیٹ پلیس اور کوریئر ثبوت کی ذمہ داری آپ پر ڈالتے ہیں۔ پیکنگ ویڈیو اور وقت پر مکمل کلیم کے بغیر نقصان آپ کا ہے۔",
    howH: "پیکنگ ٹیبل سے رقم کی واپسی تک چار قدم",
    finalH: "آپ کا اگلا خراب ریٹرن راستے میں ہے",
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
const ruleHours = { Daraz: 48, TCS: 168, Leopards: 336, PostEx: 720 };

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

const plans = [
  ["Free", 0, "10 parcels a month", ["Packing and return videos", "Claim tracker", "Evidence PDF", "30-day storage"], false],
  ["Standard", 1999, "300 parcels a month", ["Everything in Free", "WhatsApp deadline alerts", "Item checklists per product", "Dashboard", "3 packer logins", "180-day storage"], true],
  ["Growth", 4999, "800 parcels a month", ["Everything in Standard", "10 packer logins and stations", "Order import by CSV", "1-year storage", "Priority WhatsApp support"], false],
];

const compareRows = [
  ["Find a clip by order number", "No", "No", "Instantly"],
  ["Shows the exact parcel and items", "Sometimes", "Rarely", "Yes, with checklist"],
  ["Proves the clip was not edited", "No", "No", "Fingerprint + timestamp"],
  ["Tracks claim deadlines", "No", "No", "With WhatsApp alerts"],
  ["Ready-to-send evidence file", "No", "No", "One click"],
  ["Works offline during load-shedding", "Yes", "Needs backup power", "Yes"],
];

const rs = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");
const pad = (n) => String(n).padStart(2, "0");
const prefersReduced = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */
function AnimNum({ value, format = (n) => String(Math.round(n)) }) {
  const ref = useRef(null);
  const first = useRef(value);
  const last = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) { el.textContent = format(value); last.current = value; return; }
    const o = { v: last.current };
    const tw = gsap.to(o, { v: value, duration: 0.4, ease: "power3.out", onUpdate: () => { last.current = o.v; el.textContent = format(o.v); } });
    return () => tw.kill();
  }, [value]);
  return <span ref={ref}>{format(first.current)}</span>;
}

/* "Set up with a phone and a stand": the stand goes up, the parcel slides in, the scanner reads the label, tape seals it.
   Loops only while on screen. Static (everything visible) under reduced motion. */
function SetupScene() {
  const ref = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".su-table", { svgOrigin: "20 157" });
      gsap.set(".su-pole", { svgOrigin: "63 150" });
      gsap.set(".su-arm", { svgOrigin: "60 33" });
      gsap.set(".su-tape", { svgOrigin: "174 112" });
      gsap.set(".su-ring", { svgOrigin: "280 139" });
      /* 1. the station builds itself once */
      const build = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } })
        .from(".su-table", { scaleX: 0, duration: 0.6, ease: "expo.out" })
        .from(".su-pole", { scaleY: 0, duration: 0.45 }, 0.1)
        .from(".su-arm", { scaleX: 0, duration: 0.4 }, 0.4)
        .from(".su-phone", { y: -18, autoAlpha: 0, duration: 0.5, ease: "power3.out" }, 0.65)
        .from(".su-scanner", { y: 10, autoAlpha: 0, duration: 0.4 }, 0.8)
        .from(".su-txt", { autoAlpha: 0, duration: 0.5, stagger: 0.1 }, 1.1)
        .add(() => { if (st.isActive) cycle.play(); }, 1.3);
      /* 2. then only the packing cycle repeats: parcel in, label read, sealed, parcel out */
      const cycle = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.7, defaults: { ease: "power3.out" } })
        .fromTo(".su-parcel", { x: 160, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8 })
        .fromTo(".su-cone", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "-=0.3")
        .set(".su-scan", { autoAlpha: 1 })
        .fromTo(".su-scan", { y: 0 }, { y: 11, duration: 0.5, ease: "sine.inOut", repeat: 1, yoyo: true })
        .to(".su-scan", { autoAlpha: 0, duration: 0.1 })
        .fromTo(".su-ring", { scale: 1, autoAlpha: 0.7 }, { scale: 3, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, "<")
        .fromTo(".su-scanner", { y: 0 }, { y: -3, duration: 0.1, repeat: 1, yoyo: true }, "<")
        .fromTo(".su-ok", { strokeDashoffset: 30, autoAlpha: 1 }, { strokeDashoffset: 0, duration: 0.35 })
        .fromTo(".su-tape", { scaleY: 0 }, { scaleY: 1, duration: 0.4 }, "+=0.15")
        .to({}, { duration: 1.4 })
        .to(".su-parcel", { x: -170, autoAlpha: 0, duration: 0.5, ease: "power2.in" })
        .to([".su-ok", ".su-cone"], { autoAlpha: 0, duration: 0.2 }, "<");
      const blink = gsap.to(".su-rec", { autoAlpha: 0.15, duration: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true });
      const st = ScrollTrigger.create({
        trigger: ref.current, start: "top 85%", end: "bottom 10%",
        onToggle: (self) => {
          if (self.isActive) { build.play(); if (build.progress() === 1) cycle.play(); blink.play(); }
          else { build.pause(); cycle.pause(); blink.pause(); }
        },
      });
    });
    return () => mm.revert();
  }, { scope: ref });
  return (
    <svg ref={ref} viewBox="0 0 360 200" role="img" aria-label="A phone on a stand records a parcel sliding onto the packing table. A scanner reads the label and tape seals the box." style={{ width: "100%", height: "auto", display: "block" }}>
      <rect className="su-table" x="20" y="150" width="320" height="14" rx="2" fill="color-mix(in srgb, var(--tape) 35%, var(--surface))" stroke="var(--line)" />
      <rect className="su-pole" x="60" y="30" width="6" height="120" fill="var(--sub)" />
      <rect className="su-arm" x="60" y="30" width="110" height="6" fill="var(--sub)" />
      <g className="su-cone"><path d="M168 50 L120 140 L230 140 Z" fill="var(--brand)" opacity=".12" /></g>
      <g className="su-phone"><rect x="140" y="20" width="56" height="28" rx="4" fill="var(--ink)" /><circle className="su-rec" cx="168" cy="44" r="4" fill="var(--alarm)" /></g>
      <path className="su-ok" d="M206 34 l7 8 15 -17" fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" />
      <g className="su-parcel">
        <rect x="130" y="112" width="90" height="38" rx="2" fill="#c9a978" />
        <rect x="146" y="120" width="44" height="14" rx="1" fill="#fbfaf6" />
        <rect className="su-scan" x="146" y="120" width="44" height="2" fill="var(--alarm)" opacity="0" />
        <rect className="su-tape" x="170" y="112" width="8" height="38" fill="var(--tape)" />
      </g>
      <circle className="su-ring" cx="280" cy="139" r="8" fill="none" stroke="var(--brand)" strokeWidth="2" opacity="0" />
      <g className="su-scanner"><rect x="260" y="128" width="40" height="22" rx="4" fill="var(--sub)" /></g>
      <text className="su-txt" x="168" y="14" textAnchor="middle" fontSize="11" fill="var(--sub)" fontFamily="Archivo, sans-serif">phone or webcam</text>
      <text className="su-txt" x="280" y="182" textAnchor="middle" fontSize="11" fill="var(--sub)" fontFamily="Archivo, sans-serif">scanner</text>
      <text className="su-txt" x="175" y="182" textAnchor="middle" fontSize="11" fill="var(--sub)" fontFamily="Archivo, sans-serif">parcel</text>
    </svg>
  );
}

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="3" fill="var(--brand)" />
      <path d="M7 12V7h5M25 12V7h-5M7 20v5h5M25 20v5h-5" fill="none" stroke="var(--on-brand)" strokeWidth="2" />
      <circle cx="16" cy="16" r="3.4" fill="var(--tape)" />
    </svg>
  );
}

const NAV = {
  en: {
    how: "How it works", product: "Product", sellers: "Sellers", pricing: "Pricing", faq: "FAQ", menu: "Menu", close: "Close",
    productItems: [
      ["Continuous recording", "One uncut clip for every parcel", "#features"],
      ["Claim deadlines", "WhatsApp alerts before a window closes", "#features"],
      ["Evidence file", "One bundle to attach to the claim", "#features"],
      ["Loss calculator", "What bad returns cost you each month", "#calculator"],
    ],
    sellerItems: [
      ["daraz", "Daraz sellers", "Packing proof tied to the order number"],
      ["social", "Instagram / WhatsApp", "Settle a customer dispute with the clip"],
      ["brand", "Your own website", "An evidence file behind every refund"],
    ],
  },
  ur: {
    how: "طریقہ کار", product: "خصوصیات", sellers: "سیلرز", pricing: "قیمت", faq: "سوالات", menu: "مینو", close: "بند کریں",
    productItems: [
      ["مسلسل ریکارڈنگ", "ہر پارسل کی ایک بغیر کٹ کلپ", "#features"],
      ["کلیم کی ڈیڈ لائن", "ونڈو بند ہونے سے پہلے واٹس ایپ الرٹ", "#features"],
      ["ثبوت کی فائل", "کلیم کے ساتھ لگانے کے لیے ایک بنڈل", "#features"],
      ["نقصان کا حساب", "خراب ریٹرنز ہر ماہ کتنا نقصان کرتے ہیں", "#calculator"],
    ],
    sellerItems: [
      ["daraz", "دراز سیلرز", "آرڈر نمبر سے جڑا پیکنگ ثبوت"],
      ["social", "انسٹاگرام / واٹس ایپ", "کلپ بھیج کر کسٹمر کا تنازع نمٹائیں"],
      ["brand", "آپ کی اپنی ویب سائٹ", "ہر ریفنڈ کے پیچھے ثبوت کی فائل"],
    ],
  },
};

function Chevron() {
  return <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Arrow() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Header({ t, rtl, setLang, setAud, minimal, menu, setMenu }) {
  const N = NAV[rtl ? "ur" : "en"];
  const [dd, setDd] = useState(null);
  const navRef = useRef(null);
  useEffect(() => {
    if (!dd) return;
    const onDown = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setDd(null); };
    const onKey = (e) => { if (e.key === "Escape") setDd(null); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [dd]);
  const pickSeller = (k) => { setAud(k); setDd(null); setMenu(false); };
  const group = (key, label, panel) => (
    <div className="nav-i" onMouseEnter={() => setDd(key)} onMouseLeave={() => setDd(null)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDd(null); }}>
      <button type="button" className="nav-b" aria-expanded={dd === key} aria-haspopup="true" onClick={() => setDd(dd === key ? null : key)}>{label}<Chevron /></button>
      {dd === key && <div className="dd">{panel}</div>}
    </div>
  );
  return (
    <header className="hd">
      <div className="wrap">
        <div className={`bar ${minimal ? "min" : ""}`}>
          <a href={minimal ? "/" : "#top"} className="logo" aria-label="Saboot home">
            <LogoMark />
            <span>Saboot</span>
            <span className="ur" aria-hidden="true">ثبوت</span>
          </a>
          {!minimal && (
            <nav className="nav" aria-label="Main" ref={navRef}>
              <div className="nav-i"><a href="#how">{N.how}</a></div>
              {group("product", N.product, N.productItems.map(([h, d, href]) => <a key={h} href={href} onClick={() => setDd(null)}><b>{h}</b><span>{d}</span></a>))}
              {group("sellers", N.sellers, N.sellerItems.map(([k, h, d]) => <a key={k} href="#sellers" onClick={() => pickSeller(k)}><b>{h}</b><span>{d}</span></a>))}
              <div className="nav-i"><a href="#pricing">{N.pricing}</a></div>
              <div className="nav-i"><a href="#faq">{N.faq}</a></div>
            </nav>
          )}
          <div className="act">
            <button className="chip" style={{ fontFamily: rtl ? "var(--ui)" : "var(--urdu)" }} onClick={() => setLang(rtl ? "en" : "ur")} aria-label="Switch language">{rtl ? "English" : "اردو"}</button>
            {!minimal && <a href="#start" className="btn btn-p join">{t.start}</a>}
            {!minimal && <button className="chip menu-btn" aria-expanded={menu} aria-controls="mnav" onClick={() => setMenu(!menu)}>{menu ? N.close : N.menu}</button>}
          </div>
        </div>
        {!minimal && (
          <nav id="mnav" className={`mnav ${menu ? "open" : ""}`} aria-label="Mobile">
            <a href="#how" onClick={() => setMenu(false)}>{N.how}</a>
            <div className="mg">{N.product}</div>
            {N.productItems.map(([h, , href]) => <a key={h} href={href} onClick={() => setMenu(false)}>{h}</a>)}
            <div className="mg">{N.sellers}</div>
            {N.sellerItems.map(([k, h]) => <a key={k} href="#sellers" onClick={() => pickSeller(k)}>{h}</a>)}
            <div className="mg" />
            <a href="#pricing" onClick={() => setMenu(false)}>{N.pricing}</a>
            <a href="#faq" onClick={() => setMenu(false)}>{N.faq}</a>
          </nav>
        )}
      </div>
    </header>
  );
}

function Sec({ id, tone = "", children }) {
  return (
    <section id={id} className={`sec ${tone}`}>
      <div className="wrap body">{children}</div>
    </section>
  );
}

/* The hero: a sample packing clip with its burned-in record. */
function Viewfinder() {
  const END = 38;
  const [tick, setTick] = useState(() => (prefersReduced() ? END : 0));
  useEffect(() => {
    if (prefersReduced()) return;
    const id = setInterval(() => setTick((v) => (v >= END + 6 ? 0 : v + 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.min(tick, END);
  const on = (n) => (s >= n ? "on" : "");
  const checks = [["Phone box", 6], ["Charger", 13], ["Invoice", 20], ["Label", 28]];
  let bx = 154;
  const bars = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3].map((w, i) => {
    const x = bx; bx += w + 2;
    return <rect key={i} x={x} y="124" width={w} height="22" fill="#1a1a1a" />;
  });
  return (
    <figure className="vf-fig">
      <div className="vf" role="img" aria-label="Sample frame from a packing recording: a parcel being packed, with order number, timer, item checklist and a fingerprint stamped on the video." dir="ltr">
        <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="vfgrid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#22344f" strokeWidth="1" /></pattern>
          </defs>
          <rect width="480" height="300" fill="#13203a" />
          <rect width="480" height="300" fill="url(#vfgrid)" />
          {/* box interior */}
          <rect x="130" y="70" width="220" height="170" fill="#6f5232" />
          {/* items */}
          <g className={`s ${on(6)}`}><rect x="150" y="92" width="70" height="126" fill="#e8e4d8" stroke="#bdb7a6" /><rect x="160" y="104" width="50" height="8" fill="#bdb7a6" /><rect x="160" y="118" width="34" height="5" fill="#cfcabb" /></g>
          <g className={`s ${on(13)}`}><rect x="234" y="96" width="34" height="44" rx="4" fill="#f4f4f1" stroke="#c9c9c2" /><rect x="246" y="140" width="10" height="14" fill="#c9c9c2" /></g>
          <g className={`s ${on(20)}`}><rect x="238" y="164" width="92" height="56" fill="#fff" /><rect x="246" y="174" width="60" height="4" fill="#c8c8c2" /><rect x="246" y="184" width="74" height="4" fill="#c8c8c2" /><rect x="246" y="194" width="48" height="4" fill="#c8c8c2" /></g>
          {/* open flaps, then closed lid */}
          <g className={`s ${s >= 26 ? "" : "on"}`}>
            <polygon points="130,70 350,70 336,34 144,34" fill="#c49a60" />
            <polygon points="130,240 350,240 336,276 144,276" fill="#b58b52" />
            <polygon points="130,70 130,240 96,224 96,86" fill="#b98f56" />
            <polygon points="350,70 350,240 384,224 384,86" fill="#b98f56" />
          </g>
          <g className={`s ${on(26)}`}><rect x="130" y="70" width="220" height="170" fill="#c9a06a" /><line x1="130" y1="155" x2="350" y2="155" stroke="#a9824d" strokeWidth="2" /></g>
          {/* shipping label */}
          <g className={`s ${on(28)}`}><rect x="146" y="88" width="96" height="64" fill="#fff" /><rect x="154" y="96" width="60" height="5" fill="#9a9a94" /><rect x="154" y="106" width="76" height="4" fill="#c8c8c2" />{bars}</g>
          {/* tape */}
          <rect className={`tape ${on(32)}`} x="262" y="58" width="30" height="194" fill="#ff8a1f" opacity=".94" />
          {/* viewfinder corners */}
          <path d="M14 38V14h24M442 14h24v24M14 262v24h24M466 262v24h-24" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2" />
        </svg>
        <div className="ov tl rec"><i />REC 00:{pad(s)} / 01:00</div>
        <div className="ov tr">ORD-48213<br />Station 2 · Packer Ali</div>
        <div className="ov bl">{checks.map(([l, n]) => <span key={l} className={`chk ${on(n)}`}>{l}</span>)}</div>
        <div className="ov br">31 Oct 2026 14:02:{pad(7 + s)}<span className={`fp ${on(34)}`}>Fingerprint 9f3a c71e</span></div>
        <div className="prog" style={{ "--p": (s / 60) * 100 }}><i /></div>
      </div>
      <figcaption className="vf-cap">Sample frame. Every clip carries its order number, packer, time and a fingerprint, and stops at 60 seconds.</figcaption>
    </figure>
  );
}

/* Legal pages: all original wording preserved. */
function LegalPage({ lang, title, children }) {
  const isUr = lang === "ur";
  return (
    <main className="legal" dir={isUr ? "rtl" : "ltr"}>
      <a href="/" className="lnk">{isUr ? "واپس گھر پر" : "Back to home"}</a>
      <h1>{title}</h1>
      <p className="meta">{isUr ? "آخری تازہ ترین: 31 اکتوبر 2026" : "Last updated: 2026-10-31"}</p>
      {children}
      <p className="disc">{isUr ? "یہ ڈرافٹ ایک خودکار کوڈ آڈٹ سے تیار کیا گیا ہے۔ اس کی کسی لائسنس یافتہ وکیل سے جائزہ نہیں لیا گیا۔ پروڈکشن پر انحصار کرنے سے پہلے پاکستان کے کسی ماہر وکیل سے جائزہ ضرور لیں۔" : "This draft was produced from an automated code audit. It has NOT been reviewed by a licensed attorney. Have a qualified lawyer in Pakistan review it before relying on it in production."}</p>
    </main>
  );
}

const whoWeAre = (isUr) => (
  <>
    <h2>{isUr ? "ہم کون ہیں" : "Who we are"}</h2>
    <p>{isUr ? "پرسل سبوت (ثبوت) پاکستانی آن لائن سیلرز کے لیے ثبوت اکٹھا کرنے والا ٹول ہے۔ ہم ہر پیکنگ اور ہر ریٹرن کی مسلسل، ٹائم سٹیمپڈ ویڈیوز ریکارڈ کرتے ہیں جو دراز، ٹی سی ایس، لیپرڈز اور پوسٹ ایکس جیسے مارکیٹ پلیسز اور کوریئرز کے ساتھ کلیم جیتنے کے لیے ثبوت کا کام آتی ہیں۔" : "ParcelSaboot (ثبوت) is a proof-collection tool for Pakistani e-commerce sellers. We record continuous, timestamped packing and return-opening videos that serve as evidence for return claims on marketplaces like Daraz and couriers like TCS, Leopards, and PostEx."}</p>
  </>
);

function PrivacyPolicyPage({ lang }) {
  const isUr = lang === "ur";
  return (
    <LegalPage lang={lang} title={isUr ? "پرائیویسی پالیسی" : "Privacy Policy"}>
      {whoWeAre(isUr)}
      <p><strong>{isUr ? "رابطہ:" : "Contact:"}</strong> hello@parcelsaboot.com</p>
      <p><strong>{isUr ? "مادی پتہ:" : "Physical address:"}</strong> {isUr ? "شائع نہیں کیا گیا — آزاد ڈویلپر" : "Not published — independent developer"}</p>
    </LegalPage>
  );
}

function TermsOfServicePage({ lang }) {
  const isUr = lang === "ur";
  return (
    <LegalPage lang={lang} title={isUr ? "شرائطِ خدمت" : "Terms of Service"}>
      {whoWeAre(isUr)}
      <p>{isUr ? "پرسل سبوت آپ کے لیے کلیم فائل نہیں کرتا۔ دراز اور کوریئرز باہر کے ٹولز کے ذریعے کلیم فائل کرنے کا کوئی طریقہ فراہم نہیں کرتے، لہذا آپ کو ہر کلیم خود فائل کرنا پڑے گا۔ پرسل سبوت ثبوت تیار کرتا ہے اور آپ کو ڈڈ لائن بتاتا ہے۔ ہم یہ وعدہ نہیں کرتے کہ دراز، ٹی سی ایس، لیپرڈز، پوسٹ ایکس یا کوئی بھی دوسرا مارکیٹ پلیس یا کوریئر آپ کا کلیم قبول کرے گا۔ فیصلہ ان کا ہے۔" : "ParcelSaboot does not file claims for you. Daraz and couriers do not offer a way for outside tools to file claims, so you submit each claim yourself. ParcelSaboot prepares the evidence and tells you the deadline. We cannot promise that Daraz, TCS, Leopards, PostEx, or any other marketplace or courier will accept a claim. The decision is theirs."}</p>
      <p><strong>{isUr ? "رابطہ:" : "Contact:"}</strong> hello@parcelsaboot.com</p>
    </LegalPage>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
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
  const [cookieConsent, setCookieConsent] = useState(readConsent);
  const [termsConsent, setTermsConsent] = useState(false);
  const [menu, setMenu] = useState(false);
  const t = T[lang];
  const rtl = lang === "ur";
  const legal = route === "/privacy" || route === "/terms";
  const root = useRef(null);
  const cookieRef = useRef(null);

  const chooseConsent = (granted) => {
    saveConsent(granted); // persisted before the exit animation so a fast refresh still remembers it
    const el = cookieRef.current;
    if (el && !prefersReduced()) {
      gsap.to(el, { autoAlpha: 0, y: 12, duration: 0.2, ease: "power2.out", onComplete: () => setCookieConsent(granted) });
    } else {
      setCookieConsent(granted);
    }
  };

  /* Hero: headline words rise out of a mask, copy settles, the clip frame wipes in. Replays on language switch. */
  useGSAP(() => {
    if (legal) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline()
        .from(".w .wi", { yPercent: 115, duration: 0.95, ease: "expo.out", stagger: 0.05 })
        .from(".hero-copy > *", { autoAlpha: 0, y: 14, duration: 0.6, ease: "power3.out", stagger: 0.08 }, 0.4)
        .fromTo(".hero-vf", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "expo.out", clearProps: "clipPath" }, 0.25);
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [legal, lang], revertOnUpdate: true });

  /* Below the fold: each block animates for its own reason (data grows, steps arrive in order, messages arrive one by one). */
  useGSAP(() => {
    if (legal) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const at = (trigger, start = "top 82%") => ({ trigger, start, once: true });
      const group = (parent, items, from, to) => {
        gsap.utils.toArray(parent).forEach((p) => {
          const els = p.querySelectorAll(items);
          if (els.length) gsap.fromTo(els, from, { ...to, scrollTrigger: at(p) });
        });
      };
      group(".tscroll", ".bar-t i", { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 1.1, ease: "expo.out", stagger: 0.12 });
      gsap.utils.toArray(".steps li").forEach((li) => {
        gsap.from(li.querySelectorAll(".n, h3, p"), { autoAlpha: 0, x: 18, duration: 0.6, ease: "power3.out", stagger: 0.08, scrollTrigger: at(li, "top 85%") });
      });
      group(".feat", ".msg", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.55 });
      gsap.utils.toArray(".feat .art").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "expo.out", clearProps: "clipPath", scrollTrigger: at(el, "top 85%") });
      });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [legal], revertOnUpdate: true });

  const audMounted = useRef(false);
  useGSAP(() => {
    if (!audMounted.current) { audMounted.current = true; return; }
    if (prefersReduced()) return;
    gsap.fromTo("#aud-panel", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out", clearProps: "opacity,visibility,transform" });
  }, { scope: root, dependencies: [aud] });

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (cookieConsent === true) {
      window.cookieConsentGranted = true;
      loadAnalytics();
    } else if (cookieConsent === false) {
      window.cookieConsentGranted = false;
      window.gtag = function () {};
    }
  }, [cookieConsent]);

  const badReturns = (calc.orders * calc.ret * calc.bad) / 10000;
  const monthlyLoss = badReturns * calc.value;
  const recoverable = monthlyLoss * 0.6;
  const setC = (k) => (e) => setCalc({ ...calc, [k]: Number(e.target.value) });
  const fillFor = (v, min, max) => `${((v - min) / (max - min)) * 100}%`;
  const rangeStyle = (v, min, max) => ({ "--fill": fillFor(v, min, max) });
  const price = (m) => (m === 0 ? "Rs 0" : rs(yearly ? (m * 10) / 12 : m));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const store = document.getElementById("store")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const volume = document.getElementById("volume")?.value || "";
    try {
      const response = await fetch("/api/submit-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_name: store, whatsapp: phone, sells_on: volume }),
      });
      const result = await response.json();
      if (!response.ok) { throw new Error(result.error || "Submission failed"); }
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "early_access_signup", { method: "form", sells_on: volume, store_name: store });
      }
      setSent(true);
      setSubmitting(false);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  };

  const onTabKey = (e, keys, cur, set, prefix) => {
    const i = keys.indexOf(cur);
    let n = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % keys.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + keys.length) % keys.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = keys.length - 1;
    else return;
    e.preventDefault();
    set(keys[n]);
    document.getElementById(prefix + keys[n])?.focus();
  };

  const audKeys = Object.keys(audiences);
  const A = audiences[aud];

  const features = [
    {
      eyebrow: "Continuous recording", title: "Each parcel in one continuous clip",
      body: "Saboot records from empty box to sealed parcel in a single continuous clip. No editing means no one can claim the video was staged.",
      ticks: ["Continuous from start to finish", "Order number burned into frame", "Tamper-evident fingerprint"],
      visual: (
        <div className="art" role="img" aria-label="A single unbroken clip timeline from empty box at 0 seconds, to label at 28 seconds, to sealed parcel at 38 seconds, ending in a fingerprint.">
          <div className="strip"><i className="mk" style={{ insetInlineStart: "0%" }} /><i className="mk" style={{ insetInlineStart: "46%" }} /><i className="mk" style={{ insetInlineStart: "63%" }} /><i className="mk" style={{ insetInlineEnd: 0 }} /></div>
          <div className="strip-l" dir="ltr"><b>00:00 <span>empty box</span></b><b>00:28 <span>label</span></b><b>00:38 <span>sealed</span></b></div>
          <p style={{ fontFamily: "var(--ui)", fontSize: 13, margin: "14px 0 0" }}>One file. No joins. Fingerprint 9f3a c71e saved at upload.</p>
        </div>
      ),
    },
    {
      eyebrow: "Claim deadlines", title: "Deadline alerts on WhatsApp",
      body: "Every marketplace and courier sets its own claim window. Saboot tracks them and alerts you on WhatsApp before the deadline passes.",
      ticks: ["48-hour Daraz window", "7-day TCS window", "WhatsApp deadline alerts"],
      visual: (
        <div className="art" role="img" aria-label="Two sample WhatsApp alerts: a Daraz claim closing in 6 hours, and a TCS claim closing in 2 days.">
          <div className="msg" dir="ltr">Daraz claim for ORD-48213 closes in <b>6 hours</b>. Your evidence file is ready.<small>Saboot · 11:42</small></div>
          <div className="msg" dir="ltr">TCS claim for ORD-48190 closes in <b>2 days</b>.<small>Saboot · 09:15</small></div>
        </div>
      ),
    },
    {
      eyebrow: "Evidence bundle", title: "An evidence file to attach to the claim",
      body: "Export a ready-to-send evidence file with the packing clip, return clip, and a written statement. Attach it to your Daraz or courier claim.",
      ticks: ["Evidence PDF per order", "Clip fingerprint included", "Ready for Daraz / TCS"],
      visual: (
        <div className="art sheet" dir="ltr" role="img" aria-label="Sample evidence file for order 48213 listing the packing clip, return clip, written statement and fingerprint.">
          <h4><span>Evidence file</span><span>ORD-48213</span></h4>
          <ul>
            <li>Packing clip <b>00:38</b></li>
            <li>Return clip <b>00:52</b></li>
            <li>Written statement <b>Included</b></li>
            <li>Fingerprint <b>9f3a c71e</b></li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="sb" ref={root} dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ur" : "en"} id="top">
        <style>{css}</style>

        {!legal && <a className="skip" href="#main">Skip to content</a>}
        <Header t={t} rtl={rtl} setLang={setLang} setAud={setAud} minimal={legal} menu={menu} setMenu={setMenu} />

        {route === "/privacy" && <PrivacyPolicyPage lang={lang} />}
        {route === "/terms" && <TermsOfServicePage lang={lang} />}

        {!legal && (
          <main id="main">
            {/* Hero */}
            <section className="hero">
              <div className="wrap">
                <h1 aria-label={t.h1}>{t.h1.split(" ").map((w, i) => (
                  <span className="w" key={i} aria-hidden="true"><span className="wi">{w}</span>{" "}</span>
                ))}</h1>
                <div className="hero-grid">
                  <div className="hero-copy">
                    <p className="lead">{t.lead}</p>
                    <div className="cta-row">
                      <a href="#start" className="btn btn-p btn-lg">{t.cta1}</a>
                      <a href="#calculator" className="btn btn-g btn-lg">{t.cta2}</a>
                    </div>
                    <p className="fine">{t.works}</p>
                  </div>
                  <div className="hero-vf"><Viewfinder /></div>
                </div>
              </div>
            </section>

            {/* Problem */}
            <Sec id="problems">
              <h2>{t.probH}</h2>
              <p>{t.probP}</p>
            </Sec>

            {/* Audience */}
            <Sec id="sellers" tone="surface">
              <div className="tabs" role="tablist" aria-label="Seller type">
                {audKeys.map((k) => (
                  <button key={k} id={`tab-${k}`} role="tab" className="tab" aria-selected={aud === k} aria-controls="aud-panel" tabIndex={aud === k ? 0 : -1} onClick={() => setAud(k)} onKeyDown={(e) => onTabKey(e, audKeys, aud, setAud, "tab-")}>{audiences[k].tab}</button>
                ))}
              </div>
              <div id="aud-panel" role="tabpanel" aria-labelledby={`tab-${aud}`} className="two">
                <div>
                  <h2>{A.h}</h2>
                  <p>{A.p}</p>
                </div>
                <ul className="rows">{A.pts.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </Sec>

            {/* How */}
            <Sec id="how">
              <h2>{t.howH}</h2>
              <ol className="steps" style={{ marginTop: 32 }}>
                {[["Pack", "Scan the label. The packing is recorded."], ["Return", "Scan the return. The opening is recorded."], ["Claim", "Saboot opens the claim and starts the clock."], ["Recover", "Send the bundle and track it to a decision."]].map(([h, d], i) => (
                  <li key={h}>
                    <span className="n" aria-hidden="true">{i + 1}</span>
                    <h3><span className="sr-only">Step {i + 1}: </span>{h}</h3>
                    <p>{d}</p>
                  </li>
                ))}
              </ol>
            </Sec>

            {/* Features */}
            <Sec id="features" tone="surface">
              {features.map((f) => (
                <div className="feat" key={f.title}>
                  <div>
                    <h2>{f.title}</h2>
                    <p>{f.body}</p>
                    <ul className="ticks">{f.ticks.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                  {f.visual}
                </div>
              ))}
            </Sec>

            {/* Daraz checklist */}
            <Sec>
              <div className="two">
                <div>
                  <h2>Show every item Daraz will look for, before it ships</h2>
                  <p>Save a checklist for each product. During packing, Saboot prompts the packer to hold each item to the camera: tags, manual, warranty card, free gift, invoice. If a return comes back without them, your clip shows they went out.</p>
                </div>
                <div className="paper">
                  <div className="hd2">What Daraz checks on a return</div>
                  <ul>{daraZList.map((x) => <li key={x}><i aria-hidden="true" />{x}</li>)}</ul>
                  <a className="lnk" href="https://www.daraz.pk/return-policy/" style={{ display: "inline-block", marginTop: 18, fontSize: 13, color: "var(--sub)" }}>From Daraz's return policy</a>
                </div>
              </div>
            </Sec>

            {/* Claim windows */}
            <Sec tone="surface">
              <h2>Deadlines are short, and every company sets its own</h2>
              <div className="tscroll" style={{ marginTop: 28 }} dir="ltr">
                <table>
                  <caption style={{ captionSide: "bottom", textAlign: "start", fontSize: 13, color: "var(--sub)", paddingTop: 12 }}>Bars share one scale: the full width is 30 days.</caption>
                  <thead><tr><th scope="col">Company</th><th scope="col">Window</th><th scope="col">What they ask for</th><th scope="col">Source</th></tr></thead>
                  <tbody>{rules.map(([c, w, a, u]) => (
                    <tr key={c}>
                      <th scope="row" style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", borderBottom: "1px solid var(--line)", padding: "16px 16px 16px 0" }}>{c}</th>
                      <td style={{ fontWeight: 600, width: 240 }}>{w}<span className="bar-t" aria-hidden="true"><i style={{ width: `${(ruleHours[c] / 720) * 100}%` }} /></span></td>
                      <td style={{ color: "var(--sub)" }}>{a}</td>
                      <td><a className="lnk" href={u}>Policy</a></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <p style={{ fontSize: 14, marginTop: 18 }}>Windows come from each company's published policy, checked October 2026. We found no published claim window for Trax, so it is not listed. Policies change. Check the company's current terms before you rely on a deadline.</p>
            </Sec>

            {/* Calculator */}
            <Sec id="calculator">
              <div className="two">
                <div>
                  <h2>What bad returns cost you every month</h2>
                  <p>Move the sliders to match your store. The estimate assumes you win 6 in 10 claims once you have proof.</p>
                  <div style={{ display: "grid", gap: 20, marginTop: 24 }}>
                    <label className="f" htmlFor="c-orders"><span className="fl"><span>Orders a month</span><b>{calc.orders.toLocaleString("en-PK")}</b></span><input id="c-orders" type="range" style={rangeStyle(calc.orders, 50, 3000)} min="50" max="3000" step="50" value={calc.orders} onChange={setC("orders")} /></label>
                    <label className="f" htmlFor="c-ret"><span className="fl"><span>Parcels returned</span><b>{calc.ret}%</b></span><input id="c-ret" type="range" style={rangeStyle(calc.ret, 2, 40)} min="2" max="40" value={calc.ret} onChange={setC("ret")} /></label>
                    <label className="f" htmlFor="c-bad"><span className="fl"><span>Returns that come back wrong, empty or missing parts</span><b>{calc.bad}%</b></span><input id="c-bad" type="range" style={rangeStyle(calc.bad, 2, 50)} min="2" max="50" value={calc.bad} onChange={setC("bad")} /></label>
                    <label className="f" htmlFor="c-value"><span className="fl"><span>Average order value</span><b>{rs(calc.value)}</b></span><input id="c-value" type="range" style={rangeStyle(calc.value, 500, 20000)} min="500" max="20000" step="100" value={calc.value} onChange={setC("value")} /></label>
                  </div>
                </div>
                <div className="receipt" dir="ltr">
                  <dl>
                    <div className="r"><dt>Bad returns a month</dt><dd><AnimNum value={badReturns} /></dd></div>
                    <div className="r warn"><dt>Money at risk a month</dt><dd><AnimNum value={monthlyLoss} format={rs} /></dd></div>
                    <div className="r hi"><dt>Estimated recoverable with proof</dt><dd><AnimNum value={recoverable} format={rs} /></dd></div>
                  </dl>
                  <div className="verdict" aria-live="polite">
                    Standard plan costs <b>Rs 1,999</b> a month. {recoverable > 1999 ? <>That is about <b>{Math.max(1, Math.round(recoverable / 1999))}×</b> back.</> : <>At your volume, the Free plan is the better fit.</>}
                  </div>
                  <p className="fine2">An estimate, not a promise. The 6 in 10 win rate is an assumption until our pilot gives real numbers. Outcomes depend on Daraz and courier decisions.</p>
                </div>
              </div>
            </Sec>

            {/* What makes a clip count */}
            <Sec tone="surface">
              <h2>What a claims team looks for in a clip</h2>
              <p>Pakistani law accepts electronic records as evidence, and support teams and courts look for signs a video is genuine. Saboot builds every clip to meet that bar.</p>
              <dl className="defs">
                {[["One take", "Continuous from empty box to sealed parcel. No cuts."], ["Label in frame", "The courier label is visible and read on camera."], ["Stamped", "Order number, packer and time burned into the record."], ["Fingerprinted", "A unique code saved at upload. Any edit would change it."]].map(([h, d]) => (
                  <div key={h}><dt>{h}</dt><dd>{d}</dd></div>
                ))}
              </dl>
            </Sec>

            {/* Setup */}
            <Sec>
              <div className="two">
                <div>
                  <h2>Set up with a phone and a stand</h2>
                  <p>No CCTV contract and no installer. Any of these setups works.</p>
                  <ul className="ticks">
                    <li>Starter: an Android phone on a stand. The phone reads the label.</li>
                    <li>Faster: add a USB barcode scanner.</li>
                    <li>Warehouse: a fixed USB webcam and scanner at each station.</li>
                  </ul>
                </div>
                <div className="art">
                  <SetupScene />
                </div>
              </div>
            </Sec>

            {/* Comparison */}
            <Sec tone="surface">
              <h2>A video only counts when it is tied to the order</h2>
              <div className="tscroll" style={{ marginTop: 28 }} dir="ltr">
                <table className="cmp">
                  <thead><tr><th scope="col"><span className="sr-only">Feature</span></th><th scope="col">Phone gallery</th><th scope="col">CCTV</th><th scope="col" className="me">Saboot</th></tr></thead>
                  <tbody>
                    {compareRows.map((r) => (
                      <tr key={r[0]}>{r.map((c, j) => <td key={j} className={j === 3 ? "me" : ""} style={j === 0 ? { fontWeight: 600 } : j < 3 ? { color: "var(--sub)" } : undefined}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Sec>

            {/* Pricing */}
            <Sec id="pricing">
              <div className="phead">
                <div>
                  <h2>A flat monthly price</h2>
                  <p style={{ margin: 0 }}>Planned flat price. We will not take a share of what you recover.</p>
                </div>
                <div className="tabs tight" role="group" aria-label="Billing period" style={{ border: 0 }}>
                  <button className="tab" aria-pressed={!yearly} onClick={() => setYearly(false)}>Monthly</button>
                  <button className="tab" aria-pressed={yearly} onClick={() => setYearly(true)}>Yearly · 2 months free</button>
                </div>
              </div>
              <div className="plans" dir="ltr">
                {plans.map(([n, m, q, items, hot]) => (
                  <div key={n} className={`plan ${hot ? "hot" : ""}`}>
                    {hot && <span className="flag">Recommended</span>}
                    <h3>{n}</h3>
                    <div className="price">{price(m)}<small> / month</small></div>
                    <p className="qty">{yearly && m ? `Billed ${rs(m * 10)} a year · ` : ""}{q}</p>
                    <ul className="ticks">{items.map((x) => <li key={x}>{x}</li>)}</ul>
                    <a href="#start" className={`btn ${hot ? "btn-t" : "btn-g"}`}>Choose {n}</a>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, marginTop: 20 }}>Planned prices for launch. Each parcel covers one packing clip of up to 60 seconds and, if it comes back, one return clip. Clips are kept for the storage period of your plan, and longer while a claim is open. Payment methods will be confirmed before billing starts. Prices exclude tax.</p>
            </Sec>

            {/* FAQ */}
            <Sec id="faq" tone="surface">
              <h2>Questions sellers ask</h2>
              <div className="faq" dir="ltr">
                {faqs.map(([q, a], i) => (
                  <div key={q}>
                    <h3>
                      <button className="faq-q" id={`faq-q-${i}`} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} aria-controls={`faq-a-${i}`}>{q}<span className="pm" aria-hidden="true" /></button>
                    </h3>
                    <div className={`ans ${open === i ? "open" : ""}`} id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                      <div><p>{a}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </Sec>

            {/* Final CTA + form */}
            <section id="start" className="sec deep final">
              <div className="wrap two">
                <div>
                  <h2>{t.finalH}</h2>
                  <p className="lede">{t.finalP}</p>
                </div>
                <form onSubmit={handleSubmit} className="form" dir="ltr">
                  {sent ? (
                    <div role="status">
                      <h3>You're on the list</h3>
                      <p style={{ margin: 0 }}>We'll message you on WhatsApp to set up your first packing station.</p>
                    </div>
                  ) : (
                    <>
                      {submitError && (
                        <div className="err" role="alert"><b>Something went wrong</b>{submitError}</div>
                      )}
                      <label className="f" htmlFor="store">Store name<input id="store" className="field" required placeholder="e.g. Karachi Gadgets" /></label>
                      <label className="f" htmlFor="phone">WhatsApp number<input id="phone" className="field" required placeholder="03xx xxxxxxx" inputMode="tel" pattern="[0-9 +\-]{10,15}" /></label>
                      <label className="f" htmlFor="volume">Where do you sell?
                        <select id="volume" className="field" defaultValue="daraz"><option value="daraz">Daraz</option><option value="social">Instagram / WhatsApp</option><option value="site">My own website</option><option value="all">More than one</option></select>
                      </label>
                      <label className="consent">
                        <input type="checkbox" required checked={termsConsent} onChange={(e) => setTermsConsent(e.target.checked)} />
                        <span>I agree to the <a href="/terms" className="lnk">Terms of Service</a> and <a href="/privacy" className="lnk">Privacy Policy</a></span>
                      </label>
                      <button className="btn btn-p btn-lg" type="submit" disabled={submitting || !termsConsent}>{submitting ? "Submitting" : "Get early access"}</button>
                    </>
                  )}
                </form>
              </div>
            </section>

            {/* Footer */}
            <footer className="deep">
              <div className="wrap ft" dir="ltr">
                <div className="ft-top">
                  <div>
                    <h2>Proof for every parcel</h2>
                    <div className="ft-cta">
                      <a href="#start" className="pill">Join early access <Arrow /></a>
                      <a href="mailto:hello@parcelsaboot.com" className="pill">Email us <span aria-hidden="true">parcelsaboot@gmail.com</span></a>
                    </div>
                  </div>
                  <nav className="ft-nav" aria-label="Footer">
                    <ul className="ft-links">
                      <li><a href="/privacy">Privacy</a></li>
                      <li><a href="/terms">Terms</a></li>
                    </ul>
                    <div>
                      <p className="ft-h">Sources</p>
                      <ul className="ft-src">{sources.map(([n, u]) => <li key={u}><a href={u}>{n}</a></li>)}</ul>
                    </div>
                  </nav>
                </div>
                <svg className="ft-mark" viewBox="0 0 1000 170" aria-hidden="true" focusable="false">
                  <text x="0" y="160" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="currentColor" style={{ fontFamily: "var(--display)", fontSize: 220, fontWeight: 800, fontStretch: "125%" }}>SABOOT</text>
                </svg>
                <p className="ft-disc">Not affiliated with, endorsed by or integrated with Daraz, Priceoye, TCS, Leopards, PostEx or Trax.</p>
                <div className="ft-bot">
                  <span>© 2026 Saboot · Made in Pakistan</span>
                  <a className="ft-badge" href="https://www.directree.io" target="_blank" rel="noopener noreferrer"><img src="https://www.directree.io/badge/directree-badge-black.svg" alt="Verified on directree" width="200" height="37" /></a>
                  <button type="button" className="ft-lang" style={{ fontFamily: rtl ? "var(--ui)" : "var(--urdu)" }} onClick={() => setLang(rtl ? "en" : "ur")} aria-label="Switch language">{rtl ? "English" : "اردو"}</button>
                </div>
              </div>
            </footer>

            <div className="sticky-cta">
              <a href="#calculator" className="btn btn-g">Calculator</a>
              <a href="#start" className="btn btn-p">{t.start}</a>
            </div>
          </main>
        )}

        {cookieConsent === null && (
          <div className="cookie" ref={cookieRef} role="region" aria-label="Cookie consent">
            <div>
              <b>{t.cookie.title}</b>
              <p>{t.cookie.desc}</p>
            </div>
            <div className="btns">
              <button onClick={() => chooseConsent(true)} className="btn btn-p">{t.cookie.accept}</button>
              <button onClick={() => chooseConsent(false)} className="btn btn-g">{t.cookie.decline}</button>
            </div>
            <a href="/privacy" className="lnk" style={{ fontSize: 12.5, color: "var(--sub)" }}>{t.cookie.privacy}</a>
          </div>
        )}
      </div>
    </>
  );
}
