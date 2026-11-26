import { asset } from "../art.js";

// The table: a clean linen plate + two photo layers (top flowers, bottom props).
// Each chapter gives the layers a new "camera pose" so they glide between chapters,
// while the whole table drifts slowly (Ken Burns) and a soft light sweeps across it.
const tf = ([x, y, s]) => `translate(${x}%, ${y}%) scale(${s})`;

export default function Background({ pose }) {
  return (
    <div className="bg" aria-hidden="true">
      <div className="linen" style={{ backgroundImage: `url(${asset("assets/linen.webp")})` }} />
      <div className="clwrap cl-top">
        <img className="cl" src={asset("assets/flowers-top.webp")} alt="" style={{ transform: tf(pose[0]) }} />
      </div>
      <div className="clwrap cl-bot">
        <img className="cl" src={asset("assets/flowers-bottom.webp")} alt="" style={{ transform: tf(pose[1]) }} />
      </div>
      <div className="light"><i /></div>
    </div>
  );
}
