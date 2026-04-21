import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Jupiter = ({ scale = 0.015, orbitRadius = 13, orbitSpeed = 0.1 }) => {
  const jupiterRef = useRef();
  const fbx = useFBX("/src/assets/model/jupiter/source/Jupiter.fbx");
  const texture = useTexture(
    "/src/assets/model/jupiter/textures/8k_jupiter.jpg",
  );

  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1,
        });
      }
    });
  }, [fbx, texture]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * orbitSpeed;
    if (jupiterRef.current) {
      jupiterRef.current.position.set(
        Math.cos(t) * orbitRadius,
        0,
        Math.sin(t) * orbitRadius,
      );
      jupiterRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={jupiterRef} object={fbx} scale={scale} />;
};

export default Jupiter;
