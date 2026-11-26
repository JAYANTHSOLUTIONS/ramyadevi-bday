// Small hand-drawn SVG pieces (paper, seal, map, dandelion, vinyl, table objects).
// The table, flowers and roses themselves are photos in public/assets/.

export const BASE = import.meta.env.BASE_URL;
export const asset = (p) => (!p ? "" : /^(https?:|data:|blob:|\/)/.test(p) ? p : BASE + p);

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let seed = 11;
export const reseed = (n) => (seed = n);
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
export const R = (a, b) => a + rnd() * (b - a);

const lin = (id, stops, x2 = 0, y2 = 0, x1 = 0, y1 = 1) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`)
    .join("")}</linearGradient>`;
const rad = (id, stops) =>
  `<radialGradient id="${id}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join("")}</radialGradient>`;

export const DEFS =
  rad("shadow", [[0, "#4a2e20", 0.28], [1, "#4a2e20", 0]]) +
  lin("silk", ["#d99b9e", "#f3cfcb", "#e4aeae"], 1, 0, 0, 0) +
  lin("gold", ["#6e4f22", "#e8d08f", "#a07c3c", "#f3e2ad", "#7a5a28"]) +
  rad("goldr", [[0, "#f6e6b4"], [0.6, "#c9a35b"], [1, "#6e4f22"]]) +
  rad("seal", [[0, "#a3324f"], [0.7, "#7a1631"], [1, "#4b0a1c"]]) +
  lin("env", ["#efe6d7", "#fbf6ec"]) +
  lin("flap", ["#f6efe2", "#e9dfcd"]) +
  lin("book", ["#5f7862", "#93a993", "#6f8a72"], 1, 0, 0, 0) +
  rad("fluff", [[0, "#ffffff", 0.9], [0.7, "#ffffff", 0.35], [1, "#ffffff", 0]]) +
  lin("label", ["#5e0f24", "#a3324f"]);

function bumpy(r, n = 22) {
  let d = "";
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * Math.PI * 2, rr = r + (k % 2 ? 1.6 : -0.6) + R(-0.8, 0.8);
    d += (k ? "L" : "M") + (Math.cos(a) * rr).toFixed(1) + " " + (Math.sin(a) * rr).toFixed(1);
  }
  return d + "Z";
}

export function sealSVG(initial, r = 24) {
  reseed(5);
  return `<g class="seal"><path d="${bumpy(r)}" fill="url(#seal)"/><circle r="${r * 0.66}" fill="none" stroke="#3d0716" stroke-opacity=".35" stroke-width="1.4"/><circle r="${r * 0.7}" fill="none" stroke="#fff" stroke-opacity=".12"/><text y="${r * 0.27}" text-anchor="middle" font-family="Pinyon Script, cursive" font-size="${r * 0.85}" fill="#4b0a1c">${esc(initial)}</text><ellipse cx="${-r * 0.35}" cy="${-r * 0.45}" rx="${r * 0.3}" ry="${r * 0.12}" transform="rotate(-30)" fill="#fff" opacity=".18"/></g>`;
}

export const envelopeSVG = (initial) =>
  `<svg viewBox="0 0 260 170"><rect width="260" height="170" rx="3" fill="url(#env)"/><path d="M0 170L130 92L260 170M0 0L112 96M260 0L148 96" stroke="#785a3c" stroke-opacity=".12" fill="none"/><path class="flap" d="M0 0L130 94L260 0Z" fill="url(#flap)" stroke="#785a3c" stroke-opacity=".15"/><g transform="translate(130 94)">${sealSVG(initial, 25)}</g></svg>`;

export const cornerSVG = `<svg viewBox="0 0 40 40"><path d="M3 37V12Q3 3 12 3H37M8 32V14Q8 8 14 8H32M14 20q6-1 6-6" fill="none" stroke="url(#gold)" stroke-width="1.6" stroke-linecap="round"/><circle cx="20" cy="14" r="1.6" fill="#c9a35b"/></svg>`;

export function dandelionSVG(n = 34) {
  reseed(77);
  let s = `<path d="M150 340C152 290 138 240 150 170" stroke="#8ea08a" stroke-width="3" fill="none"/><path d="M147 300q-30-10-40-30q26 4 40 22" fill="#93a990"/><circle cx="150" cy="150" r="70" fill="url(#fluff)"/>`;
  for (let k = 0; k < n; k++) {
    const a = (k / n) * 360 + R(-4, 4), l = R(52, 64);
    let tuft = "";
    for (let j = -3; j <= 3; j++) tuft += `<path d="M${l} 0l${8 * Math.cos(j * 0.35)} ${8 * Math.sin(j * 0.35)}"/>`;
    s += `<g class="seed"><g transform="translate(150 150) rotate(${a})" stroke="#fff" stroke-width=".9" stroke-linecap="round"><path d="M6 0H${l}" stroke="#ece6da"/>${tuft}<circle cx="5" cy="0" r="1.6" fill="#a79a7a" stroke="none"/></g></g>`;
  }
  return `<svg viewBox="0 0 300 340">${s}<circle cx="150" cy="150" r="7" fill="#9a9a72"/></svg>`;
}

