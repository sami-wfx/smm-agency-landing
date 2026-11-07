"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Монтирует тяжёлый блок, когда он приближается к экрану (за `margin` до него). До этого — пустой каркас той же высоты. */
export function LazyOnView({ children, className, margin = "900px" }: { children: () => ReactNode; className?: string; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (!("IntersectionObserver" in window)) {
      const id = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, margin]);
  return (
    <div ref={ref} className={className}>
      {show ? children() : null}
    </div>
  );
}
