import { useEffect, useRef } from "react";
import { sfx } from "../sound.js";

// Birthday finale: rockets fly up, burst into glittering sparks, confetti rains.
// Sparks fade with "destination-out" so they leave soft trails on a transparent canvas.
const COLS = ["#ffd36e", "#ffb3c1", "#ff5c7a", "#fff4d6", "#f7a440", "#ffe9a8", "#ffffff", "#ff8fa3"];
const CONF = ["#ffd36e", "#ff5c7a", "#ffb3c1", "#fff4d6", "#c99a3b", "#ff8fa3"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

export default function Fireworks({ reduce = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"), host = cv.parentElement;
    let W = 0, H = 0, raf = 0, last = 0, start = 0, booms = 0;
    const size = () => {
      const d = Math.min(2, window.devicePixelRatio || 1);
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    const rockets = [], sparks = [], confetti = [], timers = [];

    const rainConfetti = (count) => {
      for (let i = 0; i < count; i++) confetti.push({
        x: Math.random() * W, y: -10 - Math.random() * H * 0.5, vx: (Math.random() - 0.5) * 50, vy: 70 + Math.random() * 90,
        rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 8, fl: Math.random() * 6.3, vf: 4 + Math.random() * 6,
        w: 6 + Math.random() * 5, h: 3 + Math.random() * 3, c: pick(CONF), ph: Math.random() * 6.3
      });
    };

    const launch = () => {
      const x = W * (0.14 + Math.random() * 0.72);
      rockets.push({ sx: x, x, y: H + 10, ty: H * (0.12 + Math.random() * 0.3), t: 0, dur: 0.7 + Math.random() * 0.35, drift: (Math.random() - 0.5) * 50, c: pick(COLS) });
      sfx.play("launch");
    };

    const explode = (r) => {
      sfx.play("boom");
      booms++;
      if (booms === 1) rainConfetti(110);
      const kind = Math.random(), n = 80 + Math.floor(Math.random() * 40);
      for (let i = 0; i < n; i++) {
        const ring = kind < 0.3, a = ring ? (i / n) * Math.PI * 2 : Math.random() * Math.PI * 2;
        const sp = ring ? 175 + Math.random() * 15 : 50 + Math.random() * 200;
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, age: 0, life: 1.1 + Math.random() * 0.9,
          c: kind > 0.7 ? pick(COLS) : r.c, glitter: Math.random() < 0.35, s: 1.3 + Math.random() * 1.4 });
      }
      for (let i = 0; i < 6; i++) {
        const a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 70;
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, age: 0, life: 0.3, c: "#fff3d6", glitter: false, s: 1.5 });
      }
    };

    if (reduce) rainConfetti(70);
    else [0, 0.35, 0.8, 1.2, 1.55, 2.0, 2.45, 2.9, 3.4, 3.9, 4.5].forEach((t) => timers.push(setTimeout(launch, t * 1000)));

    const frame = (now) => {
      if (!start) start = now;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
      // fade what was drawn before -> trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.26)"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]; r.t += dt;
        const p = Math.min(1, r.t / r.dur), e = 1 - (1 - p) * (1 - p);
        r.x = r.sx + r.drift * e; r.y = H + 10 - (H + 10 - r.ty) * e;
        ctx.globalAlpha = 1; ctx.fillStyle = "#fff3d0";
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, 6.3); ctx.fill();
        ctx.globalAlpha = 0.5; ctx.fillStyle = r.c;
        ctx.beginPath(); ctx.arc(r.x + (Math.random() - 0.5) * 3, r.y + 6 + Math.random() * 6, 1.4, 0, 6.3); ctx.fill();
        if (p >= 1) { explode(r); rockets.splice(i, 1); }
      }

      const drag = Math.exp(-1.7 * dt);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]; s.age += dt;
        if (s.age >= s.life) { sparks.splice(i, 1); continue; }
        s.vx *= drag; s.vy = s.vy * drag + 120 * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        let a = 1 - s.age / s.life;
        if (s.glitter && Math.random() < 0.45) a *= 0.2;
        ctx.fillStyle = s.c;
        ctx.globalAlpha = a * 0.22; ctx.beginPath(); ctx.arc(s.x, s.y, s.s * 3, 0, 6.3); ctx.fill();
        ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, 6.3); ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.ph += dt * 2; c.rot += c.vr * dt; c.fl += c.vf * dt;
        c.x += (c.vx + Math.sin(c.ph) * 30) * dt; c.y += c.vy * dt;
        if (c.y > H + 20) { confetti.splice(i, 1); continue; }
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot); ctx.scale(1, Math.cos(c.fl));
        ctx.globalAlpha = 0.95; ctx.fillStyle = c.c; ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      const busy = rockets.length || sparks.length || confetti.length || now - start < 5000;
      if (busy) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", size);
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); window.removeEventListener("resize", size); };
  }, [reduce]);

  return <canvas ref={ref} className="fireworks" aria-hidden="true" />;
}
