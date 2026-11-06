"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

// Three.js грузим только в браузере и отдельным чанком — первый экран не ждёт 3D.
const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Контейнер 3D-сцены: рисует только когда виден на экране, и только если есть WebGL. */
export function HeroCanvas() {
  const box = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setOk(!matchMedia("(prefers-reduced-motion: reduce)").matches && hasWebGL());
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      aria-hidden
      className="hero-3d pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[300px] md:inset-0 md:h-auto"
    >
      {ok && (
        <Boundary>
          <HeroScene active={visible} />
        </Boundary>
      )}
    </div>
  );
}
