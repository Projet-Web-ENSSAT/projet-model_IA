import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Saturn = ({ scale = 0.012, orbitRadius = 17, orbitSpeed = 0.1, paused, onPlanetClick }) => {
  const saturnRef = useRef();
  const fbx = useFBX("/src/assets/model/saturn/source/Saturn.fbx");
  const texture = useTexture("/src/assets/model/saturn/textures/Saturn.jpg");
  const ringsTexture = useTexture("/src/assets/model/saturn/textures/ring1.jpg");

  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) console.log("Nom de l'objet trouvé :", child.name);
      {
        if (child.name.includes("Circle")) {
          child.material = new THREE.MeshStandardMaterial({
            map: ringsTexture,
            alphaMap: ringsTexture,
            transparent: true,
            side: THREE.DoubleSide,
            color: new THREE.Color("#ffffff"),
            roughness: 0.3,
            metalness: 0,
          });
          ringsTexture.wrapS = ringsTexture.wrapT = THREE.RepeatWrapping;
        } else {
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

  useFrame((state, delta) => {
    if (!paused) {
      const t = state.clock.getElapsedTime() * orbitSpeed;
      if (saturnRef.current) {
        saturnRef.current.position.set(
          Math.cos(t) * orbitRadius,
          0,
          Math.sin(t) * orbitRadius,
        );
      }
    }
    if (saturnRef.current) saturnRef.current.rotation.y += delta * 0.3;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onPlanetClick || !saturnRef.current) return;
    const pos = new THREE.Vector3();
    saturnRef.current.getWorldPosition(pos);
    const box = new THREE.Box3().setFromObject(saturnRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    onPlanetClick("Saturne", pos, sphere.radius);
  };

  return <primitive ref={saturnRef} object={fbx} scale={scale} onClick={handleClick} />;
};

export default Saturn;
