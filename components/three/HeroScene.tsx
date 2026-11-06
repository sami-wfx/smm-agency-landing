"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { Fx30Rig } from "./Fx30Rig";

const LIME = "#b8ff3c";
const VIOLET = "#8b5cf6";

/** Нормализованная позиция курсора (−1…1) — слушаем окно, т.к. canvas не ловит события. */
function usePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      p.current.x = (e.clientX / innerWidth) * 2 - 1;
      p.current.y = -((e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return p;
}

/** Sony FX30 с объективом — реальные пропорции, реагирует на курсор и прокрутку. */
function CinemaCamera() {
  const root = useRef<THREE.Group>(null);
  const pointer = usePointer();
  const size = useThree((s) => s.size);
  const wide = size.width >= 768;

  useFrame((_, dt) => {
    const g = root.current;
    if (!g) return;
    const scroll = Math.min(window.scrollY / Math.max(innerHeight, 1), 2);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.75 + pointer.current.x * 0.45 + scroll * 1.1, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.1 - pointer.current.y * 0.18, 4, dt);
  });

  return (
    <group position={[wide ? 2.5 : 0, wide ? -0.55 : -0.1, 0]} scale={wide ? 0.55 : 0.7}>
      <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.55}>
        <group ref={root}>
          <Fx30Rig />
        </group>
      </Float>
      <ContactShadows position={[0, -1.6, 0]} opacity={0.55} scale={9} blur={2.6} far={3} color="#000000" />
    </group>
  );
}

export default function HeroScene({ active }: { active: boolean }) {
  const [dpr] = useState<[number, number]>(() => [1, Math.min(window.devicePixelRatio || 1, 1.75)]);
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      shadows={false}
      camera={{ position: [0, 0.6, 7.2], fov: 34 }}
      gl={{ antialias: !coarse, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={2.6} color="#ffffff" />
      <pointLight position={[-4, 1, 3]} intensity={7} color={VIOLET} distance={14} />
      <pointLight position={[4, -1, -3]} intensity={14} color={LIME} distance={12} />

      {/* студийное окружение из «софтбоксов» — без загрузки внешних HDR-файлов */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={5} position={[0, 5, 2]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={4} color={LIME} position={[5, 1, 0]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={1.6} color={VIOLET} position={[-5, 1, 1]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="ring" intensity={3} position={[0, 0, -6]} scale={6} />
        <Lightformer form="rect" intensity={2.5} position={[0, -3, 3]} scale={[8, 1.5, 1]} rotation-x={-Math.PI / 2} />
      </Environment>

      <CinemaCamera />
      <Sparkles count={coarse ? 24 : 60} scale={[11, 6, 6]} size={2.2} speed={0.35} opacity={0.7} color={LIME} />
      <Sparkles count={coarse ? 16 : 36} scale={[11, 6, 6]} size={2} speed={0.25} opacity={0.6} color={VIOLET} />
    </Canvas>
  );
}
