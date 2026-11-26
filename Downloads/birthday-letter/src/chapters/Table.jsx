import Art from "../components/Art.jsx";
import { asset, ICONS } from "../art.js";
import { st } from "./_shared.js";
import { sfx } from "../sound.js";

export default function Table({ C, go, chapters }) {
  return (
    <>
      <p className="eyebrow s" style={st(0)}>For you</p>
      <h2 className="title s" style={st(1)}>Everything on this table is yours</h2>
      <div className="grid">
        {chapters.slice(1, -1).map((c, k) => (
          <button key={c.id} className="obj s" style={st(k + 2)} onClick={() => { sfx.play("wood", k); go(k + 1); }}>
            {c.id === "love" ? (
              <span className="icon-bouquet">
                <img src={asset("assets/rose-pink.webp")} alt="" />
                <img src={asset("assets/rose.webp")} alt="" />
                <img src={asset("assets/rose-red.webp")} alt="" />
              </span>
            ) : (
              <Art as="span" className="icon" html={ICONS[c.id](C)} />
            )}
            <span>{c.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
