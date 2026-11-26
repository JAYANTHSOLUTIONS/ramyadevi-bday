import { useState } from "react";
import { envelopeSVG } from "../art.js";
import { st } from "./_shared.js";
import { sfx } from "../sound.js";

export default function Cover({ C, go, toast, music }) {
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    if (open) return;
    setOpen(true);
    sfx.play("seal");
    if (sfx.enabled) music?.play(); // must run inside the tap so phones allow sound
    toast("Opening the letter…");
    setTimeout(() => go(1), 700);
  };
  return (
    <div className="cover">
      <p className="eyebrow s" style={st(0)}>A letter for</p>
      <h1 className="you s" style={st(1)}>{C.recipient}</h1>
      <button className={`env s ${open ? "open" : ""}`} style={st(2)} onClick={onOpen} aria-label="Open the letter"
        dangerouslySetInnerHTML={{ __html: envelopeSVG(C.sealInitial) }} />
      <p className="script s" style={st(3)}>{C.closing ?? "with warm wishes,"} {C.from}</p>
      <button className="pill s" style={st(4)} onClick={onOpen}>Open the letter</button>
    </div>
  );
}
