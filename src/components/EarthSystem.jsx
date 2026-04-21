import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Earth from "./Earth";
import Moon from "./Moon";
import { useSimulation } from "../SimulationContext";

const EarthSystem = ({ orbitRadius = 8, orbitSpeed = 0.4 }) => {
  const { paused, onPlanetClick } = useSimulation();
  const groupRef = useRef();
  const moonOrbitRef = useRef();

  useFrame((state) => {
    if (paused) return;
    const t = state.clock.getElapsedTime();
    const earthOrbitSpeed = 0.4;
    const earthRadius = 11;

    if (groupRef.current) {
      const x = Math.cos(t * earthOrbitSpeed) * earthRadius;
      const z = Math.sin(t * earthOrbitSpeed) * earthRadius;
      groupRef.current.position.set(x, 0, z);
    }

    if (moonOrbitRef.current) {
      const moonSpeed = 1.5;
      const moonDist = 0.7;
      moonOrbitRef.current.position.set(
        Math.cos(t * moonSpeed) * moonDist,
        0,
        Math.sin(t * moonSpeed) * moonDist,
      );
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onPlanetClick || !groupRef.current) return;
    const pos = new THREE.Vector3();
    groupRef.current.getWorldPosition(pos);
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    onPlanetClick("Terre", pos, sphere.radius);
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      <Earth scale={0.005} />
      <group ref={moonOrbitRef}>
        <Moon scale={0.001} />
      </group>
    </group>
  );
};

export default EarthSystem;
