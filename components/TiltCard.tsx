"use client";

import { useRef, type ReactNode } from "react";

/** Карточка с лёгким 3D-наклоном за курсором. Без библиотек: transform + CSS-transition (.tilt-wrap). */
export function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const set = (rx: number, ry: number) => {
    if (ref.current) ref.current.style.transform = rx || ry ? `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)` : "";
  };
  return (
    <div
      ref={ref}
      className="tilt-wrap"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        // «прожектор» следует за курсором внутри карточки (CSS .card::after)
        ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
        set((0.5 - (e.clientY - r.top) / r.height) * 8, ((e.clientX - r.left) / r.width - 0.5) * 8);
      }}
      onPointerLeave={() => set(0, 0)}
    >
      {children}
    </div>
  );
}
