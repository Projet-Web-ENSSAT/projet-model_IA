import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulation } from "../../SimulationContext";

const Sun = ({ scale = 0.08, position = [0, 0, 0] }) => {
  const { onPlanetClick } = useSimulation();
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
  useFrame((_, delta) => {
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.1;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onPlanetClick || !sunRef.current) return;
    const pos = new THREE.Vector3();
    sunRef.current.getWorldPosition(pos);
    const box = new THREE.Box3().setFromObject(sunRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    onPlanetClick("Soleil", pos, sphere.radius);
  };

  return (
    <primitive ref={sunRef} object={fbx} scale={scale} position={position} onClick={handleClick} />
  );
};

export default Sun;
