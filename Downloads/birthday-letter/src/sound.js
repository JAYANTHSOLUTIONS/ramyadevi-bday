/* =====================================================================
   Sound effects — all synthesized live with the Web Audio API
   (no audio files to download, nothing to load).

   sfx.play("name", arg)   names:
     tap, toggle, next, back        UI + chapter changes
     seal                           wax seal cracking on the cover
     paper                          letter / tag paper rustle
     bloom (index)                  rose blooming — rising chime per reason
     page                           notebook page turn
     photo                          polaroid swish + land
     tick                           soft clock tick (date counter)
     wind                           blowing the dandelion (+ twinkles)
     needle, stop                   record needle drop / record stop
     wood (index)                   tapping an object on the table
     launch, boom                   fireworks (birthday finale)
   ===================================================================== */

let ctx = null, master = null, wet = null, noiseBuf = null;

// Recorded sounds (in public/sfx/). Played through the same volume / mute as everything else.
// name: [files…, volume]  — several files = they alternate (tick, tock, tick…)
const FILES = {
  tick: [["sfx/tick-1.mp3", "sfx/tick-2.mp3"], 0.16],   // wall clock, once per second on "Your day"
  wish: [["sfx/wish.mp3"], 0.6]                        // sparkle whoosh when a wish is revealed
};
const buffers = {}, turn = {};
let base = "./";
function loadFiles() {
  for (const [name, [files]] of Object.entries(FILES)) {
    if (buffers[name]) continue;
    buffers[name] = [];
    files.forEach((f, i) =>
      fetch(base + f).then((r) => r.arrayBuffer())
        .then((ab) => new Promise((ok, no) => ctx.decodeAudioData(ab, ok, no)))
        .then((b) => { buffers[name][i] = b; })
        .catch(() => {}));
  }
}
// returns false if the file isn't loaded yet (caller can fall back to a synth sound)
function playFile(name) {
  const list = buffers[name] && buffers[name].filter(Boolean);
  if (!list || !list.length) return false;
  const k = (turn[name] = ((turn[name] ?? -1) + 1) % list.length);
  const src = ctx.createBufferSource(), g = ctx.createGain();
  src.buffer = list[k]; g.gain.value = FILES[name][1];
  src.connect(g).connect(master); src.start();
  return true;
}
let enabled = true, volume = 0.6, boost = 1;
const MAKEUP = 2.6; // overall loudness so effects sit above the music
// per-sound loudness trims
const BOOST = { launch: 1.4, tap: 2.4, toggle: 2, page: 2.2, pin: 2, sheetUp: 2.2, sheetDown: 1.4, wood: 2.4, stop: 2.2, tick: 1.6, needle: 1.5, paper: 1.4 };

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    master = ctx.createGain(); master.gain.value = enabled ? volume * MAKEUP : 0;
    master.connect(comp).connect(ctx.destination);
    // small room reverb for bells and twinkles
    const rev = ctx.createConvolver(), len = Math.floor(ctx.sampleRate * 1.8);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    rev.buffer = ir;
    wet = ctx.createGain(); wet.gain.value = 0.5;
    wet.connect(rev).connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const n = noiseBuf.getChannelData(0);
    for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1;
    loadFiles();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// unlock on the first touch anywhere (phones require a gesture)
if (typeof window !== "undefined") {
  const unlock = () => { if (enabled) ensure(); window.removeEventListener("pointerdown", unlock, true); };
  window.addEventListener("pointerdown", unlock, true);
}

function out(node, send) {
  node.connect(master);
  if (send) { const s = ctx.createGain(); s.gain.value = send; node.connect(s).connect(wet); }
}

// a pitched tone with a pluck/bell envelope (optional pitch glide to f2)
function tone({ f, f2, t = 0, dur = 0.2, a = 0.005, vol = 0.2, type = "sine", send = 0 }) {
  const t0 = ctx.currentTime + t, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol * boost, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); out(g, send);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

