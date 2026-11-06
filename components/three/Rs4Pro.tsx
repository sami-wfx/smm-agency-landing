"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

/**
 * Стабилизатор в стиле DJI Ronin RS 4 Pro: матово-чёрные карбоновые рычаги, дуга с красной вставкой и надписью RONIN
 * над камерой, круглые моторы осей, горизонтальная пластина под камерой, отдельная рукоять со спуском и джойстиком.
 * Модель стилизованная (не точный CAD). Координаты — относительно центра камеры FX30 (низ камеры y = −0.78).
 * «Живое»: рукоять плавно покачивается, а камера остаётся ровной — так работает стабилизация.
 */
function useCarbon() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    g.fillStyle = "#0e0f12";
    g.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++) {
        g.fillStyle = (x + y) % 2 ? "#17181d" : "#0a0b0d";
        g.fillRect(x * 8, y * 8, 8, 8);
        g.fillStyle = "rgba(255,255,255,.05)";
        g.fillRect(x * 8, y * 8 + ((x + y) % 2 ? 0 : 4), 8, 1);
      }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 5);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function useBrandTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 128;
    const g = c.getContext("2d")!;
    g.fillStyle = "#0b0b0d";
    g.fillRect(0, 0, 1024, 128);
    // красная вставка-клин
    g.fillStyle = "#d8261f";
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(230, 0); g.lineTo(150, 128); g.lineTo(0, 128);
    g.fill();
    g.fillStyle = "#fff";
    g.font = "800 66px 'Unbounded', 'Arial Black', sans-serif";
    g.textBaseline = "middle";
    g.fillText("RONIN", 300, 66);
    g.fillStyle = "rgba(255,255,255,.55)";
    g.font = "600 30px monospace";
    g.fillText("RS 4 PRO", 690, 68);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
}


const MAT = {
  arm: <meshStandardMaterial color="#1a1b20" metalness={0.55} roughness={0.38} envMapIntensity={1.5} />,
  matte: <meshStandardMaterial color="#17181c" metalness={0.5} roughness={0.5} envMapIntensity={1.3} />,
  rubber: <meshStandardMaterial color="#0e0f12" metalness={0.1} roughness={0.9} envMapIntensity={0.8} />,
  steel: <meshStandardMaterial color="#cdd0d6" metalness={1} roughness={0.22} envMapIntensity={1.6} />,
};

/** Круглый мотор: корпус, рифлёное кольцо, проточки, торцевая крышка. */
function Motor({ axis, r, h, pos }: { axis: "x" | "y" | "z"; r: number; h: number; pos: [number, number, number] }) {
  const rot: [number, number, number] = axis === "x" ? [0, 0, Math.PI / 2] : axis === "z" ? [Math.PI / 2, 0, 0] : [0, 0, 0];
  return (
    <group position={pos} rotation={rot}>
      <mesh castShadow><cylinderGeometry args={[r, r, h, 64]} />{MAT.matte}</mesh>
      <mesh position={[0, h * 0.18, 0]}><cylinderGeometry args={[r * 1.04, r * 1.04, h * 0.22, 64]} />{MAT.rubber}</mesh>
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} position={[0, -h * 0.5 + 0.04 + i * 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.012, 8, 64]} />{MAT.steel}</mesh>
      ))}
      <mesh position={[0, h * 0.5 + 0.005, 0]}><cylinderGeometry args={[r * 0.7, r * 0.7, 0.03, 48]} />{MAT.arm}</mesh>
      <mesh position={[0, h * 0.5 + 0.03, 0]}><cylinderGeometry args={[r * 0.16, r * 0.16, 0.04, 24]} />{MAT.steel}</mesh>
    </group>
  );
}

