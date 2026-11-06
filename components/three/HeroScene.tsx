"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, RoundedBox, Sparkles } from "@react-three/drei";

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

/** Кинокамера в стиле Sony FX30 (компактная Cinema Line): корпус, байонет, объектив, ручка, экран. */
function CinemaCamera() {
  const root = useRef<THREE.Group>(null);
  const tally = useRef<THREE.MeshStandardMaterial>(null);
  const pointer = usePointer();
  const size = useThree((s) => s.size);
  const wide = size.width >= 768;

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const scroll = Math.min(window.scrollY / Math.max(innerHeight, 1), 2);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.7 + pointer.current.x * 0.45 + scroll * 1.1, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.08 - pointer.current.y * 0.18, 4, dt);
    if (tally.current) tally.current.emissiveIntensity = Math.sin(state.clock.elapsedTime * 3.2) > 0 ? 4 : 0.25;
  });

  const body = <meshPhysicalMaterial color="#34363f" metalness={0.75} roughness={0.34} clearcoat={0.6} clearcoatRoughness={0.25} envMapIntensity={1.4} />;
  const rubber = <meshStandardMaterial color="#1b1c20" metalness={0.3} roughness={0.55} envMapIntensity={1.2} />;
  const steel = <meshStandardMaterial color="#c9ccd2" metalness={1} roughness={0.22} />;
  const ring = (z: number, r = 0.6, h = 0.05) => (
    <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[r, r, h, 48]} />
      {rubber}
    </mesh>
  );

  return (
    <group position={[wide ? 2.35 : 0, wide ? -0.3 : -0.1, 0]} scale={wide ? 0.68 : 0.85}>
      <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.55}>
        <group ref={root}>
          {/* корпус */}
          <RoundedBox args={[2.3, 1.35, 1.5]} radius={0.14} smoothness={5} castShadow receiveShadow>
            {body}
          </RoundedBox>
          {/* верхняя ручка */}
          <mesh position={[0, 0.98, -0.05]} castShadow>
            <boxGeometry args={[1.7, 0.1, 0.22]} />
            {body}
          </mesh>
          {[-0.75, 0.75].map((x) => (
            <mesh key={x} position={[x, 0.82, -0.05]} castShadow>
              <boxGeometry args={[0.12, 0.34, 0.22]} />
              {body}
            </mesh>
          ))}
          {/* кнопки и диск на верхней панели */}
          <mesh position={[0.55, 0.7, 0.35]}>
            <cylinderGeometry args={[0.1, 0.1, 0.06, 24]} />
            <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={0.7} toneMapped={false} />
          </mesh>
          <mesh position={[0.2, 0.7, 0.35]}>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 24]} />
            {steel}
          </mesh>
          {/* индикатор записи */}
          <mesh position={[-0.85, 0.5, 0.76]}>
            <sphereGeometry args={[0.055, 20, 20]} />
            <meshStandardMaterial ref={tally} color="#ff2a2a" emissive="#ff1a1a" emissiveIntensity={3} toneMapped={false} />
          </mesh>
          {/* поворотный экран сбоку */}
          <group position={[1.2, 0.05, 0.05]} rotation={[0, 0.25, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.08, 0.95, 0.8]} />
              {body}
            </mesh>
            <mesh position={[0.045, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.7, 0.8]} />
              <meshStandardMaterial color="#1b1140" emissive={VIOLET} emissiveIntensity={0.9} roughness={0.2} toneMapped={false} />
            </mesh>
          </group>

          {/* байонет */}
          <mesh position={[0, 0, 0.82]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.66, 0.66, 0.18, 64]} />
            {steel}
          </mesh>
          {/* объектив */}
          <group position={[0, 0, 0.9]}>
            <mesh position={[0, 0, 0.75]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.56, 0.58, 1.5, 64]} />
              {rubber}
            </mesh>
            {[0.25, 0.4, 0.55, 0.7, 0.85, 1.0].map((z) => ring(z))}
            {/* фокусное кольцо с акцентом */}
            <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.6, 0.022, 16, 80]} />
              <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={1.1} toneMapped={false} />
            </mesh>
            {/* бленда */}
            <mesh position={[0, 0, 1.62]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.7, 0.62, 0.35, 64, 1, true]} />
              <meshStandardMaterial color="#09090b" metalness={0.3} roughness={0.8} side={THREE.DoubleSide} />
            </mesh>
            {/* линза */}
            <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 0.04, 64]} />
              <meshPhysicalMaterial
                color="#10102a"
                metalness={0.2}
                roughness={0.03}
                clearcoat={1}
                clearcoatRoughness={0}
                iridescence={1}
                iridescenceIOR={1.6}
                envMapIntensity={2.2}
              />
            </mesh>
            <mesh position={[0, 0, 1.52]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.02, 48]} />
              <meshStandardMaterial color="#020008" emissive={VIOLET} emissiveIntensity={0.12} roughness={0.1} toneMapped={false} />
            </mesh>
          </group>
        </group>
      </Float>

      <ContactShadows position={[0, -1.45, 0]} opacity={0.55} scale={9} blur={2.6} far={3} color="#000000" />
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
      <pointLight position={[-4, 1, 3]} intensity={18} color={VIOLET} distance={14} />
      <pointLight position={[4, -1, -3]} intensity={14} color={LIME} distance={12} />

      {/* студийное окружение из «софтбоксов» — без загрузки внешних HDR-файлов */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={5} position={[0, 5, 2]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={4} color={LIME} position={[5, 1, 0]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={4.5} color={VIOLET} position={[-5, 1, 1]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="ring" intensity={3} position={[0, 0, -6]} scale={6} />
        <Lightformer form="rect" intensity={2.5} position={[0, -3, 3]} scale={[8, 1.5, 1]} rotation-x={-Math.PI / 2} />
      </Environment>

      <CinemaCamera />
      <Sparkles count={coarse ? 24 : 60} scale={[11, 6, 6]} size={2.2} speed={0.35} opacity={0.7} color={LIME} />
      <Sparkles count={coarse ? 16 : 36} scale={[11, 6, 6]} size={2} speed={0.25} opacity={0.6} color={VIOLET} />
    </Canvas>
  );
}