// filtered noise burst; shape "hit" = fast attack/decay, "swell" = rises then falls
function noise({ t = 0, dur = 0.2, vol = 0.2, type = "bandpass", f = 1000, f2, q = 1, shape = "hit", a = 0.004, send = 0 }) {
  const t0 = ctx.currentTime + t, src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = noiseBuf;
  fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f, t0);
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  if (shape === "swell") {
    g.gain.linearRampToValueAtTime(vol * boost, t0 + dur * 0.4);
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
  } else {
    g.gain.exponentialRampToValueAtTime(vol * boost, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  }
  src.connect(fl).connect(g); out(g, send);
  src.start(t0, Math.random() * 1.5); src.stop(t0 + dur + 0.05);
}

// bell = a few inharmonic partials with different decays
function bell(f, t = 0, vol = 0.12, dec = 1.4, send = 0.35) {
  [[1, 1, 1], [2.01, 0.32, 0.6], [3.02, 0.16, 0.4], [4.16, 0.07, 0.25]].forEach(([m, amp, d]) =>
    tone({ f: f * m, t, dur: dec * d, a: 0.003, vol: vol * amp, send }));
}

function rustle(t = 0, dur = 0.4, vol = 0.22) {
  const n = Math.round(dur * 26);
  for (let i = 0; i < n; i++) {
    noise({ t: t + Math.random() * dur, dur: 0.03 + Math.random() * 0.06, vol: vol * (0.4 + Math.random() * 0.6),
      f: 1400 + Math.random() * 3200, q: 0.9 });
  }
}

const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760, 2093, 2349.32, 2637.02];

