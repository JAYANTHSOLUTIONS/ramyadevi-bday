import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG as C } from "./config.js";
import { DEFS } from "./art.js";
import Background from "./components/Background.jsx";
import Petals from "./components/Petals.jsx";
import Dock from "./components/Dock.jsx";
import { useMusic } from "./components/useMusic.js";
import { asset, BASE } from "./art.js";
import { sfx } from "./sound.js";

sfx.setEnabled(C.sounds?.enabled !== false);
sfx.setVolume(C.sounds?.volume ?? 0.6);
sfx.setBase(BASE);
import Cover from "./chapters/Cover.jsx";
import Letter from "./chapters/Letter.jsx";
import Love from "./chapters/Love.jsx";
import Story from "./chapters/Story.jsx";
import Photos from "./chapters/Photos.jsx";
import OurDate from "./chapters/OurDate.jsx";
import Dreams from "./chapters/Dreams.jsx";
import Song from "./chapters/Song.jsx";
import Table from "./chapters/Table.jsx";

/* Chapters in order. `pose` = camera pose for [top flowers, bottom props]:
   [x %, y %, scale]. Change these to move the table differently per chapter. */
const L = C.labels || {};
const CHAPTERS = [
  { id: "cover",  name: "The cover",                    Comp: Cover,   pose: [[0, 0, 1],      [0, 0, 1]] },
  { id: "letter", name: L.letter || "The letter",       Comp: Letter,  pose: [[0, -4, 1.02],  [0, 10, 0.98]] },
  { id: "love",   name: L.love || "Why you shine",      Comp: Love,    pose: [[-3, -8, 1.06], [4, 16, 1.02]] },
  { id: "story",  name: L.story || "Your journey",      Comp: Story,   pose: [[4, -14, 1.02], [-4, 6, 1.04]] },
  { id: "photos", name: L.photos || "Memories",         Comp: Photos,  pose: [[-4, -10, 1.08],[0, 12, 0.98]] },
  { id: "date",   name: L.date || "Your day",           Comp: OurDate, pose: [[4, -6, 1.03],  [-5, 8, 1.03]] },
  { id: "dreams", name: L.dreams || "Wishes for you",   Comp: Dreams,  pose: [[3, -12, 0.96], [-6, 4, 1.05]] },
  { id: "song",   name: L.song || "Now playing",      Comp: Song,    pose: [[-4, -10, 1],    [5, 14, 1]] },
  { id: "table",  name: L.table || "The table",         Comp: Table,   pose: [[0, -10, 0.98], [0, 8, 1.02]] }
];
const LAST = CHAPTERS.length - 1;
const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function App() {
  const [cur, setCur] = useState(0);
  const [views, setViews] = useState([{ key: 0, idx: 0, state: "enter" }]);
  const [busy, setBusy] = useState(false);
  const [fx, setFx] = useState(!reduce);
  const [soundOn, setSoundOn] = useState(C.sounds?.enabled !== false);
  const [toastMsg, setToastMsg] = useState({ text: "", on: false });
  const backgroundTrack = C.music?.background
    ? { ...C.music.background, src: asset(C.music.background.src) }
    : null;
  const music = useMusic(backgroundTrack, C.music?.volume ?? 0.7);
  const curRef = useRef(0), busyRef = useRef(false), keyRef = useRef(0), toastT = useRef(0);

  const toast = useCallback((text) => {
    setToastMsg({ text, on: true });
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToastMsg((t) => ({ ...t, on: false })), 1600);
  }, []);

  // chapter change: old view blurs out while the new one rises in
  const go = useCallback((n) => {
    n = Math.max(0, Math.min(LAST, n));
    if (n === curRef.current || busyRef.current) return;
    busyRef.current = true; setBusy(true);
    if (curRef.current !== 0) sfx.play(n > curRef.current || (curRef.current === LAST && n === 1) ? "next" : "back");
    curRef.current = n; setCur(n);
    keyRef.current += 1;
    const key = keyRef.current;
    setViews((v) => [...v.map((x) => ({ ...x, state: "exit" })), { key, idx: n, state: "enter" }]);
    setTimeout(() => setViews((v) => v.filter((x) => x.state !== "exit")), 460);
    setTimeout(() => { busyRef.current = false; setBusy(false); }, 650);
  }, []);

  // one switch for everything you hear: music + effects
  const toggleSound = () => {
    const v = !soundOn; setSoundOn(v); sfx.setEnabled(v);
    if (v) { sfx.play("toggle"); if (curRef.current !== 0) music.play(); }
    else music.pause();
    toast(v ? "Sound on" : "Sound off");
  };

  const next = () => go(cur === LAST ? 1 : cur + 1);
  const back = () => go(Math.max(1, cur - 1));

  // keyboard ← →
  useEffect(() => {
    const k = (e) => {
      if (curRef.current === 0) return;
      if (e.key === "ArrowRight") go(curRef.current === LAST ? 1 : curRef.current + 1);
      if (e.key === "ArrowLeft" && curRef.current > 1) go(curRef.current - 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go]);

  // swipe left / right between chapters
  const sw = useRef(null);
  const onDown = (e) => { sw.current = e.target.closest("[data-noswipe]") ? null : { x: e.clientX, y: e.clientY }; };
  const onUp = (e) => {
    const s = sw.current; sw.current = null;
    if (!s || curRef.current === 0) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) dx < 0 ? next() : back();
  };

  return (
    <main className="stage">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
      </svg>

      <Background pose={CHAPTERS[cur].pose} />
      <Petals on={fx} />

      <header className="top">
        <div className="badge">
          <svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" fill="#fff" /></svg>
          {C.badge}
        </div>
        <div className="tools">
        <button className={`round music ${music.playing ? "on" : ""}`} onClick={toggleSound}
          title="Sound on / off" aria-label={soundOn ? "Turn sound off" : "Turn sound on"}>
          {music.playing
            ? <span className="eq" aria-hidden="true"><i /><i /><i /></span>
            : <svg viewBox="0 0 24 24" fill="none" stroke="#6b5750" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" />{!soundOn && <path d="M3 3l18 18" />}</svg>}
        </button>
        <button className="round" title="Petals on / off" aria-label={fx ? "Pause falling petals" : "Play falling petals"}
          onClick={() => { sfx.play("toggle"); setFx(!fx); toast(fx ? "Petals paused" : "Petals on"); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6b5750" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3" /></svg>
        </button>
        </div>
      </header>

      <div className="views" onPointerDown={onDown} onPointerUp={onUp}>
        {views.map((v) => {
          const ch = CHAPTERS[v.idx], Comp = ch.Comp;
          return (
            <section key={v.key} className={`view ${v.state} v-${ch.id}`} aria-label={ch.name}>
              <Comp C={C} go={go} toast={toast} music={music} active={v.state === "enter"} chapters={CHAPTERS} />
            </section>
          );
        })}
      </div>

      <Dock hidden={cur === 0} atTable={cur === LAST} busy={busy}
        nextName={cur === LAST ? CHAPTERS[1].name : CHAPTERS[cur + 1].name}
        canBack={cur > 1} onBack={back} onGrid={() => go(LAST)} onNext={next} />

      <div className={`toast ${toastMsg.on ? "on" : ""}`} role="status">{toastMsg.text}</div>
    </main>
  );
}
