import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Earth = ({ scale = 0.005, orbitRadius = 8, orbitSpeed = 0.5 }) => {
  const earthRef = useRef();

  // Chargement des assets
  // Note : Assure-toi que les chemins correspondent bien à ta structure de dossier
  const fbx = useFBX("/src/assets/model/earth/source/Earth.fbx");
  const texture = useTexture("/src/assets/model/earth/textures/1_earth_8k.jpg");

  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          // On baisse l'émissif pour que la Terre reçoive la lumière du soleil
          // plutôt que d'en produire trop elle-même
          emissive: new THREE.Color("#000000"),
          roughness: 0.7,
          metalness: 0.1,
        });
      }
    });
  }, [fbx, texture]);

  // Animation de l'orbite et de la rotation
  useFrame((state) => {
    // Le temps global de Three.js
    const t = state.clock.getElapsedTime() * orbitSpeed;

    if (earthRef.current) {
      // 1. Calcul de la position sur le cercle (X et Z)
      const x = Math.cos(t) * orbitRadius;
      const z = Math.sin(t) * orbitRadius;

      // 2. Mise à jour de la position
      earthRef.current.position.set(x, 0, z);

      // 3. Rotation de la Terre sur elle-même
      earthRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={earthRef} object={fbx} scale={scale} />;
};

export default Earth;