export function Rs4Pro({ sway = true }: { sway?: boolean }) {
  const handle = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const carbon = useCarbon();
  const brand = useBrandTexture();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (handle.current && sway) {
      handle.current.rotation.z = Math.sin(t * 0.9) * 0.1;
      handle.current.rotation.x = Math.sin(t * 0.65 + 1) * 0.07;
    }
    if (led.current) led.current.emissiveIntensity = 1.2 + Math.sin(t * 2.4) * 0.9;
  });

  const arm = <meshStandardMaterial color="#3a3c46" map={carbon} metalness={0.55} roughness={0.36} envMapIntensity={1.7} />;
  const matte = <meshStandardMaterial color="#2a2c33" metalness={0.5} roughness={0.46} envMapIntensity={1.5} />;
  const rubber = <meshStandardMaterial color="#0e0f12" metalness={0.1} roughness={0.9} envMapIntensity={0.8} />;
  const steel = <meshStandardMaterial color="#cdd0d6" metalness={1} roughness={0.22} envMapIntensity={1.6} />;
  const red = <meshStandardMaterial color="#d8261f" metalness={0.4} roughness={0.45} />;

  return (
    <group>
      {/* пластина под камерой с замками */}
      <RoundedBox args={[2.7, 0.15, 1.5]} radius={0.04} position={[0, -0.86, 0]} castShadow>{matte}</RoundedBox>
      <mesh position={[0, -0.775, 0]}><boxGeometry args={[2.3, 0.02, 1.1]} />{rubber}</mesh>
      {[-1.0, 1.0].map((x) => (
        <mesh key={x} position={[x, -0.86, 0.78]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.1, 24]} />{steel}</mesh>
      ))}
      <RoundedBox args={[0.5, 0.06, 0.2]} radius={0.02} position={[0, -0.86, 0.84]}>{red}</RoundedBox>

      {/* центральная ось (пан) под пластиной и нижний рычаг к колонне */}
      <RoundedBox args={[0.5, 0.5, 0.42]} radius={0.06} position={[0, -1.1, -0.1]}>{matte}</RoundedBox>
      <Motor axis="y" r={0.46} h={0.62} pos={[0, -1.55, -0.1]} />
      <RoundedBox args={[1.7, 0.3, 0.38]} radius={0.05} position={[-0.8, -1.35, -0.1]} castShadow>{arm}</RoundedBox>

      {/* колонна слева, дуга над камерой, спуск справа к мотору наклона */}
      <RoundedBox args={[0.3, 2.95, 0.38]} radius={0.06} position={[-1.62, 0.06, -0.1]} castShadow>{arm}</RoundedBox>
      <RoundedBox args={[3.56, 0.34, 0.4]} radius={0.07} position={[0, 1.46, -0.1]} castShadow>{arm}</RoundedBox>
      <mesh position={[0, 1.46, 0.102]}>
        <planeGeometry args={[3.0, 0.3]} />
        <meshStandardMaterial map={brand} metalness={0.3} roughness={0.5} />
      </mesh>
      <RoundedBox args={[0.3, 1.6, 0.38]} radius={0.06} position={[1.62, 0.66, -0.1]} castShadow>{arm}</RoundedBox>
      <Motor axis="x" r={0.5} h={0.4} pos={[1.52, -0.12, -0.1]} />
      <mesh position={[1.34, -0.12, -0.1]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.14, 0.14, 0.12, 24]} />{steel}</mesh>
      {/* мотор крена на левой колонне (внизу) */}
      <Motor axis="x" r={0.4} h={0.3} pos={[-1.62, -1.45, -0.1]} />

      {/* рукоять: покачивается, пока камера остаётся ровной */}
      <group ref={handle} position={[0, -1.95, -0.1]}>
        <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.3, 0.34, 0.2, 40]} />{matte}</mesh>
        <mesh position={[0, -1.05, 0]} castShadow><capsuleGeometry args={[0.27, 1.45, 14, 28]} />{rubber}</mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[0, -0.55 - i * 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.272, 0.012, 8, 40]} />{matte}</mesh>
        ))}
        {/* спуск, джойстик, экран и диск на верхней части */}
        <RoundedBox args={[0.14, 0.36, 0.1]} radius={0.04} position={[0, -0.42, 0.3]}>{matte}</RoundedBox>
        <mesh position={[0, -0.28, -0.26]}><cylinderGeometry args={[0.07, 0.07, 0.07, 24]} />{steel}</mesh>
        <mesh position={[0.2, -0.3, 0.12]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.05, 24]} />{matte}</mesh>
        <mesh position={[0, -0.4, -0.285]}>
          <planeGeometry args={[0.32, 0.22]} />
          <meshStandardMaterial ref={led} color="#06141a" emissive="#37d7ff" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        <mesh position={[0, -2.0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.14, 40]} />{matte}</mesh>
      </group>
    </group>
  );
}
