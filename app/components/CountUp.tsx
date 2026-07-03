"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a numeric value from 0 → target when it scrolls into view.
 * Accepts decorated strings like "200+", "4.8★", "-60%", "49€", "7 jours"
 * and preserves the non-numeric prefix/suffix around the animated number.
 */
export default function CountUp({
  value,
  className = "",
  duration = 1400,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^(\D*)([\d]+(?:[.,]\d+)?)(.*)$/);
    if (!match) return; // no number to animate — keep static

    const [, prefix, numStr, suffix] = match;
    const decimalSep = numStr.includes(",") ? "," : ".";
    const decimals = /[.,](\d+)/.exec(numStr)?.[1].length ?? 0;
    const target = parseFloat(numStr.replace(",", "."));

    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      return prefix + fixed.replace(".", decimalSep) + suffix;
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let start = 0;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(format(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (reducedMotion) {
          setDisplay(format(target));
          return;
        }
        setDisplay(format(0));
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
