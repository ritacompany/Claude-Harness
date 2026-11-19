#!/usr/bin/env node
// tool-check: the script half of the tool-defaults "Before he sees it" check.
// Usage: node tool-check.mjs <file.html | http(s) url> [--out <dir>] [--widths 390,768,1280,1440,1920]
// Loads the page in Chromium at each width and fails on what a script can see:
//   overflow   the page scrolls sideways, or visible text runs past the right edge
//   sidebar    a sidebar or side panel with no working collapse toggle
//   scrollbox  an inner scroll box (opt out a real one with data-scroll-ok)
//   tinytext   visible text under 11px
//   theme      a light page background with the system set to dark (opt out a page meant to be light with data-theme-ok)
//   save       form controls on the page and nothing that saves them
//   copy       an em or en dash, a hyphen pair or an Oxford comma in visible text
//   title      no <title>
//   errors     script errors while loading
// Screenshots of every width go to --out (default: ./tool-check-shots) for the visual look.
// Prints "tool-check passed" and exits 0 only when nothing failed.
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("--") && !/^\d/.test(a));
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
if (!target) { console.log("usage: node tool-check.mjs <file.html | url> [--out dir] [--widths 390,768,...]"); process.exit(2); }
const widths = opt("--widths", "390,768,1280,1440,1920").split(",").map(Number);
const out = resolve(opt("--out", "tool-check-shots"));
mkdirSync(out, { recursive: true });

const require = createRequire(import.meta.url);
let chromium;
for (const where of [undefined, process.cwd(), "/opt/node22/lib/node_modules", "/usr/local/lib/node_modules", "/usr/lib/node_modules"]) {
  try { chromium = (where ? require(require.resolve("playwright", { paths: [where] })) : require("playwright")).chromium; break; } catch {}
}
if (!chromium) { console.log("tool-check could not run: Playwright is not installed here. Install it (npm i -D playwright) or check the page by hand at phone and desktop width."); process.exit(3); }

const url = /^https?:/.test(target) ? target : pathToFileURL(resolve(target)).href;
const source = /^https?:/.test(target) || !existsSync(target) ? "" : readFileSync(target, "utf8");
const fails = [];
const fail = (kind, msg) => fails.push(`${kind}: ${msg}`);

