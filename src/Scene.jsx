import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Tes imports
import Sun from "./components/Sun";
import Mercury from "./components/Mercury";
import Venus from "./components/Venus";
import EarthSystem from "./components/EarthSystem";
import Mars from "./components/Mars";
import Jupiter from "./components/Jupiter";
import Saturn from "./components/Saturn";
import Uranus from "./components/Uranus";
import Neptune from "./components/Neptune";
import Spaceship from "./components/Spaceship"; // Ton nouveau composant
import BackgroundMusic from "./components/BackgroundMusic";

export default function Scene() {
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
