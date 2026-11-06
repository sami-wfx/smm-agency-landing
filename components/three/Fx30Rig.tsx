"use client";

import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";

const LIME = "#b8ff3c";

/**
 * Модель Sony FX30, собранная по реальным фото и размерам (129.7 × 77.8 × 84.5 мм; 1 ед. = 50 мм):
 * компактный корпус без верхней ручки, текстурный хват, байонет Sony E, мультиинтерфейсный башмак,
 * кнопка REC на передней панели, большой откидной экран и колёса/кнопки на задней стенке.
 * Рядом — стабилизатор в стиле DJI Ronin RS4. Это процедурная модель, не скан; логотипов нет.
 */

const W = 2.6;
const H = 1.56;

/** Мелкое «зерно» для матового корпуса и кожзама на хвате. */
function useGrainTexture(scale: number) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    g.fillStyle = "#808080";
    g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 2600; i++) {
      const v = 90 + Math.random() * 110;
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(scale, scale);
    return t;
  }, [scale]);
}

/** Задняя стенка: расположение кнопок и колёс снято с фото реальной камеры (вид сзади). */
function useRearTexture() {
  return useMemo(() => {
    const cw = 1280;
    const ch = Math.round((cw * H) / W);
    const c = document.createElement("canvas");
    c.width = cw;
    c.height = ch;
    const g = c.getContext("2d")!;
    const U = (u: number) => u * cw;
    const V = (v: number) => v * ch;
    g.fillStyle = "#222327";
    g.fillRect(0, 0, cw, ch);
    for (let i = 0; i < 9000; i++) {
      const v = 25 + Math.random() * 28;
      g.fillStyle = `rgb(${v},${v},${v + 2})`;
      g.fillRect(Math.random() * cw, Math.random() * ch, 2, 2);
    }
    const label = (t: string, u: number, v: number, size = 15, a = 0.85) => {
      g.save();
      g.fillStyle = `rgba(255,255,255,${a})`;
      g.font = `600 ${size}px system-ui, sans-serif`;
      g.textAlign = "center";
      g.fillText(t, U(u), V(v));
      g.restore();
    };
    const pill = (u: number, v: number, w: number, h: number, txt: string) => {
      g.fillStyle = "#101114";
      g.beginPath();
      g.roundRect(U(u) - w / 2, V(v) - h / 2, w, h, h / 2.4);
      g.fill();
      g.strokeStyle = "rgba(255,255,255,.12)";
      g.lineWidth = 2;
      g.stroke();
      label(txt, u, V(v) / ch + 5 / ch, 17, 0.9);
    };
    const knob = (u: number, v: number, r: number, txt?: string) => {
      g.fillStyle = "#0d0e10";
      g.beginPath(); g.arc(U(u), V(v), r, 0, 7); g.fill();
      g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 2; g.stroke();
      if (txt) label(txt, u, (V(v) + 6) / ch, 20, 0.95);
    };

    label("Cinema Line  FX30", 0.13, 0.085, 17, 0.6);
    // переключатель питания, MODE, индикатор, MENU
    g.fillStyle = "#0d0e10"; g.beginPath(); g.roundRect(U(0.08), V(0.185), 150, 56, 28); g.fill();
    g.fillStyle = "#cfd0d4"; g.beginPath(); g.roundRect(U(0.115), V(0.2), 40, 28, 8); g.fill();
    pill(0.25, 0.23, 110, 54, "MODE");
    g.fillStyle = "rgba(255,255,255,.28)"; g.fillRect(U(0.36), V(0.225), 190, 7);
    pill(0.55, 0.23, 110, 54, "MENU");
    // большое колесо
    g.fillStyle = "#0b0b0d"; g.beginPath(); g.roundRect(U(0.67), V(0.15), 150, 64, 14); g.fill();
    for (let i = 0; i < 28; i++) { g.fillStyle = "rgba(255,255,255,.14)"; g.fillRect(U(0.67) + 8 + i * 5, V(0.15) + 8, 2, 48); }
    // кнопки справа
    knob(0.76, 0.365, 28, "5"); label("FOCUS MAG", 0.76, 0.30, 14);
    knob(0.76, 0.5, 28, "Fn");
    // контроллер
    g.fillStyle = "#0d0e10"; g.beginPath(); g.arc(U(0.79), V(0.69), 98, 0, 7); g.fill();
    g.strokeStyle = "rgba(255,255,255,.16)"; g.lineWidth = 3; g.stroke();
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      g.strokeStyle = "rgba(255,255,255,.25)"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(U(0.79) + Math.cos(a) * 52, V(0.69) + Math.sin(a) * 52); g.lineTo(U(0.79) + Math.cos(a) * 66, V(0.69) + Math.sin(a) * 66); g.stroke();
    }
    g.fillStyle = "#17181b"; g.beginPath(); g.arc(U(0.79), V(0.69), 38, 0, 7); g.fill();
    label("DISP", 0.79, 0.585, 14); label("SHUTTER", 0.79, 0.805, 14);
    label("ZEBRA", 0.715, 0.7, 13); label("PEAKING", 0.865, 0.7, 13);
    knob(0.74, 0.88, 26); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(U(0.733), V(0.862)); g.lineTo(U(0.733), V(0.898)); g.lineTo(U(0.755), V(0.88)); g.fill();
    knob(0.835, 0.88, 26, "4");
    // зона хвата справа — чуть светлее, как кожзам
    g.fillStyle = "rgba(255,255,255,.05)";
    g.beginPath(); g.roundRect(U(0.885), V(0.08), U(0.1), V(0.84), 22); g.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
}

/** Откидной экран с живым интерфейсом записи. */
function useLcdTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 900;
    c.height = 620;
    const g = c.getContext("2d")!;
    const bg = g.createLinearGradient(0, 0, 900, 620);
    bg.addColorStop(0, "#251a55");
    bg.addColorStop(0.55, "#12102a");
    bg.addColorStop(1, "#06050c");
    g.fillStyle = bg;
    g.fillRect(0, 0, 900, 620);
    g.strokeStyle = "rgba(255,255,255,.14)";
    g.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
      g.beginPath(); g.moveTo((900 / 3) * i, 0); g.lineTo((900 / 3) * i, 620); g.stroke();
      g.beginPath(); g.moveTo(0, (620 / 3) * i); g.lineTo(900, (620 / 3) * i); g.stroke();
    }
    g.fillStyle = "#ff2a2a"; g.beginPath(); g.arc(60, 56, 15, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.font = "bold 34px monospace"; g.fillText("REC", 88, 68);
    g.fillStyle = LIME; g.font = "30px monospace"; g.fillText("4K 120p", 700, 66);
    g.fillStyle = "rgba(255,255,255,.88)"; g.font = "26px monospace"; g.fillText("S-Cinetone   ISO 800   1/240   F2.8", 50, 580);
    g.strokeStyle = LIME; g.lineWidth = 5; g.strokeRect(375, 245, 150, 130);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
}

