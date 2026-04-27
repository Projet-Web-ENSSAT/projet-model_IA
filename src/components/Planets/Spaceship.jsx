import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

const BASE =
  "/src/assets/model/star-wars-halcon-milenario/source/Halcon_Milenario/";
const MTL_PATH = BASE + "Halcon_Milenario.mtl";
const OBJ_PATH = BASE + "Halcon_Milenario.obj";

const Spaceship = ({
  scale = 0.001,
  orbitRadius = 8,
  orbitSpeed = 0.15,
}) => {
  const spaceshipRef = useRef();

  // Chargement des matériaux MTL (textures relatives au dossier du MTL)
  const materials = useLoader(MTLLoader, MTL_PATH, (loader) => {
    loader.setResourcePath(BASE);
  });

  // Chargement du modèle OBJ avec les matériaux branchés
  const obj = useLoader(OBJLoader, OBJ_PATH, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  // Animation : orbite circulaire avec légère oscillation verticale
  useFrame((state) => {
    if (spaceshipRef.current) {
      const time = state.clock.elapsedTime * orbitSpeed;
      const x = Math.cos(time) * orbitRadius;
      const z = Math.sin(time) * orbitRadius;
      const y = Math.sin(time * 2) * 0.5;
      spaceshipRef.current.position.set(x, y, z);
      spaceshipRef.current.lookAt(x - Math.sin(time), y, z + Math.cos(time));
    }
  });

  return (
    <primitive
      ref={spaceshipRef}
      object={obj}
      scale={scale}
      position={[orbitRadius, 0, 0]}
    />
  );
};

export default Spaceship;
