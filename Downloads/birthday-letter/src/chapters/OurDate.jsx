import { useEffect, useState } from "react";
import { st } from "./_shared.js";
import { sfx } from "../sound.js";

export default function OurDate({ C, active }) {
  const iso = C.date?.iso;
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!iso) return;
    const t = setInterval(() => { setNow(Date.now()); if (active) sfx.play("tick"); }, 1000);
    return () => clearInterval(t);
  }, [iso, active]);

  if (!iso) return <p className="empty s">The special date will appear here.</p>;

  const d = new Date(iso + "T00:00");
  const dateLabel = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  let diff = now - d.getTime();
  const future = diff < 0;
  diff = Math.abs(diff) / 1000;
  const cells = [
    [Math.floor(diff / 86400).toLocaleString(), "days"],
    [Math.floor(diff / 3600) % 24, "hours"],
    [Math.floor(diff / 60) % 60, "mins"],
    [Math.floor(diff) % 60, "secs"]
  ];
  return (
    <div className="dtag paper s" style={st(0)}>
      <p className="eyebrow">{C.date.label || "Your day"}</p>
      <div className="day">{d.getDate()}</div>
      <div className="my"> {dateLabel.slice(3)}</div>
      <div className="count">
        {cells.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
      </div>
      <p className="hint">{future ? "until the day" : "days of you — and counting"}</p>
    </div>
  );
}
