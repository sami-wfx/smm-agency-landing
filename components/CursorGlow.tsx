"use client";

import { useEffect, useRef } from "react";

/** Свечение за курсором (только мышь, без reduced-motion). Без библиотек: rAF + transform. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add("active");
      kick();
    };
    const out = (e: PointerEvent) => !e.relatedTarget && el.classList.remove("active");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", out);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", out);
    };
  }, []);
  return <div id="cursor-glow" ref={ref} aria-hidden />;
}
