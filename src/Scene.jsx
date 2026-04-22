import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SimulationContext } from "./SimulationContext";

import Sun from "./components/Sun";
import Mercury from "./components/Mercury";
import Venus from "./components/Venus";
import EarthSystem from "./components/EarthSystem";
import Mars from "./components/Mars";
import Jupiter from "./components/Jupiter";
import Saturn from "./components/Saturn";
import Uranus from "./components/Uranus";
import Neptune from "./components/Neptune";
import Spaceship from "./components/Spaceship";
import BackgroundMusic from "./components/BackgroundMusic";

function CameraController({ zoomTarget, zoomRadius, onReturnComplete }) {
  const { camera } = useThree();
  const savedPos = useRef(null);
  const savedQuat = useRef(null);
  const approachDir = useRef(null);
  const wasZoomed = useRef(false);
  const mat = useRef(new THREE.Matrix4());
  const targetQuat = useRef(new THREE.Quaternion());

  useFrame(() => {
    if (zoomTarget) {
      if (!wasZoomed.current) {
        savedPos.current = camera.position.clone();
        savedQuat.current = camera.quaternion.clone();
        approachDir.current = camera.position.clone().sub(zoomTarget).normalize();
        wasZoomed.current = true;
      }

      // Distance = 2× le rayon visuel pour voir la planète entière (FOV 20°)
      const dist = Math.max(1, zoomRadius * 2.5);
      const desiredPos = zoomTarget.clone().add(
        approachDir.current.clone().multiplyScalar(dist)
      );

      camera.position.lerp(desiredPos, 0.06);

      // Matrix4.lookAt(eye, target, up) → convention caméra (-Z vers la cible)
      mat.current.lookAt(camera.position, zoomTarget, camera.up);
      targetQuat.current.setFromRotationMatrix(mat.current);
      camera.quaternion.slerp(targetQuat.current, 0.08);
    } else if (wasZoomed.current && savedPos.current) {
      camera.position.lerp(savedPos.current, 0.06);
      camera.quaternion.slerp(savedQuat.current, 0.06);

      if (camera.position.distanceTo(savedPos.current) < 0.12) {
        camera.position.copy(savedPos.current);
        camera.quaternion.copy(savedQuat.current);
        wasZoomed.current = false;
        approachDir.current = null;
        savedPos.current = null;
        savedQuat.current = null;
        onReturnComplete();
      }
    }
  });

  return null;
}

export default function Scene() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [orbitEnabled, setOrbitEnabled] = useState(true);

  const handlePlanetClick = useCallback((name, worldPos, zoomRadius) => {
    setSelectedPlanet({ name, pos: worldPos.clone(), zoomRadius });
    setOrbitEnabled(false);
  }, []);

  const handleReturn = useCallback(() => {
    setSelectedPlanet(null);
  }, []);

  const handleReturnComplete = useCallback(() => {
    setOrbitEnabled(true);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
      }}
    >
      <BackgroundMusic fileName="star_wars.mp3" />
      <Canvas camera={{ position: [0, 20, 50], fov: 15 }}>
        {/* Étoiles et Ambiance */}
        <Stars
          radius={150}
          depth={50}
          count={7000}
          factor={6}
          saturation={0}
          fade
        />

        {/* On booste un peu l'ambientLight pour voir les détails du vaisseau même à l'ombre */}
        <ambientLight intensity={0.8} />

        {/* Lumière principale venant du Soleil */}
        <pointLight
          position={[0, 0, 0]}
          intensity={40}
          distance={100}
          decay={1}
        />

        <Suspense fallback={null}>
          <Sun scale={0.07} />

          {/* Planètes avec les distances resserrées pour l'effet visuel */}
          <Mercury orbitRadius={5} orbitSpeed={0.8} scale={0.003} />
          <Venus orbitRadius={8} orbitSpeed={0.6} scale={0.0045} />
          <EarthSystem orbitRadius={11} orbitSpeed={0.4} />
          <Mars orbitRadius={15} orbitSpeed={0.3} scale={0.004} />
          <Jupiter orbitRadius={20} orbitSpeed={0.15} scale={0.015} />
          <Saturn orbitRadius={26} orbitSpeed={0.1} scale={0.012} />
          <Uranus orbitRadius={31} orbitSpeed={0.07} scale={0.008} />
          <Neptune orbitRadius={36} orbitSpeed={0.05} scale={0.008} />

          {/* LE VAISSEAU : Il navigue librement grâce à son useFrame interne */}
          {/* Note : L'échelle est réglée à 0.0005 car les fichiers OBJ sont souvent géants */}
          <Spaceship scale={0.0009} />

          {/* Effets de Bloom pour le Soleil et les lumières du vaisseau */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={1}
              intensity={1.2}
              mipmapBlur
              radius={0.3}
            />
          </EffectComposer>
        </Suspense>

        <OrbitControls makeDefault minDistance={10} maxDistance={80} />
      </Canvas>
    </div>
  );
}
