import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Animates a number from its current value up to `end`.
 * If `end` changes later (e.g. data finishes loading) it continues smoothly from where it is.
 *
 *   <CountUp end={12} suffix="k+" />
 *   <CountUp end={4.7} decimals={1} suffix="★" />
 */
export default function CountUp({ end, duration = 900, delay = 0, decimals = 0, prefix = '', suffix = '', className }) {
  const reduced = useReducedMotion();
  const target = Number(end);
  const safeTarget = Number.isFinite(target) ? target : 0;

  const [value, setValue] = useState(reduced ? safeTarget : 0);
  const currentRef = useRef(reduced ? safeTarget : 0);

  useEffect(() => {
    if (reduced) {
      currentRef.current = safeTarget;
      setValue(safeTarget);
      return undefined;
    }

    const from = currentRef.current;
    if (from === safeTarget) {
      setValue(safeTarget);
      return undefined;
    }

    let raf;
    let startTime;
    const step = (now) => {
      if (startTime === undefined) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const next = from + (safeTarget - from) * easeOutCubic(progress);
      currentRef.current = next;
      setValue(next);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(step); }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [safeTarget, duration, delay, reduced]);

  const shown = decimals > 0 ? value.toFixed(decimals) : Math.round(value);
  return <span className={className}>{prefix}{shown}{suffix}</span>;
}