const synthTick = () => SOUNDS.synthTick();
const SOUNDS = {
  tap: () => { noise({ dur: 0.035, vol: 0.18, f: 2600, q: 2 }); tone({ f: 880, f2: 600, dur: 0.06, vol: 0.08 }); },
  toggle: () => { noise({ dur: 0.14, vol: 0.12, f: 700, f2: 3200, q: 1.4 }); tone({ f: 1046.5, t: 0.05, dur: 0.25, vol: 0.06, send: 0.3 }); },
  next: () => {
    noise({ dur: 0.38, vol: 0.13, f: 500, f2: 2600, q: 0.8, shape: "swell" });
    bell(1318.51, 0.09, 0.09); bell(1975.53, 0.17, 0.07);
  },
  back: () => {
    noise({ dur: 0.34, vol: 0.12, f: 2600, f2: 500, q: 0.8, shape: "swell" });
    bell(1318.51, 0.07, 0.08); bell(987.77, 0.15, 0.07);
  },
  seal: () => {
    tone({ f: 150, f2: 55, dur: 0.18, vol: 0.32 });                       // thump of the press
    noise({ dur: 0.07, vol: 0.4, type: "highpass", f: 2500 });            // crack
    for (let i = 0; i < 9; i++) noise({ t: 0.01 + Math.random() * 0.16, dur: 0.012, vol: 0.18 + Math.random() * 0.2, type: "highpass", f: 3000 + Math.random() * 3000 });
    rustle(0.22, 0.45, 0.16);                                             // flap lifting
    bell(1567.98, 0.42, 0.06, 1.8, 0.5);
  },
  paper: () => rustle(0, 0.38, 0.2),
  bloom: (k = 0) => {
    const f = PENTA[k % PENTA.length];
    tone({ f: 380, f2: 720, dur: 0.08, vol: 0.1 });                       // soft pop
    bell(f, 0.03, 0.13, 1.6); bell(f * 2, 0.1, 0.04, 1.2, 0.6);
    rustle(0, 0.15, 0.1);
  },
  page: () => {
    noise({ dur: 0.24, vol: 0.26, f: 3400, f2: 700, q: 0.9 });
    noise({ t: 0.19, dur: 0.07, vol: 0.14, type: "lowpass", f: 500 });
  },
  photo: () => {
    noise({ dur: 0.3, vol: 0.18, f: 1200, f2: 5200, q: 0.7, shape: "swell" });
    tone({ t: 0.36, f: 190, f2: 90, dur: 0.09, vol: 0.18 });
    rustle(0.34, 0.12, 0.12);
  },
  tick: () => playFile("tick") || synthTick(),
  synthTick: () => { noise({ dur: 0.012, vol: 0.05, type: "highpass", f: 4200 }); tone({ f: 2100, dur: 0.015, vol: 0.02 }); },
  sheetUp: () => noise({ dur: 0.28, vol: 0.14, type: "lowpass", f: 280, f2: 1400, shape: "swell" }),
  sheetDown: () => { noise({ dur: 0.26, vol: 0.13, type: "lowpass", f: 1400, f2: 280, shape: "swell" }); tone({ t: 0.24, f: 120, f2: 70, dur: 0.1, vol: 0.12 }); },
  pin: () => { tone({ f: 1480, f2: 880, dur: 0.2, vol: 0.13, type: "triangle", send: 0.4 }); tone({ t: 0.05, f: 2220, dur: 0.14, vol: 0.05, send: 0.4 }); },
  wind: () => { if (!playFile("wish")) SOUNDS.synthWind(); },
  // fireworks: rocket whistle, the bang, and the glittery crackle after it
  launch: () => {
    tone({ f: 520, f2: 1700, dur: 0.75, vol: 0.05, a: 0.05 });
    noise({ dur: 0.7, vol: 0.07, type: "highpass", f: 1800, f2: 4200, shape: "swell" });
  },
  boom: () => {
    tone({ f: 120, f2: 36, dur: 1.0, vol: 0.42, send: 0.25 });
    noise({ dur: 1.5, vol: 0.42, type: "lowpass", f: 1000, f2: 180, a: 0.004, send: 0.3 });
    noise({ dur: 0.22, vol: 0.22, f: 2200, q: 0.8 });
    for (let i = 0; i < 26; i++) noise({ t: 0.22 + Math.random() * 1.2, dur: 0.008 + Math.random() * 0.01, vol: 0.05 + Math.random() * 0.1, type: "highpass", f: 4000 + Math.random() * 4500 });
  },
  synthWind: () => {
    noise({ dur: 1.6, vol: 0.22, f: 450, f2: 1300, q: 0.6, shape: "swell" });
    noise({ t: 0.1, dur: 1.3, vol: 0.08, type: "highpass", f: 3000, shape: "swell" });
    for (let i = 0; i < 6; i++) bell(PENTA[7 + Math.floor(Math.random() * 6)], 0.25 + i * 0.18 + Math.random() * 0.08, 0.035, 1.4, 0.7);
  },
  needle: () => {
    tone({ f: 95, f2: 60, dur: 0.12, vol: 0.28 });
    noise({ t: 0.02, dur: 0.05, vol: 0.12, type: "highpass", f: 1800 });
    for (let i = 0; i < 14; i++) noise({ t: 0.1 + Math.random() * 0.7, dur: 0.008, vol: 0.05 + Math.random() * 0.06, type: "highpass", f: 2500 + Math.random() * 4000 });
  },
  stop: () => { tone({ f: 330, f2: 55, dur: 0.45, vol: 0.1, type: "triangle" }); noise({ t: 0.38, dur: 0.06, vol: 0.08, type: "lowpass", f: 400 }); },
  wood: (k = 0) => {
    const f = [392, 440, 494, 523, 587, 659, 698, 784][k % 8];
    tone({ f, dur: 0.12, vol: 0.2, type: "triangle" });
    tone({ f: f * 2.76, dur: 0.05, vol: 0.05 });
    noise({ dur: 0.025, vol: 0.12, f: 2200, q: 1.5 });
  }
};

export const sfx = {
  play(name, arg) {
    if (!enabled || !SOUNDS[name]) return;
    try { if (ensure()) { boost = BOOST[name] || 1; SOUNDS[name](arg); boost = 1; } } catch (e) { boost = 1; /* never let a sound break the page */ }
  },
  setBase(b) { base = b; },
  setEnabled(v) { enabled = v; if (master) master.gain.value = v ? volume * MAKEUP : 0; },
  setVolume(v) { volume = v; if (master && enabled) master.gain.value = v * MAKEUP; },
  get enabled() { return enabled; }
};

// test helpers (unused by the site)
export const _test = { reset: () => { ctx = null; }, ctx: () => ctx };
