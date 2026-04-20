import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Earth from "./Earth";
import Moon from "./Moon";

const EarthSystem = ({ orbitRadius = 9, orbitSpeed = 0.4 }) => {
  const groupRef = useRef();
  const moonOrbitRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // 1. Positionne tout le système (Terre + Lune) sur l'orbite solaire
      const x = Math.cos(t * orbitSpeed) * orbitRadius;
      const z = Math.sin(t * orbitSpeed) * orbitRadius;
      groupRef.current.position.set(x, 0, z);
    }

    if (moonOrbitRef.current) {
      // 2. Fait tourner la lune autour de la Terre (centre du groupe)
      const moonT = t * 1.5; // Vitesse de la lune
      const moonDist = 0.3; // Distance Terre-Lune
      moonOrbitRef.current.position.set(
        Math.cos(moonT) * moonDist,
        0,
        Math.sin(moonT) * moonDist,
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* La Terre est au centre local [0,0,0] du groupe */}
      <Earth scale={0.005} />
      {/* La lune est décalée et animée par moonOrbitRef */}
      <group ref={moonOrbitRef}>
        <Moon scale={0.0004} />
      </group>
    </group>
  );
};

export default EarthSystem;
