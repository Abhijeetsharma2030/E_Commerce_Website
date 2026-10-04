"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

import { formatPrice } from "@/lib/utils";

export function CountUp({ value, currency = false, duration = 1.2 }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);

  const format = currency
    ? (n) => formatPrice(n)
    : (n) => Math.round(n).toLocaleString();

  useEffect(() => {
    const controls = animate(motionValue, value, { duration, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  useMotionValueEvent(motionValue, "change", (latest) => {
    if (ref.current) ref.current.textContent = format(latest);
  });

  return <span ref={ref}>{format(0)}</span>;
}
