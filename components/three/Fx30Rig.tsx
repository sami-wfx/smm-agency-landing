"use client";

import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";

const LIME = "#b8ff3c";
const VIOLET = "#8b5cf6";

/**
 * Процедурная модель по реальным размерам Sony FX30: 129.7 × 77.8 × 84.5 мм (2.6 × 1.56 × 1.69 ед.),
 * байонет Sony E, откидной экран, верхняя ручка. Рядом — стабилизатор в стиле DJI Ronin RS4.
 * Это не скан, а стилизованная модель без логотипов.
 */

function useScreenTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 576;
    const g = c.getContext("2d")!;
    const bg = g.createLinearGradient(0, 0, 0, 576);
    bg.addColorStop(0, "#1a1140");
    bg.addColorStop(1, "#07050f");
    g.fillStyle = bg;
    g.fillRect(0, 0, 512, 576);
    // сетка кадра
    g.strokeStyle = "rgba(255,255,255,.16)";
    g.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
      g.beginPath(); g.moveTo((512 / 3) * i, 0); g.lineTo((512 / 3) * i, 576); g.stroke();
      g.beginPath(); g.moveTo(0, (576 / 3) * i); g.lineTo(512, (576 / 3) * i); g.stroke();
    }
    g.fillStyle = "#ff2a2a"; g.beginPath(); g.arc(48, 52, 14, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.font = "bold 34px monospace"; g.fillText("REC", 74, 64);
    g.font = "28px monospace"; g.fillStyle = LIME; g.fillText("4K 120p", 330, 62);
    g.fillStyle = "rgba(255,255,255,.85)"; g.font = "26px monospace";
    g.fillText("S-Cinetone   ISO 800", 40, 530);
    // фокус-рамка
    g.strokeStyle = LIME; g.lineWidth = 5; g.strokeRect(190, 230, 132, 132);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);
}

export type Explode = MutableRefObject<number>;

type Props = {
  explode?: Explode;
  gimbal?: boolean;
  labels?: boolean;
};

const Label = ({ children }: { children: ReactNode }) => (
  <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
    <div className="whitespace-nowrap rounded-full border border-white/20 bg-black/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--lime)] backdrop-blur">
      {children}
    </div>
  </Html>
);

