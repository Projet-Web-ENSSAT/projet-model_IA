import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Mars = ({ scale = 0.004, orbitRadius = 10, orbitSpeed = 0.3, paused, onPlanetClick }) => {
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

  useFrame((state, delta) => {
    if (!paused) {
      const t = state.clock.getElapsedTime() * orbitSpeed;
      if (marsRef.current) {
        marsRef.current.position.set(
          Math.cos(t) * orbitRadius,
          0,
          Math.sin(t) * orbitRadius,
        );
      }
    }
    if (marsRef.current) marsRef.current.rotation.y += delta * 0.3;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onPlanetClick || !marsRef.current) return;
    const pos = new THREE.Vector3();
    marsRef.current.getWorldPosition(pos);
    const box = new THREE.Box3().setFromObject(marsRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    onPlanetClick("Mars", pos, sphere.radius);
  };

  return <primitive ref={marsRef} object={fbx} scale={scale} onClick={handleClick} />;
};

export default Mars;
