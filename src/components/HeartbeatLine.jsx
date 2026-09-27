// A heartbeat (ECG) trace for the hero background: the line draws itself in once,
// then a small pulse travels along it on a loop. Purely decorative.

// One heartbeat, 276px wide: P wave, QRS spike, T wave. Baseline sits at y=42 and the spike stays
// within y=22..62 so it clears the hero content even when the SVG is scaled up on wide screens.
const BEAT = 'h60 q10 -8 20 0 h14 l6 3 l12 -23 l14 40 l8 -20 h16 q18 -12 36 0 h90';
const PATH = `M0 42 ${BEAT} ${BEAT} ${BEAT} ${BEAT} h96`;

export default function HeartbeatLine() {
  return (
    <svg
      className="hero-ecg"
      viewBox="0 0 1200 84"
      preserveAspectRatio="xMinYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <path className="hero-ecg-base" d={PATH} pathLength="1000" />
      <path className="hero-ecg-pulse" d={PATH} pathLength="1000" />
    </svg>
  );
}
