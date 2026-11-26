import { useMemo } from "react";
import Art from "../components/Art.jsx";
import { vinylSVG } from "../art.js";
import { st } from "./_shared.js";
import { sfx } from "../sound.js";

const formatTime = (time = 0) => {
  const seconds = Math.floor(Number(time) || 0);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

// The record spins while the background music plays; its button pauses / resumes it.
export default function Song({ C, music }) {
  const song = music?.track || {};
  const html = useMemo(() => vinylSVG(song.title), [song.title]);
  const on = !!music?.playing;
  return (
    <>
      <p className="eyebrow s" style={st(0)}>{C.labels?.song || "Now playing"}</p>
      <Art className={`vinyl s ${on ? "playing" : ""}`} style={st(1)} html={html} />
      <div className="track s" style={st(2)}>
        {song.title && <><b>{song.title}</b><span>{song.artist}</span></>}
        {music?.enabled && (
          <>
            <label className="player-progress">
              <span>{formatTime(music.currentTime)}</span>
              <input
                type="range"
                min="0"
                max={Math.max(music.duration || 0, 1)}
                step="0.1"
                value={music.currentTime || 0}
                onChange={(event) => music.seek(Number(event.target.value))}
                aria-label="Seek through song"
                disabled={!music.duration}
              />
              <span>{formatTime(music.duration)}</span>
            </label>
            <div className="player-controls">
              <button className="play" onClick={() => { sfx.play(on ? "stop" : "needle"); music.toggle(); }} aria-label={on ? "Pause" : "Play"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d={on ? "M7 4h4v16H7zM13 4h4v16h-4z" : "M7 4l13 8-13 8z"} />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
