import React, { useMemo, useRef } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Earth = ({ scale = 0.005 }) => {
  const earthRef = useRef();

  const fbx = useFBX("/src/assets/model/earth/source/Earth.fbx");
  const texture = useTexture("/src/assets/model/earth/textures/1_earth_8k.jpg");

  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          emissive: new THREE.Color("#000000"),
          roughness: 0.7,
          metalness: 0.1,
        });
      }
    });
  }, [fbx, texture]);

  // ON NE CALCULE PLUS L'ORBITE ICI
  // On garde juste la rotation sur elle-même (l'axe Y)
  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.2;
  });

  // IMPORTANT : position={[0, 0, 0]} pour qu'elle reste au centre de son groupe parent
  return (
    <primitive ref={earthRef} object={fbx} scale={scale} position={[0, 0, 0]} />
  );
};

export default Earth;
