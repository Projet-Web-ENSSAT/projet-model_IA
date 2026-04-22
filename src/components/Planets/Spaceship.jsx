import React, { useRef, useMemo } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Spaceship = ({
  modelPath = "/src/assets/model/star-wars-halcon-milenario/", // Chemin vers ton FBX (dans public/)
  texturePath = null, // Optionnel : texture si nécessaire
  scale = 0.001, // Échelle à adapter selon ton modèle
  orbitRadius = 8, // Distance par rapport au centre (Soleil)
  orbitSpeed = 0.15, // Vitesse de rotation (radians par seconde)
}) => {
  const spaceshipRef = useRef();

  // 1. Charger le modèle
  const fbx = useFBX(modelPath);

  // 2. Charger la texture (optionnel, si ton FBX n'en a pas déjà de liées)
  const texture = texturePath ? useTexture(texturePath) : null;

  // 3. Appliquer un matériau propre
  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        if (texture) {
          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.8, // Aspect métallique pour un vaisseau
            roughness: 0.2,
          });
        } else {
          // Si pas de texture fournie, on utilise le matériau d'origine mais on booste l'aspect métal
          child.material.metalness = 0.8;
          child.material.roughness = 0.2;
        }
      }
    });
  }, [fbx, texture]);

  // 4. LOGIQUE D'ANIMATION (Le mouvement !)
  useFrame((state, delta) => {
    // 'delta' est le temps écoulé depuis la dernière image, en secondes.
    // 'state.clock.elapsedTime' est le temps total écoulé depuis le début.

    if (spaceshipRef.current) {
      const time = state.clock.elapsedTime * orbitSpeed;

      // Calcul de la position circulaire (cosinus/sinus)
      // On le fait orbiter dans le plan horizontal (X-Z)
      const x = Math.cos(time) * orbitRadius;
      const z = Math.sin(time) * orbitRadius;
      const y = Math.sin(time * 2) * 0.5; // Petite oscillation verticale pour le fun

      // Appliquer la nouvelle position
      spaceshipRef.current.position.set(x, y, z);

      // ORIENTATION : Le vaisseau doit regarder vers l'avant de sa trajectoire
      // La direction instantanée est tangente au cercle : (-sin(t), 0, cos(t))
      spaceshipRef.current.lookAt(x - Math.sin(time), y, z + Math.cos(time));
    }
  });

  return (
    <primitive
      ref={spaceshipRef}
      object={fbx}
      scale={scale}
      position={[orbitRadius, 0, 0]} // Position initiale
    />
  );
};

export default Spaceship;
