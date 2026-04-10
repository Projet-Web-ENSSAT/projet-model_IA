import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Sun from "/src/components/Sun";

export default function Scene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#050505" }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <Suspense fallback={null}>
          {/* Ton composant dédié */}
          <Sun scale={0.005} position={[0, 0, 0]} />

          {/* Le Bloom est nécessaire pour que le <Sun /> brille réellement */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={1}
              intensity={2}
              mipmapBlur
              radius={0.8}
            />
          </EffectComposer>
        </Suspense>

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
