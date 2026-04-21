import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulation } from "../SimulationContext";

const Venus = ({ scale = 0.0045, orbitRadius = 6, orbitSpeed = 0.3 }) => {
  const { paused, onPlanetClick } = useSimulation();
  const venusRef = useRef();
  const fbx = useFBX("/src/assets/model/venus/source/Venus.fbx");
  const texture = useTexture(
    "/src/assets/model/venus/textures/8k_venus_surface.jpg",
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
    if (paused) return;
    const t = state.clock.getElapsedTime() * orbitSpeed;
    if (venusRef.current) {
      venusRef.current.position.set(
        Math.cos(t) * orbitRadius,
        0,
        Math.sin(t) * orbitRadius,
      );
      venusRef.current.rotation.y += 0.005;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onPlanetClick || !venusRef.current) return;
    const pos = new THREE.Vector3();
    venusRef.current.getWorldPosition(pos);
    onPlanetClick("Vénus", pos);
  };

  return <primitive ref={venusRef} object={fbx} scale={scale} onClick={handleClick} />;
};
export default Venus;
