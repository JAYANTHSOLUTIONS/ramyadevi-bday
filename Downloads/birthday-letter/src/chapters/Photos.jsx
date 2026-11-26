import { useEffect, useMemo, useRef, useState } from "react";
import { asset, reseed, R } from "../art.js";
import { st } from "./_shared.js";
import { sfx } from "../sound.js";
import Fireworks from "../components/Fireworks.jsx";

const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Photos({ C }) {
  const P = C.photos || [];
  const tilt = useMemo(() => { reseed(8); return P.map(() => [R(-7, 7), R(-8, 8), R(-6, 6)]); }, [P]);
  const [order, setOrder] = useState(() => P.map((_, k) => k)); // order[0] is on top
  const [flying, setFlying] = useState(-1);
  const [party, setParty] = useState(false);
  const [closing, setClosing] = useState(false);
  const [round, setRound] = useState(0);
  const orderRef = useRef(order);
  const pendingClicks = useRef(0);
  const flyingRef = useRef(false);
  const celebratedRef = useRef(false);
  const partyScheduled = useRef(false);
  const transitionTimer = useRef(0);
  const partyTimer = useRef(0);
  const closeTimer = useRef(0);
  useEffect(() => () => {
    clearTimeout(transitionTimer.current);
    clearTimeout(partyTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  if (!P.length) return <p className="empty s">This letter has no photos yet.</p>;

  const celebrateAfterPause = () => {
    if (partyScheduled.current || celebratedRef.current) return;
    partyScheduled.current = true;
    partyTimer.current = setTimeout(() => {
      setParty(true);
      setRound((r) => r + 1);
    }, 1000);
  };

  const advance = () => {
    if (flyingRef.current) {
      pendingClicks.current = Math.min(pendingClicks.current + 1, P.length);
      return;
    }

    const top = orderRef.current[0];
    if (top === P.length - 1 && !celebratedRef.current) {
      celebrateAfterPause();
      return;
    }

    sfx.play("photo");
    flyingRef.current = true;
    setFlying(top);
    transitionTimer.current = setTimeout(() => {
      const nextOrder = [...orderRef.current.slice(1), orderRef.current[0]];
      orderRef.current = nextOrder;
      setOrder(nextOrder);
      setFlying(-1);
      flyingRef.current = false;

      if (nextOrder[0] === P.length - 1 && !celebratedRef.current) {
        pendingClicks.current = 0;
        celebrateAfterPause();
      } else if (pendingClicks.current > 0) {
        pendingClicks.current--;
        advance();
      }
    }, 550);
  };

  const next = () => { if (!party) advance(); };

  const closeParty = () => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setParty(false);
      setClosing(false);
      celebratedRef.current = true;
    }, 650);
  };

  return (
    <>
      <div className="stack s" style={st(0)} data-noswipe onClick={next}>
        {P.map((p, k) => {
          const [r, x, y] = tilt[k];
          return (
            <figure key={k} className={`pola ${order[0] === k ? "current" : ""} ${flying === k ? "fly" : ""}`}
              style={{ zIndex: P.length - order.indexOf(k), transform: `rotate(${r}deg) translate(${x}px, ${y}px)` }}>
              <div className="ph photo-frame">
                {p.src && <img src={asset(p.src)} alt={p.caption} />}
                <div className="photo-motion" aria-hidden="true">
                  <span className="photo-glint" />
                  <span className="photo-glow glow-one" />
                  <span className="photo-glow glow-two" />
                </div>
              </div>
              <figcaption>{p.caption}</figcaption>
            </figure>
          );
        })}
      </div>
      <p className="hint s" style={st(1)}>Tap the photo to see the next one</p>
      {party && (
        <div className={`finale photo-finale ${closing ? "closing" : ""}`} onClick={closeParty} data-noswipe role="dialog" aria-label="Happy Birthday Ramyadevi">
          <Fireworks key={round} reduce={reduce} />
          <div className="hb">
            {C.finale?.eyebrow && <p className="hb-eyebrow">{C.finale.eyebrow}</p>}
            <h2 className="hb-title">Happy Birthday Ramyadevi</h2>
            {C.finale?.subtitle && <p className="hb-sub">{C.finale.subtitle}</p>}
            <small className="hb-tap">Tap anywhere to continue</small>
          </div>
        </div>
      )}
    </>
  );
}
