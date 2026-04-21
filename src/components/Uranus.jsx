import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Uranus = ({ scale = 0.008, orbitRadius = 20, orbitSpeed = 0.7 }) => {
  const uranusRef = useRef();
  const fbx = useFBX("/src/assets/model/uranus/source/Uranus.fbx");
  const texture = useTexture("/src/assets/model/uranus/textures/uranusmap.jpg");

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
    if (uranusRef.current) {
      uranusRef.current.position.set(
        Math.cos(t) * orbitRadius,
        0,
        Math.sin(t) * orbitRadius,
      );
      uranusRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={uranusRef} object={fbx} scale={scale} />;
};

export default Uranus;
