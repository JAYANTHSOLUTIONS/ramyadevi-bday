import Art from "../components/Art.jsx";
import { asset, cornerSVG } from "../art.js";
import { useEffect } from "react";
import { st } from "./_shared.js";
import { sfx } from "../sound.js";

export default function Letter({ C }) {
  const L = C.letter || {};
  const has = (L.paragraphs || []).some(Boolean);
  useEffect(() => { const t = setTimeout(() => sfx.play("paper"), 380); return () => clearTimeout(t); }, []);
  return (
    <>
      <div className="hdr paper s" style={st(0)}>
        <Art as="span" className="corner tl" html={cornerSVG} />
        <Art as="span" className="corner br" html={cornerSVG} />
        <img className="hrose a" src={asset("assets/rose.webp")} alt="" />
        <img className="hrose b" src={asset("assets/rose-red.webp")} alt="" />
        <p className="eyebrow">A letter for {C.recipient}</p>
      </div>
      {has && (
        <article className="sheet paper s" style={st(1)}>
          {L.greeting && <p className="greet">{L.greeting}</p>}
          {L.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          <p className="sign">{L.signoff}</p>
          <div className="name">{L.signature || C.from}</div>
        </article>
      )}
    </>
  );
}
