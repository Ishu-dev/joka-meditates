"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Petal({ radius, angle, tilt, scale, color }) {
  return (
    <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <mesh
        position={[Math.sin(angle) * radius, tilt, Math.cos(angle) * radius]}
        rotation={[Math.cos(angle) * tilt * 2.2, angle, 0]}
        scale={scale}
      >
        <sphereGeometry args={[0.5, 14, 14]} />
        <meshStandardMaterial color={color} roughness={0.55} flatShading />
      </mesh>
    </group>
  );
}

function Lotus() {
  const group = useRef();
  const petals = [];
  const layers = [
    { count: 8, radius: 0.55, tilt: 0.42, scale: [0.42, 0.85, 0.2], color: "#c2447e", y: 0.1 },
    { count: 8, radius: 0.34, tilt: 0.62, scale: [0.34, 0.7, 0.18], color: "#d67ba4", y: 0.22 },
    { count: 6, radius: 0.16, tilt: 0.9, scale: [0.26, 0.5, 0.16], color: "#eec3d9", y: 0.34 },
  ];
  layers.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      petals.push(
        <Petal
          key={`${li}-${i}`}
          radius={layer.radius}
          angle={(i * 2 * Math.PI) / layer.count + li * 0.4}
          tilt={layer.tilt}
          scale={layer.scale}
          color={layer.color}
        />
      );
    }
  });

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.18;
    const targetX = state.pointer.y * 0.12;
    const targetZ = state.pointer.x * 0.08;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.04
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      targetZ,
      0.04
    );
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
  });

  return (
    <group ref={group}>
      {petals}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#2f5d54" roughness={0.5} flatShading />
      </mesh>
    </group>
  );
}

export default function Lotus3D() {
  const [glOk, setGlOk] = useState(null);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setGlOk(Boolean(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setGlOk(false);
    }
  }, []);

  if (glOk === null) {
    return <div className="h-64 sm:h-72" aria-hidden="true" />;
  }

  if (!glOk) {
    return (
      <div className="flex h-64 items-center justify-center sm:h-72" aria-hidden="true">
        <div className="h-28 w-28 rounded-full bg-accent/20" />
      </div>
    );
  }

  return (
    <div className="h-64 sm:h-72" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.6, 3], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-3, 2, -4]} intensity={0.4} />
        <group position={[0, -0.4, 0]}>
          <Lotus />
        </group>
      </Canvas>
    </div>
  );
}