let browser;
try { browser = await chromium.launch(); }
catch { browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--headless", "--no-sandbox"] }); }
try {
  for (const w of widths) {
    const page = await browser.newPage({ colorScheme: "dark", viewport: { width: w, height: w < 600 ? 844 : w < 1000 ? 1024 : 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e.message || e)));
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(400);
    if (errors.length) fail("errors", `at ${w}px: ${errors.slice(0, 2).join(" | ")}`);
    await page.screenshot({ path: join(out, `w${w}.png`), fullPage: false });

    const r = await page.evaluate(() => {
      const vw = window.innerWidth;
      const vis = (el) => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0 && b.width > 0 && b.height > 0; };
      const optedOut = (el, attr) => !!el.closest(`[${attr}]`);
      const sideways = document.scrollingElement.scrollWidth > vw + 1;
      const spill = [], tiny = [], boxes = [];
      const sideLike = (el) => { const b = el.getBoundingClientRect(); return b.width >= 140 && b.width <= vw * 0.45 && b.height >= window.innerHeight * 0.6 && (b.left <= 24 || vw - b.right <= 24); };
      for (const el of document.body.querySelectorAll("*")) {
        if (!vis(el)) continue;
        const s = getComputedStyle(el);
        const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (ownText) {
          const b = el.getBoundingClientRect();
          if (b.right > vw + 1 && !el.closest("[data-overflow-ok]") && s.position !== "fixed") {
            let clipped = false;
            for (let p = el.parentElement; p; p = p.parentElement) { const ps = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(ps.overflowX) && p.getBoundingClientRect().right <= vw + 1) { clipped = true; break; } }
            if (!clipped) spill.push(el.textContent.trim().slice(0, 40));
          }
          if (parseFloat(s.fontSize) < 11) tiny.push(`${s.fontSize} "${el.textContent.trim().slice(0, 30)}"`);
        }
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 4 && el.clientHeight > 40 && el !== document.body && el !== document.documentElement && !optedOut(el, "data-scroll-ok") && !sideLike(el))
          boxes.push((el.id ? "#" + el.id : el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : "")));
      }
      // sidebars: a tall element hugging the left or right edge, 140 to 45% of the viewport wide
      const sidebars = [];
      for (const el of document.body.querySelectorAll("aside, nav, [class*=side], [class*=Side], [id*=side], [data-sidebar], [role=complementary]")) {
        if (!vis(el)) continue;
        const b = el.getBoundingClientRect();
        if (b.width >= 140 && b.width <= vw * 0.45 && b.height >= window.innerHeight * 0.6 && (b.left <= 24 || vw - b.right <= 24) && !sidebars.some((x) => x.contains(el) || el.contains(x))) sidebars.push(el);
      }
      const sb = sidebars.map((el, i) => { el.setAttribute("data-tc-sidebar", i); const b = el.getBoundingClientRect(); return { i, w: b.width, l: b.left, name: el.id || el.className || el.tagName }; });
      const bg = (() => { for (let el = document.body; el; el = el.parentElement) { const c = getComputedStyle(el).backgroundColor; const m = c.match(/[\d.]+/g); if (m && (m.length < 4 || +m[3] > 0)) return m.slice(0, 3).map(Number); } return [255, 255, 255]; })();
      const lum = (0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2]) / 255;
      const text = document.body.innerText;
      const controls = document.querySelectorAll("input:not([type=hidden]):not([type=search]), textarea, select, [contenteditable=true]").length;
      return { sideways, spill: spill.slice(0, 3), tiny: tiny.slice(0, 3), boxes: [...new Set(boxes)].slice(0, 3), sb, lum, lightOk: !!document.querySelector("[data-theme-ok]"), text, controls, title: document.title.trim() };
    });

    if (r.sideways) fail("overflow", `the page scrolls sideways at ${w}px`);
    if (r.spill.length) fail("overflow", `text runs past the right edge at ${w}px: ${r.spill.join(" | ")}`);
    if (r.tiny.length) fail("tinytext", `at ${w}px: ${r.tiny.join(" | ")}`);
    if (r.boxes.length) fail("scrollbox", `inner scroll box at ${w}px: ${r.boxes.join(", ")} (add data-scroll-ok only for a long list beside a detail area)`);

    if (w >= 1280) {
      for (const s of r.sb) {
        // a working toggle: some visible button or control whose click changes this sidebar's width or visibility
        const before = s.w;
        const handles = await page.$$("button, [role=button], [aria-expanded], [aria-controls], [data-sidebar-toggle], summary");
        let works = false;
        for (const h of handles) {
          if (!(await h.isVisible())) continue;
          const label = ((await h.getAttribute("aria-label")) || (await h.getAttribute("title")) || (await h.innerText().catch(() => "")) || "").toLowerCase();
          const expanded = await h.getAttribute("aria-expanded");
          if (!/(collaps|expand|sidebar|side panel|panel|menu|hide|show|toggle|«|»|‹|›|☰)/.test(label) && expanded === null && !(await h.getAttribute("data-sidebar-toggle"))) continue;
          await h.click({ timeout: 1000 }).catch(() => {});
          await page.waitForTimeout(450);
          const after = await page.evaluate((i) => { const el = document.querySelector(`[data-tc-sidebar="${i}"]`); if (!el) return 0; const st = getComputedStyle(el); return st.display === "none" || st.visibility === "hidden" ? 0 : el.getBoundingClientRect().width; }, s.i);
          if (Math.abs(after - before) > 30) { works = true; await h.click({ timeout: 1000 }).catch(() => {}); await page.waitForTimeout(450); break; }
        }
        if (!works) fail("sidebar", `side panel "${String(s.name).slice(0, 40)}" (${Math.round(s.w)}px) has no toggle that collapses it at ${w}px`);
      }
      if (r.lum > 0.45 && !r.lightOk) fail("theme", `the page background is light at ${w}px; his tools are dark (add data-theme-ok only for a page meant to be light, such as a PDF style document)`);
    }

    if (w === widths[widths.length - 1]) {
      if (!r.title) fail("title", "the page has no <title>");
      const lines = r.text.split("\n");
      const dash = lines.filter((l) => /[–—]|\w--\w|\w -- \w/.test(l));
      if (dash.length) fail("copy", `dash in visible text: ${dash.slice(0, 2).map((l) => l.trim().slice(0, 60)).join(" | ")}`);
      const W = "(?!(?:and|or)\\b)[\\w'-]+";
      const ox = new RegExp("\\b" + W + "(?: " + W + ")?, " + W + "(?: " + W + ")?, (?:and|or) [\\w'-]");
      const oxl = lines.filter((l) => ox.test(l));
      if (oxl.length) fail("copy", `Oxford comma in visible text: ${oxl.slice(0, 2).map((l) => l.trim().slice(0, 60)).join(" | ")}`);
      if (r.controls > 0) {
        const code = source || (await page.content());
        if (!/localStorage|sessionStorage|indexedDB|window\.claude|artifact-db|\.doc\(|ArtifactData/.test(code)) fail("save", `${r.controls} form controls and nothing that saves them (autosave to the artifact db or localStorage)`);
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}
const uniq = [...new Set(fails)];
if (uniq.length) { console.log(uniq.join("\n")); console.log(`tool-check failed: ${uniq.length} problem(s). Screenshots: ${out}`); process.exit(1); }
console.log(`screenshots: ${out}`);
console.log("tool-check passed");
