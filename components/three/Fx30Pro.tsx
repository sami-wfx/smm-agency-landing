"use client";

import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useGrainTexture, useRearTexture } from "./Fx30Rig";

/**
 * Sony FX30 с объективом E-mount — детализированная версия (для телефонной версии блока «Оборудование»).
 * Размеры по спецификации: 129.7 × 77.8 × 84.5 мм (1 ед. = 50 мм). Модель собрана вручную, это не скан и без логотипов.
 * «Живое»: экран показывает работающий интерфейс записи (таймкод, REC, рамка фокуса, уровни звука),
 * мигает индикатор записи.
 */
const LIME = "#b8ff3c";

/** Экран камеры, который перерисовывается ~15 раз в секунду. */
function useLiveLcd() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 440;
    const g = c.getContext("2d")!;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const clock = { last: -1 };
    const draw = (t: number) => {
      if (t - clock.last < 0.066) return;
      clock.last = t;
      const bg = g.createLinearGradient(0, 0, 640, 440);
      bg.addColorStop(0, "#1c2a52");
      bg.addColorStop(0.55, "#2a1d52");
      bg.addColorStop(1, "#0a0912");
      g.fillStyle = bg;
      g.fillRect(0, 0, 640, 440);
      // «сцена» в кадре: плывущие полосы света
      for (let i = 0; i < 3; i++) {
        const x = ((t * 28 * (i + 1) + i * 220) % 900) - 130;
        const gr = g.createLinearGradient(x, 0, x + 120, 0);
        gr.addColorStop(0, "rgba(255,255,255,0)");
        gr.addColorStop(0.5, "rgba(255,255,255,.07)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(x, 0, 120, 440);
      }
      // сетка третей
      g.strokeStyle = "rgba(255,255,255,.16)";
      g.lineWidth = 2;
      for (let i = 1; i < 3; i++) {
        g.beginPath(); g.moveTo((640 / 3) * i, 0); g.lineTo((640 / 3) * i, 440); g.stroke();
        g.beginPath(); g.moveTo(0, (440 / 3) * i); g.lineTo(640, (440 / 3) * i); g.stroke();
      }
      // REC + таймкод
      const rec = Math.floor(t * 1.2) % 2 === 0;
      g.fillStyle = rec ? "#ff2a2a" : "rgba(255,42,42,.25)";
      g.beginPath(); g.arc(46, 46, 13, 0, 7); g.fill();
      g.fillStyle = "#fff"; g.font = "bold 30px monospace"; g.fillText("REC", 68, 57);
      const s = Math.floor(t), f = Math.floor((t % 1) * 24);
      const p = (n: number) => String(n).padStart(2, "0");
      g.font = "26px monospace"; g.fillStyle = "rgba(255,255,255,.85)";
      g.fillText(`00:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(f)}`, 150, 57);
      g.fillStyle = LIME; g.font = "bold 26px monospace"; g.fillText("4K 120p", 480, 57);
      // рамка фокуса «охотится»
      const fx = 320 + Math.sin(t * 0.9) * 46, fy = 215 + Math.cos(t * 0.7) * 24;
      g.strokeStyle = LIME; g.lineWidth = 4; g.strokeRect(fx - 55, fy - 48, 110, 96);
      // уровни звука
      for (let i = 0; i < 2; i++) {
        const v = 0.35 + 0.35 * Math.abs(Math.sin(t * (3 + i) + i));
        g.fillStyle = "rgba(255,255,255,.2)"; g.fillRect(40, 340 + i * 16, 150, 8);
        g.fillStyle = v > 0.62 ? "#ffb400" : LIME; g.fillRect(40, 340 + i * 16, 150 * v, 8);
      }
      g.fillStyle = "rgba(255,255,255,.85)"; g.font = "22px monospace";
      g.fillText("S-Cinetone  ISO 800  1/240  F2.8", 200, 392);
      tex.needsUpdate = true;
    };
    return { tex, draw };
  }, []);
}

type Props = { children?: ReactNode };

