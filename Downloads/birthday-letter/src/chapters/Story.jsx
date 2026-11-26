import { useState } from "react";
import { st } from "./_shared.js";
import { sfx } from "../sound.js";

export default function Story({ C }) {
  const S = C.story || [];
  const [i, setI] = useState(0);
  const [swap, setSwap] = useState(false);
  const turn = (d) => {
    const k = i + d;
    if (k < 0 || k >= S.length) return;
    sfx.play("page");
    setSwap(true);
    setTimeout(() => { setI(k); setSwap(false); }, 280);
  };
  const e = S[i];
  return (
    <div className="note paper s" style={st(0)}>
      {S.length ? (
        <>
          <div className={`txt ${swap ? "swap" : ""}`}>
            <div className="when">{e.when}</div>
            <h3>{e.title}</h3>
            {e.text}
          </div>
          <nav>
            <button className="mini" onClick={() => turn(-1)} disabled={i === 0} aria-label="Previous page">‹</button>
            <span>{i + 1} / {S.length}</span>
            <button className="mini" onClick={() => turn(1)} disabled={i === S.length - 1} aria-label="Next page">›</button>
          </nav>
        </>
      ) : (
        <p className="empty">This letter has no story yet.</p>
      )}
    </div>
  );
}