export type Explode = MutableRefObject<number>;
type Props = { explode?: Explode; gimbal?: boolean; labels?: boolean };

const Label = ({ children }: { children: ReactNode }) => (
  <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
    <div className="whitespace-nowrap rounded-full border border-white/20 bg-black/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--lime)] backdrop-blur">
      {children}
    </div>
  </Html>
);

export function Fx30Rig({ explode, gimbal = false, labels = false }: Props) {
  const lens = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const tally = useRef<THREE.MeshStandardMaterial>(null);
  const rear = useRearTexture();
  const lcd = useLcdTexture();
  const grain = useGrainTexture(3);
  const leather = useGrainTexture(6);

  useFrame((state, dt) => {
    const e = explode?.current ?? 0;
    const k = 1 - Math.exp(-6 * dt);
    const to = (g: THREE.Group | null, axis: "x" | "y" | "z", v: number) => {
      if (g) g.position[axis] += (v - g.position[axis]) * k;
    };
    to(lens.current, "z", 0.6 + e * 2.0);
    to(screen.current, "z", -0.67 - e * 1.5);
    to(rig.current, "y", -e * 1.4);
    if (tally.current) tally.current.emissiveIntensity = Math.sin(state.clock.elapsedTime * 3.2) > 0 ? 3.5 : 0.3;
  });

  const body = <meshStandardMaterial color="#2e2f34" metalness={0.3} roughness={0.7} bumpMap={grain} bumpScale={0.6} envMapIntensity={1.0} />;
  const skin = <meshStandardMaterial color="#2c2d32" metalness={0.1} roughness={0.9} bumpMap={leather} bumpScale={1.4} envMapIntensity={1} />;
  const black = <meshStandardMaterial color="#1b1c20" metalness={0.4} roughness={0.5} envMapIntensity={1.5} />;
  const steel = <meshStandardMaterial color="#cfd2d8" metalness={1} roughness={0.22} envMapIntensity={1.6} />;
  const accent = <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={1.1} toneMapped={false} />;
  const ring = (r: number, h: number, z: number, mat: ReactNode, key: string | number) => (
    <mesh key={key} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[r, r, h, 64]} />
      {mat}
    </mesh>
  );

  return (
    <group>
      {/* ───────── корпус ───────── */}
      <group>
        <RoundedBox args={[W, H, 1.2]} radius={0.09} smoothness={5} position={[0, 0, -0.05]} castShadow receiveShadow>
          {body}
        </RoundedBox>
        {/* хват (правая рука) — выступает вперёд, обтянут «кожей» */}
        <RoundedBox args={[0.78, H, 0.5]} radius={0.16} smoothness={5} position={[-0.92, 0, 0.8]} castShadow>
          {skin}
        </RoundedBox>
        <RoundedBox args={[0.5, 1.2, 0.2]} radius={0.1} smoothness={4} position={[-0.88, -0.05, 1.1]}>
          {skin}
        </RoundedBox>
        {/* передняя панель с выемкой под байонет */}
        <RoundedBox args={[W - 0.78, H - 0.02, 0.06]} radius={0.04} position={[0.39, 0, 0.58]}>
          <meshStandardMaterial color="#3a3b41" metalness={0.4} roughness={0.62} bumpMap={grain} bumpScale={0.4} envMapIntensity={1.1} />
        </RoundedBox>
        {/* кнопка REC и индикатор записи на передней панели */}
        <mesh position={[1.0, -0.52, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
          {black}
        </mesh>
        <mesh position={[1.0, -0.52, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.012, 12, 40]} />
          <meshStandardMaterial color="#ff3030" emissive="#ff2020" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        <mesh position={[-0.42, 0.52, 0.62]}>
          <sphereGeometry args={[0.05, 20, 20]} />
          <meshStandardMaterial ref={tally} color="#ff2a2a" emissive="#ff1a1a" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        {/* верхняя панель: мультиинтерфейсный башмак, диск, кнопки */}
        <RoundedBox args={[0.62, 0.08, 0.5]} radius={0.02} position={[0.1, 0.8, -0.3]}>{black}</RoundedBox>
        <mesh position={[0.1, 0.845, -0.3]}><boxGeometry args={[0.44, 0.02, 0.34]} />{steel}</mesh>
        <mesh position={[-0.9, 0.84, 0.2]}><cylinderGeometry args={[0.2, 0.2, 0.1, 40]} />{black}</mesh>
        <mesh position={[-0.9, 0.9, 0.2]}><cylinderGeometry args={[0.13, 0.13, 0.03, 32]} />{steel}</mesh>
        <mesh position={[-0.35, 0.8, 0.0]}><cylinderGeometry args={[0.075, 0.075, 0.07, 24]} /><meshStandardMaterial color="#c43030" roughness={0.5} /></mesh>
        <mesh position={[0.65, 0.8, -0.1]}><cylinderGeometry args={[0.06, 0.06, 0.05, 20]} />{black}</mesh>
        {/* вентиляционные прорези и проушины ремня на боковой стенке */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[1.301, 0.12 + i * -0.09, -0.1]}><boxGeometry args={[0.02, 0.04, 0.5]} /><meshStandardMaterial color="#060607" /></mesh>
        ))}
        <mesh position={[1.31, 0.62, 0.35]}><torusGeometry args={[0.07, 0.022, 10, 24]} />{steel}</mesh>
        {/* задняя стенка с кнопками */}
        <mesh position={[0, 0, -0.652]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[W - 0.06, H - 0.06]} />
          <meshStandardMaterial map={rear} roughness={0.7} metalness={0.15} />
        </mesh>
      </group>

      {/* ───────── экран ───────── */}
      <group ref={screen} position={[0.4, -0.25, -0.67]}>
        <RoundedBox args={[1.6, 1.08, 0.08]} radius={0.04} castShadow>{black}</RoundedBox>
        <mesh position={[0, 0, -0.042]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.5, 1.0]} />
          <meshBasicMaterial map={lcd} toneMapped={false} />
        </mesh>
        {labels && <group position={[0, 0.7, -0.1]}><Label>Откидной экран</Label></group>}
      </group>

      {/* ───────── объектив: компактный светосильный зум E-mount ───────── */}
      <group ref={lens} position={[0, 0, 0.6]}>
        {ring(0.62, 0.14, 0.04, steel, "mount")}
        {ring(0.6, 0.45, 0.35, black, "rear")}
        {ring(0.7, 0.55, 0.85, <meshStandardMaterial color="#23242a" metalness={0.4} roughness={0.42} envMapIntensity={1.6} />, "mid")}
        {/* рифлёное кольцо */}
        {Array.from({ length: 14 }, (_, i) => ring(0.725, 0.03, 0.62 + i * 0.037, black, `r${i}`))}
        {/* кольцо зума */}
        {Array.from({ length: 10 }, (_, i) => ring(0.715, 0.03, 1.0 + i * 0.04, black, `z${i}`))}
        <mesh position={[0, 0.68, 0.98]} rotation={[0, 0, 0]}><sphereGeometry args={[0.055, 16, 16]} /><meshStandardMaterial color="#c9a24a" metalness={1} roughness={0.3} /></mesh>
        {/* передний тубус — полый, чтобы внутри были видны линзы */}
        <mesh position={[0, 0, 1.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.66, 0.66, 0.4, 64, 1, true]} />
          <meshStandardMaterial color="#1c1d21" metalness={0.4} roughness={0.5} side={THREE.DoubleSide} envMapIntensity={1.2} />
        </mesh>
        <mesh position={[0, 0, 1.55]}><ringGeometry args={[0.5, 0.66, 64]} />{black}</mesh>
        <mesh position={[0, 0, 1.551]}><ringGeometry args={[0.5, 0.53, 64]} />{steel}</mesh>
        <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.6, 48, 1, true]} />
          <meshStandardMaterial color="#030306" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        {/* внутренние линзы (с просветляющим покрытием) */}
        {ring(0.49, 0.04, 1.5, <meshPhysicalMaterial color="#0b1030" roughness={0.04} metalness={0.7} clearcoat={1} clearcoatRoughness={0.02} iridescence={0.8} iridescenceIOR={1.4} envMapIntensity={1.3} />, "g1")}
        {ring(0.36, 0.03, 1.4, <meshPhysicalMaterial color="#1a1450" roughness={0.04} metalness={0.6} clearcoat={1} iridescence={1} envMapIntensity={1.4} />, "g2")}
        {ring(0.2, 0.02, 1.3, <meshPhysicalMaterial color="#2a1060" roughness={0.05} metalness={0.5} clearcoat={1} envMapIntensity={1.5} />, "g3")}
        {labels && <group position={[0, 0.95, 0.9]}><Label>Объектив E-mount</Label></group>}
      </group>

      {/* ───────── стабилизатор в стиле Ronin RS4 ───────── */}
      {gimbal && (
        <group ref={rig}>
          <RoundedBox args={[2.2, 0.1, 1.4]} radius={0.03} position={[0, -0.84, -0.05]} castShadow>{black}</RoundedBox>
          <RoundedBox args={[0.26, 0.9, 0.5]} radius={0.06} position={[0, -1.35, -0.05]} castShadow>{body}</RoundedBox>
          <mesh position={[0, -1.95, -0.05]} castShadow><cylinderGeometry args={[0.46, 0.46, 0.5, 48]} />{body}</mesh>
          <mesh position={[0, -1.7, -0.05]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.46, 0.02, 12, 64]} />{accent}</mesh>
          <RoundedBox args={[3.5, 0.18, 0.3]} radius={0.05} position={[0, -1.2, -0.55]} castShadow>{body}</RoundedBox>
          {[-1.72, 1.72].map((x) => (
            <group key={x}>
              <RoundedBox args={[0.18, 1.05, 0.3]} radius={0.05} position={[x, -0.7, -0.55]} castShadow>{body}</RoundedBox>
              <mesh position={[x, -0.05, -0.15]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.34, 0.34, 0.3, 40]} />{body}</mesh>
              <mesh position={[x + (x < 0 ? -0.16 : 0.16), -0.05, -0.15]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />{accent}</mesh>
            </group>
          ))}
          <mesh position={[0, -3.1, -0.05]} castShadow><capsuleGeometry args={[0.26, 1.7, 12, 24]} />{skin}</mesh>
          <mesh position={[0, -2.45, 0.23]}><boxGeometry args={[0.16, 0.34, 0.1]} />{steel}</mesh>
          <mesh position={[0, -2.2, 0.25]}><sphereGeometry args={[0.07, 16, 16]} />{accent}</mesh>
          {labels && <group position={[0.9, -3.0, 0]}><Label>Ronin RS4 · 3 оси</Label></group>}
        </group>
      )}
    </group>
  );
}
