import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Neptune = ({ scale = 0.007, orbitRadius = 36, orbitSpeed = 0.5 }) => {
  const neptuneRef = useRef();
  const fbx = useFBX("/src/assets/model/neptune/source/Neptune.fbx");
  const texture = useTexture("/src/assets/model/neptune/textures/Neptune.jpg");

  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.3,
          metalness: 0.2,
          emissiveMap: texture,
          emissiveIntensity: 0.5,
          emissive: new THREE.Color("#0044ff"),
        });
      }
    });
  }, [fbx, texture]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * orbitSpeed;
    if (neptuneRef.current) {
      neptuneRef.current.position.set(
        Math.cos(t) * orbitRadius,
        0,
        Math.sin(t) * orbitRadius,
      );
      neptuneRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={neptuneRef} object={fbx} scale={scale} />;
};

export default Neptune;
