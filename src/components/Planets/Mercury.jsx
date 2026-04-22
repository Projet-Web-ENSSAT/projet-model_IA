import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulation } from "../../SimulationContext";

const Mercury = ({ scale = 0.003, orbitRadius = 4, orbitSpeed = 0.8 }) => {
  const { paused, onPlanetClick } = useSimulation();
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

  useFrame((state, delta) => {
    if (!paused) {
      const t = state.clock.getElapsedTime() * orbitSpeed;
      if (mercuryRef.current) {
        mercuryRef.current.position.set(
          Math.cos(t) * orbitRadius,
          0,
          Math.sin(t) * orbitRadius,
        );
      }
    }
    if (mercuryRef.current) mercuryRef.current.rotation.y += delta * 0.3;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onPlanetClick || !mercuryRef.current) return;
    const pos = new THREE.Vector3();
    mercuryRef.current.getWorldPosition(pos);
    const box = new THREE.Box3().setFromObject(mercuryRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    onPlanetClick("Mercure", pos, sphere.radius);
  };

  return <primitive ref={mercuryRef} object={fbx} scale={scale} onClick={handleClick} />;
};

export default Mercury;
