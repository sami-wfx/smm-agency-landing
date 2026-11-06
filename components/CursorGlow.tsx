"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** Свечение за курсором (только мышь, без reduced-motion). */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    gsap.set(el, { x: innerWidth / 2, y: innerHeight / 2 });
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.classList.add("active");
    };
    const out = (e: PointerEvent) => !e.relatedTarget && el.classList.remove("active");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerout", out);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", out);
    };
  }, []);
  return <div id="cursor-glow" ref={ref} aria-hidden />;
}
