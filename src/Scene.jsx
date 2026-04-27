import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SimulationContext } from "./SimulationContext";
import "./css/Scene.css";

import Sun from "./components/Planets/Sun";
import Mercury from "./components/Planets/Mercury";
import Venus from "./components/Planets/Venus";
import EarthSystem from "./components/Planets/EarthSystem";
import Mars from "./components/Planets/Mars";
import Jupiter from "./components/Planets/Jupiter";
import Saturn from "./components/Planets/Saturn";
import Uranus from "./components/Planets/Uranus";
import Neptune from "./components/Planets/Neptune";
import Spaceship from "./components/Planets/Spaceship";
import BackgroundMusic from "./components/BackgroundMusic";
import { getPlanetAnecdote, getPlanetDescription } from "./agents/planetAgent";
import { generateQuiz } from "./agents/quizzAgent";
import Quiz from "./components/Quiz";

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
  const [infoPanel, setInfoPanel] = useState(null);
  const [quizPanel, setQuizPanel] = useState({ open: false, raw: null, error: null, loading: false });

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

  const handleQuizClick = () => {
    setQuizPanel({ open: true, raw: null, error: null, loading: true });
    generateQuiz()
      .then((raw) => setQuizPanel({ open: true, raw, error: null, loading: false }))
      .catch((e) => setQuizPanel({ open: true, raw: null, error: e.message, loading: false }));
  };

  return (
    <SimulationContext.Provider value={{ paused: !!selectedPlanet, onPlanetClick: handlePlanetClick }}>
      <div className="scene-container">
        <div className="global-toolbar">
          <button className="toolbar-btn" onClick={handleQuizClick}>Quiz</button>
        </div>

        {selectedPlanet && (
          <div className="planet-toolbar">
            <button className="toolbar-btn" onClick={handleReturn}>← Retour</button>
            <button className="toolbar-btn" onClick={handleAnecdoteClick}>Anecdotes</button>
            <button className="toolbar-btn" onClick={handleCharacteristicsClick}>Caractéristiques</button>
            <span className="planet-name">{selectedPlanet.name}</span>
          </div>
        )}

        {infoPanel && (
          <div className="info-panel">
            <h2 className="info-panel-title">{selectedPlanet.name} — {infoPanel.title}</h2>
            <p className="info-panel-content">
              {infoPanel.loading ? "Chargement…" : stripMarkdown(infoPanel.content)}
            </p>
            <button className="info-panel-close" onClick={() => setInfoPanel(null)}>Fermer</button>
          </div>
        )}

        {quizPanel.open && (
          <div className="info-panel">
            <h2 className="info-panel-title">Quiz</h2>
            {quizPanel.loading && <p className="info-panel-content">Chargement…</p>}
            {quizPanel.error && <p className="quiz-error">{quizPanel.error}</p>}
            {!quizPanel.loading && !quizPanel.error && (
              <Quiz raw={quizPanel.raw} />
            )}
            <button className="info-panel-close" onClick={() => setQuizPanel({ open: false, raw: null, error: null, loading: false })}>
              Fermer
            </button>
          </div>
        )}

        <BackgroundMusic fileName="star_wars.mp3" />
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
            {/* Vaisseau spatial */}
            <Spaceship scale={0.0009} />
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