export function Fx30Rig({ explode, gimbal = false, labels = false }: Props) {
  const lens = useRef<THREE.Group>(null);
  const handle = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const tally = useRef<THREE.MeshStandardMaterial>(null);
  const screenTex = useScreenTexture();

  useFrame((state, dt) => {
    const e = explode?.current ?? 0;
    const k = 1 - Math.exp(-6 * dt);
    const lerpTo = (g: THREE.Group | null, axis: "x" | "y" | "z", v: number) => {
      if (g) g.position[axis] += (v - g.position[axis]) * k;
    };
    lerpTo(lens.current, "z", 0.92 + e * 2.1);
    lerpTo(handle.current, "y", 0.8 + e * 1.5);
    lerpTo(screen.current, "x", -1.3 - e * 1.7);
    lerpTo(rig.current, "y", -e * 1.4);
    if (tally.current) tally.current.emissiveIntensity = Math.sin(state.clock.elapsedTime * 3.2) > 0 ? 4 : 0.25;
  });

  const plastic = <meshPhysicalMaterial color="#26282e" metalness={0.55} roughness={0.42} clearcoat={0.5} clearcoatRoughness={0.3} envMapIntensity={1.3} />;
  const topPlate = <meshPhysicalMaterial color="#383a43" metalness={0.7} roughness={0.32} clearcoat={0.6} envMapIntensity={1.5} />;
  const rubber = <meshStandardMaterial color="#17181c" metalness={0.25} roughness={0.6} envMapIntensity={1.1} />;
  const steel = <meshStandardMaterial color="#cfd2d8" metalness={1} roughness={0.2} envMapIntensity={1.6} />;
  const accent = <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={1.1} toneMapped={false} />;
  const cyl = (r: number, h: number, z: number, mat: ReactNode, key?: string | number) => (
    <mesh key={key ?? z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[r, r, h, 56]} />
      {mat}
    </mesh>
  );

  return (
    <group>
      {/* ───────── корпус FX30 ───────── */}
      <group>
        <RoundedBox args={[2.6, 1.56, 1.69]} radius={0.12} smoothness={5} castShadow receiveShadow>
          {plastic}
        </RoundedBox>
        {/* верхняя панель и передний хват */}
        <RoundedBox args={[2.4, 0.08, 1.4]} radius={0.03} position={[0, 0.78, -0.05]}>{topPlate}</RoundedBox>
        <RoundedBox args={[0.75, 1.5, 0.4]} radius={0.14} smoothness={4} position={[1.0, -0.03, 0.95]} castShadow>{rubber}</RoundedBox>
        {/* байонет Sony E */}
        {cyl(0.68, 0.14, 0.86, steel)}
        {cyl(0.5, 0.16, 0.88, <meshStandardMaterial color="#050507" roughness={0.9} />)}
        {/* кнопки и диски сверху */}
        <mesh position={[-0.7, 0.85, 0.35]}><cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />{steel}</mesh>
        <mesh position={[-0.3, 0.84, 0.4]}><cylinderGeometry args={[0.09, 0.09, 0.06, 24]} />{accent}</mesh>
        <mesh position={[0.15, 0.84, 0.4]}><cylinderGeometry args={[0.07, 0.07, 0.06, 24]} />{steel}</mesh>
        {/* индикатор записи */}
        <mesh position={[0.95, 0.52, 1.16]}>
          <sphereGeometry args={[0.055, 20, 20]} />
          <meshStandardMaterial ref={tally} color="#ff2a2a" emissive="#ff1a1a" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        {/* порты сзади */}
        <mesh position={[-0.9, -0.1, -0.86]}><boxGeometry args={[0.5, 0.35, 0.04]} /><meshStandardMaterial color="#050507" /></mesh>
      </group>

      {/* ───────── верхняя ручка ───────── */}
      <group ref={handle} position={[0, 0.8, 0]}>
        <RoundedBox args={[0.9, 0.1, 1.2]} radius={0.03} position={[0, 0.03, -0.1]} castShadow>{topPlate}</RoundedBox>
        {[-0.45, 0.4].map((z) => (
          <RoundedBox key={z} args={[0.18, 0.4, 0.16]} radius={0.04} position={[0, 0.28, z]} castShadow>{plastic}</RoundedBox>
        ))}
        <RoundedBox args={[0.22, 0.14, 1.2]} radius={0.06} smoothness={4} position={[0, 0.5, -0.02]} castShadow>{rubber}</RoundedBox>
        <mesh position={[0, 0.58, 0.35]}><cylinderGeometry args={[0.05, 0.05, 0.04, 20]} />{accent}</mesh>
        {labels && <group position={[0, 0.9, 0]}><Label>Верхняя ручка · XLR</Label></group>}
      </group>

      {/* ───────── откидной экран ───────── */}
      <group ref={screen} position={[-1.3, 0, 0]} rotation={[0, 0.5, 0]}>
        <RoundedBox args={[0.09, 1.05, 1.0]} radius={0.03} castShadow>{plastic}</RoundedBox>
        <mesh position={[-0.052, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.9, 0.98]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>
        {labels && <group position={[-0.1, 0.8, 0]}><Label>Поворотный экран</Label></group>}
      </group>

      {/* ───────── объектив (E-mount, светосильный зум) ───────── */}
      <group ref={lens} position={[0, 0, 0.92]}>
        {cyl(0.56, 0.5, 0.3, rubber, "rear")}
        {cyl(0.6, 1.9, 1.15, <meshStandardMaterial color="#0e0f12" metalness={0.35} roughness={0.5} envMapIntensity={1.2} />, "barrel")}
        {/* кольцо зума с рифлением */}
        {Array.from({ length: 16 }, (_, i) => cyl(0.655, 0.035, 0.55 + i * 0.052, rubber, `z${i}`))}
        {/* кольцо фокуса */}
        {Array.from({ length: 11 }, (_, i) => cyl(0.64, 0.035, 1.5 + i * 0.05, rubber, `f${i}`))}
        {/* акцентная полоса */}
        <mesh position={[0, 0, 1.38]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.62, 0.014, 12, 90]} />{accent}</mesh>
        {/* передняя часть и бленда */}
        {cyl(0.66, 0.12, 2.12, steel, "ring")}
        <mesh position={[0, 0, 2.38]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.78, 0.68, 0.5, 64, 1, true]} />
          <meshStandardMaterial color="#08080a" metalness={0.3} roughness={0.75} side={THREE.DoubleSide} />
        </mesh>
        {/* линзы */}
        <mesh position={[0, 0, 2.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.05, 64]} />
          <meshPhysicalMaterial color="#0c0c26" metalness={0.25} roughness={0.02} clearcoat={1} clearcoatRoughness={0} iridescence={1} iridescenceIOR={1.7} envMapIntensity={2.4} />
        </mesh>
        <mesh position={[0, 0, 2.0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.03, 48]} />
          <meshPhysicalMaterial color="#120a30" emissive={VIOLET} emissiveIntensity={0.18} roughness={0.05} clearcoat={1} iridescence={1} />
        </mesh>
        {labels && <group position={[0, 0.95, 1.2]}><Label>Объектив E-mount</Label></group>}
      </group>

      {/* ───────── стабилизатор в стиле Ronin RS4 ───────── */}
      {gimbal && (
        <group ref={rig}>
          {/* пластина под камерой */}
          <RoundedBox args={[2.2, 0.1, 1.5]} radius={0.03} position={[0, -0.85, 0]} castShadow>{topPlate}</RoundedBox>
          {/* ось крена: рука вниз */}
          <RoundedBox args={[0.26, 0.9, 0.5]} radius={0.06} position={[0, -1.35, 0]} castShadow>{plastic}</RoundedBox>
          {/* мотор панорамы */}
          <mesh position={[0, -1.95, 0]} castShadow>
            <cylinderGeometry args={[0.46, 0.46, 0.5, 48]} />
            {plastic}
          </mesh>
          <mesh position={[0, -1.7, 0]}><torusGeometry args={[0.46, 0.02, 12, 64]} rotation-x={Math.PI / 2} />{accent}</mesh>
          {/* ярмо наклона: рычаг и два мотора по бокам камеры */}
          <RoundedBox args={[3.5, 0.18, 0.3]} radius={0.05} position={[0, -1.2, -0.5]} castShadow>{plastic}</RoundedBox>
          {[-1.72, 1.72].map((x) => (
            <group key={x}>
              <RoundedBox args={[0.18, 1.05, 0.3]} radius={0.05} position={[x, -0.7, -0.5]} castShadow>{plastic}</RoundedBox>
              <mesh position={[x, -0.05, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.34, 0.34, 0.3, 40]} />
                {plastic}
              </mesh>
              <mesh position={[x + (x < 0 ? -0.16 : 0.16), -0.05, -0.1]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
                {accent}
              </mesh>
            </group>
          ))}
          {/* рукоять */}
          <mesh position={[0, -3.1, 0]} castShadow>
            <capsuleGeometry args={[0.26, 1.7, 12, 24]} />
            {rubber}
          </mesh>
          <mesh position={[0, -2.45, 0.28]}><boxGeometry args={[0.16, 0.34, 0.1]} />{steel}</mesh>
          <mesh position={[0, -2.2, 0.3]}><sphereGeometry args={[0.07, 16, 16]} />{accent}</mesh>
          {labels && <group position={[0.9, -3.0, 0]}><Label>Ronin RS4 · 3 оси</Label></group>}
        </group>
      )}
    </group>
  );
}
