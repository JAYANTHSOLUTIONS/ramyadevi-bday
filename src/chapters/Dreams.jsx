import { useMemo, useRef, useState } from "react";
import { dandelionSVG } from "../art.js";
import { st } from "./_shared.js";
import { sfx } from "../sound.js";

const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Dreams({ C }) {
  const D = C.wishes || [];
  const html = useMemo(() => dandelionSVG(), []);
  const box = useRef(null);
  const state = useRef({ next: 0, di: 0, anims: [] });
  const [text, setText] = useState(D.length ? "Tap the dandelion to release a wish" : "");
  const [started, setStarted] = useState(false);
  const [swap, setSwap] = useState(false);

  const blow = () => {
    sfx.play("wind");
    const s = state.current, seeds = [...box.current.querySelectorAll(".seed")];
    if (s.next >= seeds.length) { s.anims.forEach((a) => a.cancel()); s.anims = []; s.next = 0; }
    seeds.slice(s.next, s.next + 7).forEach((g, k) => {
      const dx = 60 + Math.random() * 200, dy = -(200 + Math.random() * 260), r = Math.random() * 120 - 60;
      s.anims.push(g.animate([
        { transform: "translate(0px,0px)", opacity: 1 },
        { transform: `translate(${dx * 0.35}px,${dy * 0.45}px) rotate(${r / 2}deg)`, opacity: 1, offset: 0.45 },
        { transform: `translate(${dx}px,${dy}px) rotate(${r}deg)`, opacity: 0 }
      ], { duration: reduce ? 400 : 3200 + Math.random() * 1600, delay: k * 90, easing: "cubic-bezier(.3,.6,.4,1)", fill: "forwards" }));
    });
    s.next += 7;
    if (D.length) {
      setStarted(true); setSwap(true);
      setTimeout(() => { setText(D[s.di % D.length]); s.di++; setSwap(false); }, 450);
    }
  };

  return (
    <>
      <p className="eyebrow s" style={st(0)}>Dandelion</p>
      <h2 className="title s" style={st(1)}>{C.labels?.dreams || "Wishes for you"}</h2>
      <p className="lede s" style={st(2)}>Each seed carries a wish for the year ahead.</p>
      <p className={`dream s ${started ? "" : "intro"} ${swap ? "swap" : ""}`} style={st(3)}>{text}</p>
      <button ref={box} className="dand s" style={st(2)} onClick={blow} aria-label="Blow the dandelion"
        dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
