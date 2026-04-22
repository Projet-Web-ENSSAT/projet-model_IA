import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Saturn = ({ scale = 0.012, orbitRadius = 17, orbitSpeed = 0.1 }) => {
  const saturnRef = useRef();
  const fbx = useFBX("/src/assets/model/saturn/source/Saturn.fbx");
  const texture = useTexture("/src/assets/model/saturn/textures/Saturn.jpg");
  const ringsTexture = useTexture(
    "/src/assets/model/saturn/textures/ring1.jpg",
  );

  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) console.log("Nom de l'objet trouvé :", child.name);
      {
        if (child.name.includes("Circle")) {
          child.material = new THREE.MeshStandardMaterial({
            map: ringsTexture,
            alphaMap: ringsTexture, // On utilise la texture pour dire où c'est transparent
            transparent: true,
            side: THREE.DoubleSide,
            color: new THREE.Color("#ffffff"), // Garde la couleur pure de la texture
            roughness: 0.3,
            metalness: 0,
          });

          // Force la texture à s'étaler sur tout le cercle
          ringsTexture.wrapS = ringsTexture.wrapT = THREE.RepeatWrapping;
        } else {
          // Matériau de la planète (ton code précédent)
          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
            metalness: 0.05,
            emissiveMap: texture,
            emissiveIntensity: 0.15,
            emissive: new THREE.Color("#ffffff"),
          });
        }
      }
    });
  }, [fbx, texture, ringsTexture]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * orbitSpeed;
    if (saturnRef.current) {
      saturnRef.current.position.set(
        Math.cos(t) * orbitRadius,
        0,
        Math.sin(t) * orbitRadius,
      );
      saturnRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={saturnRef} object={fbx} scale={scale} />;
};

export default Saturn;
