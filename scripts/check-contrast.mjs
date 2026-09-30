/**
 * Verifies the theme in app/app.css against WCAG contrast minimums.
 *
 * Run with `npm run check:contrast` after touching any colour token. Each pair
 * below names a real place the two colours meet in the UI — if you add a new
 * combination to a component, add it here too.
 */
import { readFileSync } from "node:fs";

const AAA_TEXT = 7; // 1.4.6 Contrast (Enhanced)
const UI = 3; // 1.4.11 Non-text Contrast, for interactive outlines

/** [foreground, background, where it appears, minimum ratio] */
const PAIRS = [
  ["text", "bg", "headings and body copy", AAA_TEXT],
  ["text", "surface", "card and nav text", AAA_TEXT],
  ["text", "surface-2", "text on pills", AAA_TEXT],
  ["text", "accent-soft", "active nav pill", AAA_TEXT],
  ["muted", "bg", "About paragraphs, timeline bullets", AAA_TEXT],
  ["muted", "surface", "footer links, skill pills, nav items", AAA_TEXT],
  ["muted", "surface-2", "tech pills on project cards", AAA_TEXT],
  ["accent", "bg", "org names, eyebrow, inline links", AAA_TEXT],
  ["accent", "surface", "project tagline, Source/Demo links", AAA_TEXT],
  ["accent", "surface-2", "accent text on pills", AAA_TEXT],
  ["on-accent", "accent", "primary button label", AAA_TEXT],
  ["on-accent", "accent-hover", "primary button label, hovered", AAA_TEXT],
  ["border-strong", "bg", "control outlines", UI],
  ["border-strong", "surface", "control outlines on cards", UI],
  ["accent", "bg", "focus ring", UI],
  ["accent", "surface", "focus ring on cards", UI],
];

function oklchToSrgb([L, C, H]) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => {
    const clamped = Math.min(1, Math.max(0, v));
    const encoded =
      clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
    return Math.min(1, Math.max(0, encoded));
  });
}

function luminance(srgb) {
  const [r, g, b] = srgb.map((v) => {
    const q = Math.round(v * 255) / 255; // quantise to what actually ships
    return q <= 0.04045 ? q / 12.92 : ((q + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function hex(srgb) {
  return "#" + srgb.map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}

function parseTokens(css, selector) {
  const block = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`));
  if (!block) throw new Error(`no ${selector} block in app/app.css`);
  const tokens = {};
  for (const [, name, body] of block[1].matchAll(
    /--([a-z0-9-]+):\s*oklch\(([^)]*)\)/g,
  )) {
    const [L, C, H] = body.trim().split(/\s+/).map(Number);
    tokens[name] = [L, C, H || 0];
  }
  return tokens;
}

const css = readFileSync(new URL("../app/app.css", import.meta.url), "utf8");
const themes = { light: parseTokens(css, ":root"), dark: parseTokens(css, "\\.dark") };

let failures = 0;
for (const [theme, tokens] of Object.entries(themes)) {
  console.log(`\n${theme.toUpperCase()}`);
  for (const [fg, bg, usage, min] of PAIRS) {
    for (const name of [fg, bg]) {
      if (!tokens[name]) throw new Error(`${theme}: missing token --${name}`);
    }
    const ratio = contrast(oklchToSrgb(tokens[fg]), oklchToSrgb(tokens[bg]));
    const ok = ratio >= min;
    if (!ok) failures++;
    console.log(
      `  ${ok ? "ok  " : "FAIL"} ${ratio.toFixed(2).padStart(5)}:1 (min ${min})  ` +
        `${hex(oklchToSrgb(tokens[fg]))} on ${hex(oklchToSrgb(tokens[bg]))} — ${usage}`,
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} contrast failure(s).`);
  process.exit(1);
}
console.log(`\nAll ${PAIRS.length * 2} pairs pass.`);
