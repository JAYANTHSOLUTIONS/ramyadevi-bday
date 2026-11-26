import { useEffect, useRef, useState } from "react";
import { asset } from "../art.js";
import { st } from "./_shared.js";
import { sfx } from "../sound.js";

// spots in a 300×300 box where each reason's rose sits
const SPOTS = [[150, 112], [104, 132], [196, 132], [70, 172], [150, 162], [230, 172], [118, 196], [182, 196], [56, 120], [244, 120], [150, 66], [100, 84], [200, 84]];
const TONES = ["rose", "rose-pink", "rose-red", "rose-blush"]; // photo roses in public/assets

// Tap through each reason to bloom its rose.
export default function Love({ C }) {
  const reasons = C.reasons || [];
  const n = Math.min(reasons.length, SPOTS.length);
  const [i, setI] = useState(-1);
  const [text, setText] = useState("Each reason becomes a flower in this bouquet.");
  const [swap, setSwap] = useState(false);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const next = () => {
    if (!n) { sfx.play("paper"); return; }
    if (i >= n - 1) return;
    const k = i + 1;
    sfx.play("bloom", k);
    setI(k); setSwap(true);
    later(() => { setText(reasons[k]); setSwap(false); }, 300);
  };

  const done = n > 0 && i >= n - 1;
  const small = !n ? null
    : done ? "All reasons revealed"
    : i < 0 ? `Tap the tag for a reason · 0 of ${n}`
    : `Reason ${i + 1} of ${n} · tap for the next`;

  return (
    <>
      <div className="love">
        {n > 0 && (
          <div className="bouquet s" style={st(0)}>
            <div className="bq" onClick={next}>
              <svg viewBox="0 0 300 300">
                {SPOTS.slice(0, n).map(([x, y], k) => (
                  <path key={k} d={`M150 290Q${(x + 150) / 2} ${y + 80} ${x} ${y}`} stroke="#6f8460" strokeWidth="2" fill="none" />
                ))}
                <path d="M128 246q22 10 44 0l-6 22h-32z" fill="url(#silk)" />
                <path d="M150 252c-24-18-40-6-26 4s26-4 26-4c24-18 40-6 26 4s-26-4-26-4z" fill="#d99b9e" />
              </svg>
              {SPOTS.slice(0, n).map(([x, y], k) => (
                <img key={k} src={asset(`assets/${TONES[k % 4]}.webp`)} alt=""
                  className={`bud ${k <= i ? "on" : ""}`}
                  style={{ left: `${(x / 300) * 100}%`, top: `${(y / 300) * 100}%` }} />
              ))}
            </div>
          </div>
        )}
        <button className="tag paper s" style={st(1)} onClick={next}>
          <p className="eyebrow gold">A bouquet of reasons</p>
          <p className={swap ? "swap" : ""}>{text}</p>
          {small && <small>{small}</small>}
        </button>
      </div>
    </>
  );
}
