import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Imports de tes composants
import Sun from "./components/Sun";
import Mercury from "./components/Mercury";
import Venus from "./components/Venus";
import EarthSystem from "./components/EarthSystem";
import Mars from "./components/Mars";
import Jupiter from "./components/Jupiter";
import Saturn from "./components/Saturn";
import Uranus from "./components/Uranus";
import Neptune from "./components/Neptune";

export default function Scene() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <Canvas camera={{ position: [0, 25, 35], fov: 20 }}>
        {" "}
        {/* On monte la caméra pour voir l'arc */}
        <Stars radius={100} count={5000} factor={4} fade />
        <ambientLight intensity={0.8} />
        <pointLight position={[0, 0, 0]} intensity={60} />
        <Suspense fallback={null}>
          <Sun scale={0.03} />
          {/* On resserre tout entre 4 et 23 unités de distance */}
          <Mercury orbitRadius={4} orbitSpeed={0.8} scale={0.003} />
          <Venus orbitRadius={6} orbitSpeed={0.6} scale={0.0045} />
          <EarthSystem orbitRadius={8} orbitSpeed={0.4} />{" "}
          {/* Terre à scale 0.005 */}
          <Mars orbitRadius={10} orbitSpeed={0.3} scale={0.004} />
          <Jupiter orbitRadius={13} orbitSpeed={0.15} scale={0.015} />
          <Saturn orbitRadius={17} orbitSpeed={0.1} scale={0.012} />
          <Uranus orbitRadius={20} orbitSpeed={0.07} scale={0.008} />
          <Neptune orbitRadius={23} orbitSpeed={0.05} scale={0.008} />
          <EffectComposer>
            <Bloom luminanceThreshold={1} intensity={1} mipmapBlur />
          </EffectComposer>
        </Suspense>
        <OrbitControls
          makeDefault
          minDistance={10}
          maxDistance={60}
          // On bloque un peu l'angle pour garder cet aspect "maquette" sur l'écran
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}