export function Fx30Pro({ children }: Props) {
  const tally = useRef<THREE.MeshStandardMaterial>(null);
  const grain = useGrainTexture(3);
  const leather = useGrainTexture(8);
  const rear = useRearTexture();
  const lcd = useLiveLcd();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    lcd.draw(t);
    if (tally.current) tally.current.emissiveIntensity = Math.sin(t * 3.2) > 0 ? 3.5 : 0.3;
  });

  const body = <meshStandardMaterial color="#42434b" metalness={0.35} roughness={0.7} bumpMap={grain} bumpScale={0.6} envMapIntensity={1.2} />;
  const skin = <meshStandardMaterial color="#26272c" metalness={0.1} roughness={0.92} bumpMap={leather} bumpScale={1.6} envMapIntensity={0.8} />;
  const black = <meshStandardMaterial color="#202127" metalness={0.45} roughness={0.5} envMapIntensity={1.5} />;
  const steel = <meshStandardMaterial color="#cfd2d8" metalness={1} roughness={0.2} envMapIntensity={1.6} />;
  const rubber = <meshStandardMaterial color="#101114" metalness={0.15} roughness={0.8} bumpMap={leather} bumpScale={1.2} envMapIntensity={0.9} />;
  const ring = (r: number, h: number, z: number, mat: ReactNode, k: string | number) => (
    <mesh key={k} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[r, r, h, 72]} />
      {mat}
    </mesh>
  );

  return (
    <group>
      {/* ───── корпус ───── */}
      <RoundedBox args={[2.6, 1.56, 1.2]} radius={0.09} smoothness={5} position={[0, 0, -0.05]} castShadow receiveShadow>{body}</RoundedBox>
      <RoundedBox args={[0.78, 1.56, 0.5]} radius={0.16} smoothness={5} position={[-0.92, 0, 0.8]} castShadow>{skin}</RoundedBox>
      <RoundedBox args={[0.5, 1.2, 0.2]} radius={0.1} smoothness={4} position={[-0.88, -0.05, 1.1]}>{skin}</RoundedBox>
      <RoundedBox args={[1.82, 1.54, 0.06]} radius={0.04} position={[0.39, 0, 0.58]}>
        <meshStandardMaterial color="#3c3d44" metalness={0.45} roughness={0.6} bumpMap={grain} bumpScale={0.4} envMapIntensity={1.2} />
      </RoundedBox>
      {/* кнопка REC и индикатор записи */}
      <mesh position={[1.0, -0.52, 0.63]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />{black}</mesh>
      <mesh position={[1.0, -0.52, 0.66]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.012, 12, 40]} /><meshStandardMaterial color="#ff3030" emissive="#ff2020" emissiveIntensity={1.2} toneMapped={false} /></mesh>
      <mesh position={[-0.42, 0.52, 0.62]}><sphereGeometry args={[0.05, 20, 20]} /><meshStandardMaterial ref={tally} color="#ff2a2a" emissive="#ff1a1a" emissiveIntensity={3} toneMapped={false} /></mesh>
      {/* верх: башмак, диск режимов, кнопки */}
      <RoundedBox args={[0.62, 0.08, 0.5]} radius={0.02} position={[0.1, 0.8, -0.3]}>{black}</RoundedBox>
      <mesh position={[0.1, 0.845, -0.3]}><boxGeometry args={[0.44, 0.02, 0.34]} />{steel}</mesh>
      <mesh position={[-0.9, 0.84, 0.2]}><cylinderGeometry args={[0.2, 0.2, 0.1, 48]} />{black}</mesh>
      {Array.from({ length: 24 }, (_, i) => (
        <mesh key={i} position={[-0.9 + Math.cos((i / 24) * 6.2832) * 0.2, 0.84, 0.2 + Math.sin((i / 24) * 6.2832) * 0.2]} rotation={[0, -(i / 24) * 6.2832, 0]}>
          <boxGeometry args={[0.012, 0.1, 0.02]} />{steel}
        </mesh>
      ))}
      <mesh position={[-0.9, 0.9, 0.2]}><cylinderGeometry args={[0.13, 0.13, 0.03, 32]} />{steel}</mesh>
      <mesh position={[-0.35, 0.8, 0.0]}><cylinderGeometry args={[0.075, 0.075, 0.07, 24]} /><meshStandardMaterial color="#c43030" roughness={0.5} /></mesh>
      <mesh position={[0.65, 0.8, -0.1]}><cylinderGeometry args={[0.06, 0.06, 0.05, 20]} />{black}</mesh>
      {/* решётки микрофона на верхней панели */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0.45 + (i % 4) * 0.07, 0.805, 0.25 + Math.floor(i / 4) * 0.07]}><cylinderGeometry args={[0.018, 0.018, 0.02, 12]} /><meshStandardMaterial color="#050507" /></mesh>
      ))}
      {/* бок: прорези, проушины ремня, резиновые заглушки портов */}
      {Array.from({ length: 6 }, (_, i) => (<mesh key={i} position={[1.301, 0.12 - i * 0.09, -0.1]}><boxGeometry args={[0.02, 0.04, 0.5]} /><meshStandardMaterial color="#060607" /></mesh>))}
      <mesh position={[1.31, 0.62, 0.35]}><torusGeometry args={[0.07, 0.022, 10, 24]} />{steel}</mesh>
      <mesh position={[-1.31, 0.62, 0.35]}><torusGeometry args={[0.07, 0.022, 10, 24]} />{steel}</mesh>
      <RoundedBox args={[0.04, 0.5, 0.5]} radius={0.02} position={[1.31, -0.25, -0.25]}>{rubber}</RoundedBox>
      {/* задняя стенка и откидной экран с живым интерфейсом */}
      <mesh position={[0, 0, -0.652]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.54, 1.5]} />
        <meshStandardMaterial map={rear} roughness={0.7} metalness={0.15} />
      </mesh>
      <group position={[0.4, -0.25, -0.68]}>
        <RoundedBox args={[1.6, 1.08, 0.08]} radius={0.04} castShadow>{black}</RoundedBox>
        <mesh position={[0, 0, -0.042]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.5, 1.0]} />
          <meshBasicMaterial map={lcd.tex} toneMapped={false} />
        </mesh>
      </group>

      {/* ───── светосильный зум E-mount (G Master-класса) ───── */}
      <group position={[0, 0, 0.6]}>
        {ring(0.64, 0.14, 0.04, steel, "mount")}
        {ring(0.655, 0.03, 0.14, <meshStandardMaterial color="#c8261e" roughness={0.4} metalness={0.6} />, "red")}
        {ring(0.62, 0.45, 0.4, black, "rear")}
        {/* кольцо зума — широкое, с рифлением и резиной */}
        {ring(0.74, 0.62, 0.95, rubber, "zoomring")}
        {Array.from({ length: 28 }, (_, i) => ring(0.752, 0.014, 0.66 + i * 0.022, black, `zr${i}`))}
        {/* неподвижная часть и золотая полоса */}
        {ring(0.7, 0.14, 1.36, black, "gap")}
        {ring(0.705, 0.03, 1.43, <meshStandardMaterial color="#c9a24a" metalness={1} roughness={0.28} />, "gold")}
        {/* кольцо фокуса */}
        {ring(0.72, 0.42, 1.68, rubber, "focus")}
        {Array.from({ length: 18 }, (_, i) => ring(0.732, 0.014, 1.5 + i * 0.022, black, `fr${i}`))}
        {/* переключатели на боку */}
        <RoundedBox args={[0.22, 0.1, 0.34]} radius={0.03} position={[0.7, 0.2, 1.38]}>{black}</RoundedBox>
        <mesh position={[0.78, 0.2, 1.38]}><boxGeometry args={[0.04, 0.05, 0.1]} />{steel}</mesh>
        <RoundedBox args={[0.16, 0.12, 0.18]} radius={0.03} position={[0.72, -0.12, 1.2]}>{black}</RoundedBox>
        {/* передняя часть, бленда */}
        {/* передний тубус — полый, чтобы внутри были видны линзы */}
        <mesh position={[0, 0, 2.0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.22, 72, 1, true]} />
          <meshStandardMaterial color="#1d1e23" metalness={0.45} roughness={0.5} side={THREE.DoubleSide} envMapIntensity={1.3} />
        </mesh>
        <mesh position={[0, 0, 1.78]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.5, 64, 1, true]} />
          <meshStandardMaterial color="#030306" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 2.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.92, 0.7, 0.7, 72, 1, true]} />
          <meshStandardMaterial color="#0a0a0c" metalness={0.3} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 2.2]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.66, 0.7, 72]} />{steel}</mesh>
        {/* линзы с просветлением */}
        {/* выпуклая передняя линза с переливами просветляющего покрытия */}
        <mesh position={[0, 0, 1.78]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.42, 1]}>
          <sphereGeometry args={[0.6, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshPhysicalMaterial color="#0a0d24" roughness={0.02} metalness={0.35} clearcoat={1} clearcoatRoughness={0.02} iridescence={1} iridescenceIOR={1.9} iridescenceThicknessRange={[200, 700]} envMapIntensity={3.2} />
        </mesh>
        {([[0.5, "#3cffb0", 0.8], [0.4, "#8b5cf6", 1.0], [0.3, "#ffb400", 0.7], [0.2, "#2a7bff", 0.9]] as const).map(([r, c, i], k) => (
          <mesh key={k} position={[0, 0, 1.83 + k * 0.012]}><torusGeometry args={[r, 0.008, 8, 80]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={i * 0.5} toneMapped={false} transparent opacity={0.75} /></mesh>
        ))}
        <mesh position={[0, 0, 1.62]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.44, 0.44, 0.03, 64]} /><meshPhysicalMaterial color="#14103a" roughness={0.04} metalness={0.6} clearcoat={1} iridescence={1} iridescenceIOR={1.6} envMapIntensity={1.5} /></mesh>
        <mesh position={[0, 0, 1.36]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.26, 0.26, 0.03, 48]} /><meshPhysicalMaterial color="#1a1450" roughness={0.04} metalness={0.6} clearcoat={1} envMapIntensity={1.5} /></mesh>
        <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02, 32]} /><meshStandardMaterial color="#6a3cff" emissive="#6a3cff" emissiveIntensity={0.4} toneMapped={false} /></mesh>
      </group>
      {children}
    </group>
  );
}
