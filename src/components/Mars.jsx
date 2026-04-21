import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Mars = ({ scale = 0.004, orbitRadius = 10, orbitSpeed = 0.3 }) => {
  const marsRef = useRef();
  const fbx = useFBX("/src/assets/model/mars/source/Mars.fbx");
  const texture = useTexture("/src/assets/model/mars/textures/8k_mars.jpg");

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
    if (marsRef.current) {
      marsRef.current.position.set(
        Math.cos(t) * orbitRadius,
        0,
        Math.sin(t) * orbitRadius,
      );
      marsRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={marsRef} object={fbx} scale={scale} />;
};

export default Mars;
