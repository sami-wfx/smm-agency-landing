"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Fx30Pro } from "./Fx30Pro";
import { Rs4Pro } from "./Rs4Pro";

export type Focus = "all" | "camera" | "lens" | "gimbal";

// куда «смотрит» камера для каждой вкладки (позиция, цель)
const VIEWS: Record<Focus, { pos: [number, number, number]; look: [number, number, number] }> = {
  all: { pos: [6.6, 1.6, 18.2], look: [0.2, -0.9, 0.9] },
  camera: { pos: [4.6, 1.4, 8.6], look: [0, -0.1, 0.5] },
  lens: { pos: [4.4, 0.7, 9.0], look: [0, 0, 1.6] },
  gimbal: { pos: [5.6, 0.8, 11.6], look: [0, -0.9, 0] },
};

function Rig({ focus, getYaw, addYaw, active }: { focus: Focus; getYaw: () => number; addYaw: (d: number) => void; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const look = useRef(new THREE.Vector3(0, -1, 0));
  const target = useRef(new THREE.Vector3());
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    if (!active) return;
    const v = VIEWS[focus];
    const k = 1 - Math.exp(-3.2 * dt);
    // на широкой сцене (компьютер) подъезжаем ближе, чтобы модель была крупнее
    const f = state.size.width / state.size.height > 1 ? 0.78 : 1;
    desired.set(v.pos[0] * f + v.look[0] * (1 - f), v.pos[1] * f + v.look[1] * (1 - f), v.pos[2] * f + v.look[2] * (1 - f));
    state.camera.position.lerp(desired, k);
    target.current.set(...v.look);
    look.current.lerp(target.current, k);
    state.camera.lookAt(look.current);
    if (group.current) {
      // медленное вращение, пока человек не крутит сам
      if (focus === "all") addYaw(dt * 0.12);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, getYaw(), 6, dt);
    }
  });

  return (
    <group ref={group}>
      <Fx30Pro />
      <Rs4Pro />
      <ContactShadows position={[0, -3.95, 0]} opacity={0.55} scale={14} blur={2.8} far={4} color="#000" />
    </group>
  );
}

export default function EquipmentPhoneScene({ active, focus, getYaw, addYaw }: { active: boolean; focus: Focus; getYaw: () => number; addYaw: (d: number) => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [6.6, 1.6, 18.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.3;
      }}
    >
      <ambientLight intensity={1.0} />
      <hemisphereLight args={["#ffffff", "#2a2a40", 0.9]} />
      <directionalLight position={[3, 6, 6]} intensity={3.6} />
      <directionalLight position={[-5, 3, -4]} intensity={2.4} color="#9fb4ff" />
      <directionalLight position={[-2, 1, 8]} intensity={2.0} color="#dfe6ff" />
      <pointLight position={[-5, 1, 3]} intensity={8} color="#8b5cf6" distance={16} />
      <pointLight position={[5, -2, -3]} intensity={8} color="#b8ff3c" distance={14} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={7} position={[0, 5, 2]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.4} color="#b8ff3c" position={[5, 1, 0]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={2.2} color="#8b5cf6" position={[-5, 1, 1]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="ring" intensity={3} position={[0, 0, -6]} scale={6} />
        <Lightformer form="rect" intensity={2.5} position={[0, -3, 3]} scale={[8, 1.5, 1]} rotation-x={-Math.PI / 2} />
      </Environment>
      <Rig focus={focus} getYaw={getYaw} addYaw={addYaw} active={active} />
    </Canvas>
  );
}
