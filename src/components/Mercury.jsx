import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Mercury = ({ scale = 0.003, orbitRadius = 4, orbitSpeed = 0.8 }) => {
  const mercuryRef = useRef();
  const fbx = useFBX("/src/assets/model/mercury/source/Mercury.fbx");
  const texture = useTexture(
    "/src/assets/model/mercury/textures/8k_mercury.jpg",
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
    if (mercuryRef.current) {
      mercuryRef.current.position.set(
        Math.cos(t) * orbitRadius,
        0,
        Math.sin(t) * orbitRadius,
      );
      mercuryRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={mercuryRef} object={fbx} scale={scale} />;
};

export default Mercury;
