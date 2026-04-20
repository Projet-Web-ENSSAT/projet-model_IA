import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Earth from "./Earth";
import Moon from "./Moon";

const EarthSystem = ({ orbitRadius = 8, orbitSpeed = 0.4 }) => {
  const groupRef = useRef();
  const moonOrbitRef = useRef();

  // Dans EarthSystem.jsx
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const earthOrbitSpeed = 0.4;
    const earthRadius = 11;

    if (groupRef.current) {
      // Orbite de la Terre autour du Soleil
      const x = Math.cos(t * earthOrbitSpeed) * earthRadius;
      const z = Math.sin(t * earthOrbitSpeed) * earthRadius;
      groupRef.current.position.set(x, 0, z);
    }

    if (moonOrbitRef.current) {
      // Orbite de la Lune AUTOUR de la Terre
      const moonSpeed = 1.5;
      // BAISSE CETTE VALEUR : si 0.3 est trop loin, tente 0.15 ou 0.1
      const moonDist = 0.7;

      moonOrbitRef.current.position.set(
        Math.cos(t * moonSpeed) * moonDist,
        0,
        Math.sin(t * moonSpeed) * moonDist,
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* La Terre est au centre local [0,0,0] du groupe */}
      <Earth scale={0.005} />
      {/* La lune est décalée et animée par moonOrbitRef */}
      <group ref={moonOrbitRef}>
        <Moon scale={0.001} />
      </group>
    </group>
  );
};

export default EarthSystem;
