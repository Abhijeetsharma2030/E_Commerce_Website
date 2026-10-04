"use client";

import { useEffect, useRef, useState } from "react";

export function useInView({ rootMargin = "400px", enabled = true } = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) {
      setIsInView(false);
      return;
    }

    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [enabled, rootMargin]);

  return [ref, isInView];
}
