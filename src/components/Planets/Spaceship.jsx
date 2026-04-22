import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Spaceship = ({ scale = 0.0005 }) => {
  const shipRef = useRef();

  // 1. Chargement avec tes chemins exacts
  // IMPORTANT : Assure-toi que les fichiers .jpeg sont dans le même dossier que le .mtl
  const materials = useLoader(
    MTLLoader,
    "/src/assets/model/star-wars-halcon-milenario/source/Halcon_Milenario/Halcon_Milenario.mtl",
  );

  const obj = useLoader(
    OBJLoader,
    "/src/assets/model/star-wars-halcon-milenario/source/Halcon_Milenario/Halcon_Milenario.obj",
    (loader) => {
      materials.preload();
      loader.setMaterials(materials);
    },
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.15; // Vitesse de croisière

    if (shipRef.current) {
      // NAVIGATION LIBRE (Trajectoire non-circulaire)
      // On combine des fonctions pour que le vaisseau se balade dans le système
      const x = Math.sin(t * 0.7) * 22 + Math.cos(t * 0.3) * 5;
      const y = Math.cos(t * 0.5) * 4; // Il monte et descend
      const z = Math.cos(t * 0.6) * 18 + Math.sin(t * 0.2) * 10;

      // Calcul de la direction (LookAt)
      // On anticipe la position suivante (t + 0.01) pour orienter le cockpit
      const nextT = t + 0.01;
      const targetX = Math.sin(nextT * 0.7) * 22 + Math.cos(nextT * 0.3) * 5;
      const targetY = Math.cos(nextT * 0.5) * 4;
      const targetZ = Math.cos(nextT * 0.6) * 18 + Math.sin(nextT * 0.2) * 10;

      shipRef.current.position.set(x, y, z);
      shipRef.current.lookAt(targetX, targetY, targetZ);

      // LE "ROLL" (Inclinaison de pilotage)
      // Le vaisseau penche sur le côté en fonction de la courbe
      shipRef.current.rotation.z += Math.sin(t * 0.7) * 0.5;
    }
  });

  return <primitive ref={shipRef} object={obj} scale={scale} />;
};

export default Spaceship;
