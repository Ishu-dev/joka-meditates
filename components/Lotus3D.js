"use client";

import { Component, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

class GLBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback || null;
    return this.props.children;
  }
}

function Halo() {
  const ref = useRef();
  const count = 220;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    seeds[i * 2] = Math.random() * Math.PI * 2;
    seeds[i * 2 + 1] = 0.9 + Math.random() * 0.5;
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const arr = ref.current?.geometry?.attributes?.position?.array;
    if (!arr) return;
    for (let i = 0; i < count; i++) {
      const a = seeds[i * 2] + t * (0.1 + (i % 5) * 0.03);
      const r = seeds[i * 2 + 1];
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(t * 0.7 + i) * 0.35;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    if (ref.current?.geometry?.attributes?.position) {
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#c2447e"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Lotus() {
  const group = useRef();
  const layers = [
    { count: 8, radius: 0.55, tilt: 0.42, scale: [0.42, 0.9, 0.2], color: "#c2447e" },
    { count: 8, radius: 0.34, tilt: 0.62, scale: [0.34, 0.75, 0.18], color: "#d67ba4" },
    { count: 6, radius: 0.16, tilt: 0.95, scale: [0.26, 0.55, 0.16], color: "#f0cadd" },
  ];
  const petals = [];
  layers.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      const angle = (i * 2 * Math.PI) / layer.count + li * 0.4;
      petals.push(
        <mesh
          key={`${li}-${i}`}
          position={[Math.sin(angle) * layer.radius, layer.tilt, Math.cos(angle) * layer.radius]}
          rotation={[Math.cos(angle) * layer.tilt * 2.2, angle, 0]}
          scale={layer.scale}
        >
          <sphereGeometry args={[0.5, 14, 14]} />
          <meshStandardMaterial color={layer.color} roughness={0.55} flatShading />
        </mesh>
      );
    }
  });

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.22;
    const targetX = state.pointer.y * 0.15;
    const targetZ = state.pointer.x * 0.1;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetZ, 0.05);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });

  return (
    <group ref={group} scale={1.25}>
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
    return <div className="h-72 sm:h-80" aria-hidden="true" />;
  }

  const fallback = (
    <div className="flex h-72 items-center justify-center sm:h-80" aria-hidden="true">
      <div className="h-32 w-32 rounded-full bg-accent/20 blur-xl" />
    </div>
  );

  if (!glOk) return fallback;

  return (
    <div className="h-72 sm:h-80" aria-hidden="true">
      <GLBoundary fallback={fallback}>
        <Canvas
          camera={{ position: [0, 0.9, 3.4], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          style={{ background: "transparent" }}
          onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[3, 4, 5]} intensity={1.5} />
          <directionalLight position={[-3, 2, -4]} intensity={0.5} />
          <Lotus />
          <Halo />
        </Canvas>
      </GLBoundary>
    </div>
  );
}