export function vinylSVG(title) {
  let g = "";
  for (let r = 52; r < 118; r += 3.2) g += `<circle cx="130" cy="135" r="${r}" fill="none" stroke="#fff" stroke-opacity="${0.03 + (r % 7) * 0.006}"/>`;
  return `<svg viewBox="0 0 300 270"><circle cx="138" cy="146" r="122" fill="url(#shadow)"/><g class="disc"><circle cx="130" cy="135" r="120" fill="#141112"/>${g}
  <path d="M130 135L60 30A120 120 0 0 1 120 15Z" fill="#fff" opacity=".05"/><path d="M130 135L200 240A120 120 0 0 1 140 255Z" fill="#fff" opacity=".04"/>
  <circle cx="130" cy="135" r="42" fill="url(#label)"/><circle cx="130" cy="135" r="36" fill="none" stroke="#e9c96d" stroke-opacity=".5"/><text x="130" y="131" text-anchor="middle" font-family="Pinyon Script,cursive" font-size="17" fill="#f6e7d6">Side A</text><text x="130" y="150" text-anchor="middle" font-family="Inter,sans-serif" font-size="6" letter-spacing="1.5" fill="#f6e7d6" opacity=".7">${esc((title || "").toUpperCase()).slice(0, 22)}</text><circle cx="130" cy="135" r="3" fill="#efe4d6"/></g>
  <g class="arm"><circle cx="268" cy="34" r="16" fill="url(#goldr)"/><circle cx="268" cy="34" r="6" fill="#7a5a28"/><path d="M268 34L250 170L222 196" stroke="url(#gold)" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="208" y="190" width="20" height="12" rx="2" transform="rotate(40 218 196)" fill="#2b2525"/></g></svg>`;
}

export const ICONS = {
  letter: (c) => `<svg viewBox="0 0 64 56"><rect x="4" y="10" width="56" height="36" rx="2" fill="url(#env)"/><path d="M4 10L32 30L60 10" fill="url(#flap)" stroke="#785a3c" stroke-opacity=".2"/><g transform="translate(32 30)">${sealSVG(c.sealInitial, 7)}</g></svg>`,
  story: () => `<svg viewBox="0 0 64 56"><g transform="rotate(-8 32 28)"><rect x="12" y="6" width="40" height="46" rx="3" fill="url(#book)"/><rect x="12" y="6" width="6" height="46" rx="2" fill="#4f6852"/><rect x="24" y="16" width="20" height="10" rx="1" fill="#f4ecd9"/></g></svg>`,
  photos: () => `<svg viewBox="0 0 64 56"><g transform="rotate(-12 32 28)"><rect x="10" y="8" width="30" height="36" fill="#fffdf9"/><rect x="13" y="11" width="24" height="22" fill="#d8a5a3"/></g><g transform="rotate(8 32 28)"><rect x="24" y="10" width="30" height="36" fill="#fffdf9"/><rect x="27" y="13" width="24" height="22" fill="#e7b78f"/><circle cx="44" cy="20" r="4" fill="#fbe3b0"/></g></svg>`,
  date: (c) => `<svg viewBox="0 0 64 56"><path d="M18 8H46V48H18Z" fill="#fbf6ee" stroke="#d9cbb8"/><path d="M18 8H46V18H18Z" fill="#7f1734"/><circle cx="32" cy="4" r="2.4" fill="none" stroke="#b8955a" stroke-width="1.4"/><text x="32" y="40" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-size="18" fill="#7f1734">${c.date?.iso ? new Date(c.date.iso + "T00:00").getDate() : "♥"}</text></svg>`,
  dreams: () => {
    let s = `<path d="M32 54Q30 40 32 26" stroke="#8ea08a" stroke-width="1.6" fill="none"/><circle cx="32" cy="20" r="16" fill="url(#fluff)"/>`;
    for (let k = 0; k < 18; k++) {
      const a = (k * 20 * Math.PI) / 180;
      s += `<path d="M32 20L${32 + Math.cos(a) * 15} ${20 + Math.sin(a) * 15}" stroke="#fff" stroke-width=".8"/><circle cx="${32 + Math.cos(a) * 15}" cy="${20 + Math.sin(a) * 15}" r="1.3" fill="#fff"/>`;
    }
    return `<svg viewBox="0 0 64 56">${s}<circle cx="32" cy="20" r="2.4" fill="#9a9a72"/></svg>`;
  },
  song: () => `<svg viewBox="0 0 64 56"><g class="spin"><circle cx="32" cy="28" r="24" fill="#141112"/><circle cx="32" cy="28" r="17" fill="none" stroke="#fff" stroke-opacity=".08"/><circle cx="32" cy="28" r="12" fill="none" stroke="#fff" stroke-opacity=".06"/><circle cx="32" cy="28" r="8" fill="url(#label)"/><path d="M32 28L18 10A24 24 0 0 1 30 4Z" fill="#fff" opacity=".07"/><circle cx="32" cy="28" r="1.4" fill="#efe4d6"/></g></svg>`
};
