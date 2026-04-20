import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Sun = ({ scale = 0.03, position = [0, 0, 0] }) => {
  const sunRef = useRef();

  // Chargement des assets spécifiques au Soleil
  const fbx = useFBX("/src/assets/model/sun/source/UnstableStar.fbx");
  const texture = useTexture("/src/assets/model/sun/textures/suncyl1.jpg");

  // Configuration du matériau "Solaire"
  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          emissiveMap: texture,
          emissive: new THREE.Color("#ffaa00"), // Un orange plus chaud
          emissiveIntensity: 3, // On booste pour le Bloom
          roughness: 0.1,
          metalness: 0,
        });
      }
    });
  }, [fbx, texture]);

  // Petite animation de rotation pour donner vie au soleil
  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <primitive ref={sunRef} object={fbx} scale={scale} position={position} />
  );
};

export default Sun;
