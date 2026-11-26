const Arrow = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

// Floating glass dock: back · table grid · NEXT pill
export default function Dock({ hidden, atTable, nextName, busy, onBack, onGrid, onNext, canBack }) {
  return (
    <nav className={`dock ${hidden ? "hide" : ""}`} aria-label="Chapters">
      {!atTable && (
        <button className="ic" onClick={onBack} disabled={!canBack} aria-label="Previous chapter">
          <Arrow d="M19 12H5m6-6-6 6 6 6" />
        </button>
      )}
      <button className="ic" onClick={onGrid} aria-label="Open the table">
        <svg viewBox="0 0 24 24" fill="none" stroke="#a8506a" strokeWidth="1.8">
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
        </svg>
      </button>
      <button className={`next ${busy ? "busy" : ""}`} onClick={onNext}>
        <span><small>{atTable ? "CONTINUE" : "NEXT"}</small><b>{nextName}</b></span>
        <Arrow d="M5 12h14m-6-6 6 6-6 6" />
      </button>
    </nav>
  );
}
