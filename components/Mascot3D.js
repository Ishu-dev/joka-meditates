"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

function Buddy({ excited }) {
  const group = useRef();
  const leftEye = useRef();
  const rightEye = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.6) * 0.35;
    group.current.position.y = Math.sin(t * 1.6) * 0.06;
    const squish = excited ? 1 + Math.sin(t * 8) * 0.06 : 1;
    group.current.scale.set(squish, 2 - squish, squish);
    if (leftEye.current && rightEye.current) {
      const blink = Math.sin(t * 0.9) > 0.96 ? 0.1 : 1;
      leftEye.current.scale.y = THREE.MathUtils.lerp(leftEye.current.scale.y, blink, 0.3);
      rightEye.current.scale.y = leftEye.current.scale.y;
    }
    void delta;
  });

  const petals = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5;
    petals.push(
      <mesh
        key={i}
        position={[Math.sin(angle) * 0.34, 0.52, Math.cos(angle) * 0.34]}
        rotation={[Math.cos(angle) * 0.9, angle, 0]}
        scale={[0.22, 0.34, 0.14]}
      >
        <sphereGeometry args={[0.5, 10, 10]} />
        <meshStandardMaterial color="#d67ba4" roughness={0.55} flatShading />
      </mesh>
    );
  }

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.62, 20, 20]} />
        <meshStandardMaterial color="#fbe4ee" roughness={0.5} flatShading />
      </mesh>
      {petals}
      <mesh ref={leftEye} position={[-0.2, 0.08, 0.55]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#26261f" />
      </mesh>
      <mesh ref={rightEye} position={[0.2, 0.08, 0.55]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#26261f" />
      </mesh>
      <mesh position={[0, -0.12, 0.56]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.14, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#26261f" />
      </mesh>
      <mesh position={[0.42, -0.28, 0.2]} rotation={[0.4, 0, -0.5]} scale={[0.3, 0.12, 0.08]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#2f5d54" flatShading />
      </mesh>
    </group>
  );
}

export default function Mascot3D({ excited }) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 2.6], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} />
      <Buddy excited={excited} />
    </Canvas>
  );
}
