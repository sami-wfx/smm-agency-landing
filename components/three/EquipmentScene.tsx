"use client";

import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, OrbitControls, Sparkles } from "@react-three/drei";
import { Fx30Rig } from "./Fx30Rig";

const LIME = "#b8ff3c";
const VIOLET = "#8b5cf6";

function Rig({ explode }: { explode: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const wide = size.width >= 640;
  return (
    <group ref={group} position={[0, wide ? 1.15 : 1.0, 0]} scale={wide ? 0.9 : 0.68}>
      <Float speed={1.4} rotationIntensity={0.06} floatIntensity={0.35}>
        <Fx30Rig explode={explode} gimbal labels={wide} />
      </Float>
      <ContactShadows position={[0, -3.95, 0]} opacity={0.6} scale={14} blur={2.8} far={4} color="#000" />
    </group>
  );
}

export default function EquipmentScene({ active, explode }: { active: boolean; explode: MutableRefObject<number> }) {
  const isCoarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [6.4, 1.4, 10.6], fov: 32 }}
      gl={{ antialias: !isCoarse, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 6, 5]} intensity={2.8} />
      <directionalLight position={[-2, 1, 8]} intensity={2.2} color="#dfe6ff" />
      <pointLight position={[-5, 1, 3]} intensity={9} color={VIOLET} distance={16} />
      <pointLight position={[5, -2, -3]} intensity={16} color={LIME} distance={14} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={5} position={[0, 5, 2]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.4} color={LIME} position={[5, 1, 0]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={2.2} color={VIOLET} position={[-5, 1, 1]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="ring" intensity={3} position={[0, 0, -6]} scale={6} />
        <Lightformer form="rect" intensity={2.5} position={[0, -3, 3]} scale={[8, 1.5, 1]} rotation-x={-Math.PI / 2} />
      </Environment>
      <Rig explode={explode} />
      <Sparkles count={isCoarse ? 20 : 50} scale={[12, 8, 8]} size={2} speed={0.3} opacity={0.6} color={LIME} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!isCoarse}
        autoRotate
        autoRotateSpeed={0.9}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        target={[0, -0.3, 0]}
      />
    </Canvas>
  );
}
