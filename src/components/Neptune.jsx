import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulation } from "../SimulationContext";

const Neptune = ({ scale = 0.007, orbitRadius = 36, orbitSpeed = 0.5 }) => {
  const { paused, onPlanetClick } = useSimulation();
  const neptuneRef = useRef();
  const fbx = useFBX("/src/assets/model/neptune/source/Neptune.fbx");
  const texture = useTexture(
    "/src/assets/model/neptune/textures/2k_neptune.jpg",
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

  useFrame((state, delta) => {
    if (!paused) {
      const t = state.clock.getElapsedTime() * orbitSpeed;
      if (neptuneRef.current) {
        neptuneRef.current.position.set(
          Math.cos(t) * orbitRadius,
          0,
          Math.sin(t) * orbitRadius,
        );
      }
    }
    if (neptuneRef.current) neptuneRef.current.rotation.y += delta * 0.3;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onPlanetClick || !neptuneRef.current) return;
    const pos = new THREE.Vector3();
    neptuneRef.current.getWorldPosition(pos);
    const box = new THREE.Box3().setFromObject(neptuneRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    onPlanetClick("Neptune", pos, sphere.radius);
  };

  return <primitive ref={neptuneRef} object={fbx} scale={scale} onClick={handleClick} />;
};

export default Neptune;
