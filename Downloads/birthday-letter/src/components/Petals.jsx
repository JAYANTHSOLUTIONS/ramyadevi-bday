import { useEffect, useRef } from "react";

// Falling petals on one canvas: sway (sine), spin, and a 3D-ish flip (scaleX = cos).
const COLS = ["#8e1c3b", "#a42a48", "#e8aeb1", "#f3c9c8", "#f7eadb", "#d98f9a", "#f2c6c4"];

export default function Petals({ on, count = 16 }) {
  const ref = useRef(null);
  const onRef = useRef(on);
  onRef.current = on;

  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"), host = cv.parentElement;
    let W = 0, H = 0, raf = 0, last = 0;
    const size = () => {
      const d = Math.min(2, window.devicePixelRatio || 1);
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const mk = (top) => ({
      x: Math.random() * W, y: top ? -20 - Math.random() * 80 : Math.random() * H,
      s: 3.5 + Math.random() * 5.5, vy: 24 + Math.random() * 34, amp: 10 + Math.random() * 26,
      ph: Math.random() * 6.3, fr: 0.5 + Math.random() * 0.9, rot: Math.random() * 6.3,
      vr: (Math.random() - 0.5) * 1.6, fl: Math.random() * 6.3, vf: 0.8 + Math.random() * 2.2,
      c: COLS[Math.floor(Math.random() * COLS.length)], a: 0.7 + Math.random() * 0.3
    });
    const ro = new ResizeObserver(size);
    ro.observe(host); size();
    const petals = Array.from({ length: count }, () => mk(false));

    const frame = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
      ctx.clearRect(0, 0, W, H);
      if (onRef.current && !document.hidden) {
        for (let i = 0; i < petals.length; i++) {
          const p = petals[i];
          p.y += p.vy * dt; p.ph += p.fr * dt; p.rot += p.vr * dt; p.fl += p.vf * dt;
          if (p.y > H + 20) { petals[i] = mk(true); continue; }
          ctx.save();
          ctx.translate(p.x + Math.sin(p.ph) * p.amp, p.y);
          ctx.rotate(p.rot);
          ctx.scale(Math.max(0.18, Math.abs(Math.cos(p.fl))), 1);
          ctx.globalAlpha = p.a; ctx.fillStyle = p.c; ctx.beginPath();
          ctx.moveTo(0, -p.s);
          ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.8, p.s * 0.7, p.s * 0.7, 0, p.s);
          ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.8, 0, -p.s);
          ctx.fill();
          ctx.globalAlpha = p.a * 0.25; ctx.fillStyle = "#fff"; ctx.beginPath();
          ctx.ellipse(-p.s * 0.2, -p.s * 0.25, p.s * 0.22, p.s * 0.45, 0, 0, 6.3); ctx.fill();
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [count]);

  return <canvas ref={ref} className="petals" aria-hidden="true" />;
}
