import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulation } from "../SimulationContext";

const Moon = ({ scale = 0.0012, position = [0, 0, 0] }) => {
  const { paused } = useSimulation();
  const moonRef = useRef();
  const fbx = useFBX("/src/assets/model/moon/source/Moon.fbx");
  const texture = useTexture("/src/assets/model/moon/textures/8k_moon.jpg");

  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ map: texture });
      }
    });
  }, [fbx, texture]);

  useFrame((_, delta) => {
    if (paused) return;
    if (moonRef.current) moonRef.current.rotation.y += delta * 0.2;
  });

  return (
    <primitive ref={moonRef} object={fbx} scale={scale} position={position} />
  );
};

export default Moon;
