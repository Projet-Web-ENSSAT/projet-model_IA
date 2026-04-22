import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Saturn = ({ scale = 0.012, orbitRadius = 17, orbitSpeed = 0.1 }) => {
  const saturnRef = useRef();
  const fbx = useFBX("/src/assets/model/saturn/source/Saturn.fbx");
  const texture = useTexture("/src/assets/model/saturn/textures/8k_saturn.jpg");

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
    if (saturnRef.current) {
      saturnRef.current.position.set(
        Math.cos(t) * orbitRadius,
        0,
        Math.sin(t) * orbitRadius,
      );
      saturnRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={saturnRef} object={fbx} scale={scale} />;
};

export default Saturn;
