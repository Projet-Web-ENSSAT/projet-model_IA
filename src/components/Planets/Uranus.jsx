import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulation } from "../../SimulationContext";

const Uranus = ({ scale = 0.008, orbitRadius = 20, orbitSpeed = 0.7 }) => {
  const { paused, onPlanetClick } = useSimulation();
  const uranusRef = useRef();
  const fbx = useFBX("/src/assets/model/uranus/source/Uranus.fbx");
  const texture = useTexture("/src/assets/model/uranus/textures/uranusmap.jpg");

  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1,
        });
      }
    });
  }, [fbx, texture]);

  useFrame((state, delta) => {
    if (!paused) {
      const t = state.clock.getElapsedTime() * orbitSpeed;
      if (uranusRef.current) {
        uranusRef.current.position.set(
          Math.cos(t) * orbitRadius,
          0,
          Math.sin(t) * orbitRadius,
        );
      }
    }
    if (uranusRef.current) uranusRef.current.rotation.y += delta * 0.3;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!onPlanetClick || !uranusRef.current) return;
    const pos = new THREE.Vector3();
    uranusRef.current.getWorldPosition(pos);
    const box = new THREE.Box3().setFromObject(uranusRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    onPlanetClick("Uranus", pos, sphere.radius);
  };

  return <primitive ref={uranusRef} object={fbx} scale={scale} onClick={handleClick} />;
};

export default Uranus;
