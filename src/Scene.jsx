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
import { getPlanetAnecdote, getPlanetDescription } from "./agents/planetAgent";

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

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*•]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .trim();
}

export default function Scene() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [infoPanel, setInfoPanel] = useState(null); // { title, content, loading }

  const handlePlanetClick = useCallback((name, worldPos, zoomRadius) => {
    setSelectedPlanet({ name, pos: worldPos.clone(), zoomRadius });
    setOrbitEnabled(false);
  }, []);

  const handleReturn = useCallback(() => {
    setSelectedPlanet(null);
    setInfoPanel(null);
  }, []);

  const handleReturnComplete = useCallback(() => {
    setOrbitEnabled(true);
  }, []);

  const handleAnecdoteClick = () => {
    setInfoPanel({ title: "Anecdote", content: null, loading: true });
    getPlanetAnecdote(selectedPlanet.name).then((anecdote) => {
      setInfoPanel({ title: "Anecdote", content: anecdote, loading: false });
    });
  };

  const handleCharacteristicsClick = () => {
    setInfoPanel({ title: "Caractéristiques", content: null, loading: true });
    getPlanetDescription(selectedPlanet.name).then((desc) => {
      setInfoPanel({ title: "Caractéristiques", content: desc, loading: false });
    });
  };

  return (
    <SimulationContext.Provider value={{ paused: !!selectedPlanet, onPlanetClick: handlePlanetClick }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}>
        {selectedPlanet && (
          <div style={{
            position: "absolute",
            top: 24,
            left: 24,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            <button
              onClick={handleReturn}
              style={{
                padding: "8px 18px",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                backdropFilter: "blur(6px)",
                letterSpacing: "0.03em",
              }}
            >
              ← Retour
            </button>

            <button
              onClick={handleAnecdoteClick}
              style={{
                padding: "8px 18px",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                backdropFilter: "blur(6px)",
                letterSpacing: "0.03em",
              }}
            >
              Anecdotes
            </button>

            <button
              onClick={handleCharacteristicsClick}
              style={{
                padding: "8px 18px",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                backdropFilter: "blur(6px)",
                letterSpacing: "0.03em",
              }}
            >
              Caractéristiques
            </button>

            <span style={{
              color: "white",
              fontSize: 20,
              fontWeight: 600,
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              fontFamily: "sans-serif",
            }}>
              {selectedPlanet.name}
            </span>
          </div>
        )}

        {infoPanel && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 20,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "30px",
            width: "700px",
            maxWidth: "90vw",
            maxHeight: "70vh",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
          }}>
            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "28px",
              margin: 0,
              color: "white",
            }}>
              {selectedPlanet.name} — {infoPanel.title}
            </h2>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "16px",
              lineHeight: "1.6",
              margin: 0,
              whiteSpace: "pre-wrap",
            }}>
              {infoPanel.loading ? "Chargement…" : stripMarkdown(infoPanel.content)}
            </p>
            <button
              onClick={() => setInfoPanel(null)}
              style={{
                alignSelf: "flex-start",
                padding: "10px 24px",
                fontSize: "15px",
                color: "white",
                backgroundColor: "#34393f",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              Fermer
            </button>
          </div>
        )}

        <Canvas camera={{ position: [0, 25, 35], fov: 20 }}>
          <Stars radius={100} count={5000} factor={4} fade />
          <ambientLight intensity={0.8} />
          <pointLight position={[0, 0, 0]} intensity={50} />
          <Suspense fallback={null}>
            <Sun scale={0.08} />
            <Mercury orbitRadius={4} orbitSpeed={0.8} scale={0.003} />
            <Venus orbitRadius={6} orbitSpeed={0.6} scale={0.0045} />
            <EarthSystem orbitRadius={8} orbitSpeed={0.4} />
            <Mars orbitRadius={10} orbitSpeed={0.3} scale={0.004} />
            <Jupiter orbitRadius={13} orbitSpeed={0.15} scale={0.015} />
            <Saturn orbitRadius={17} orbitSpeed={0.1} scale={0.012} />
            <Uranus orbitRadius={20} orbitSpeed={0.07} scale={0.008} />
            <Neptune orbitRadius={23} orbitSpeed={0.05} scale={0.008} />
            <EffectComposer>
              <Bloom luminanceThreshold={1} intensity={0.7} mipmapBlur />
            </EffectComposer>
          </Suspense>
          <CameraController
            zoomTarget={selectedPlanet?.pos ?? null}
            zoomRadius={selectedPlanet?.zoomRadius ?? 4}
            onReturnComplete={handleReturnComplete}
          />
          {orbitEnabled && (
            <OrbitControls
              makeDefault
              minDistance={10}
              maxDistance={60}
              maxPolarAngle={Math.PI / 2.5}
            />
          )}
        </Canvas>
      </div>
    </SimulationContext.Provider>
  );
}
