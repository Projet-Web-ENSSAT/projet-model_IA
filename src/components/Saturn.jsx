import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulation } from "../SimulationContext";

const Saturn = ({ scale = 0.012, orbitRadius = 17, orbitSpeed = 0.1 }) => {
  const { paused, onPlanetClick } = useSimulation();
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

  useFrame((state, delta) => {
    if (!paused) {
      const t = state.clock.getElapsedTime() * orbitSpeed;
      if (saturnRef.current) {
        saturnRef.current.position.set(
          Math.cos(t) * orbitRadius,
          0,
          Math.sin(t) * orbitRadius,
        );
      }
    }
    if (saturnRef.current) saturnRef.current.rotation.y += delta * 0.3;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onPlanetClick || !saturnRef.current) return;
    const pos = new THREE.Vector3();
    saturnRef.current.getWorldPosition(pos);
    const box = new THREE.Box3().setFromObject(saturnRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    onPlanetClick("Saturne", pos, sphere.radius);
  };

  return <primitive ref={saturnRef} object={fbx} scale={scale} onClick={handleClick} />;
};

export default Saturn;
