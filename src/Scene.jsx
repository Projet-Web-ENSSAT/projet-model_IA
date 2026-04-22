import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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

  const paused = !!selectedPlanet;

  return (
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

        <Canvas camera={{ position: [0, 20, 50], fov: 15 }}>
          <Stars radius={150} depth={50} count={7000} factor={6} saturation={0} fade />
          <ambientLight intensity={0.8} />
          <pointLight position={[0, 0, 0]} intensity={40} distance={100} decay={1} />
          <Suspense fallback={null}>
            <Sun scale={0.07} onPlanetClick={handlePlanetClick} />
            <Mercury orbitRadius={5} orbitSpeed={0.8} scale={0.003} paused={paused} onPlanetClick={handlePlanetClick} />
            <Venus orbitRadius={8} orbitSpeed={0.6} scale={0.0045} paused={paused} onPlanetClick={handlePlanetClick} />
            <EarthSystem orbitRadius={11} orbitSpeed={0.4} paused={paused} onPlanetClick={handlePlanetClick} />
            <Mars orbitRadius={15} orbitSpeed={0.3} scale={0.004} paused={paused} onPlanetClick={handlePlanetClick} />
            <Jupiter orbitRadius={20} orbitSpeed={0.15} scale={0.015} paused={paused} onPlanetClick={handlePlanetClick} />
            <Saturn orbitRadius={26} orbitSpeed={0.1} scale={0.012} paused={paused} onPlanetClick={handlePlanetClick} />
            <Uranus orbitRadius={31} orbitSpeed={0.07} scale={0.008} paused={paused} onPlanetClick={handlePlanetClick} />
            <Neptune orbitRadius={36} orbitSpeed={0.05} scale={0.008} paused={paused} onPlanetClick={handlePlanetClick} />
            <Spaceship scale={0.0009} />
            <EffectComposer>
              <Bloom luminanceThreshold={1} intensity={1.2} mipmapBlur radius={0.3} />
            </EffectComposer>
          </Suspense>
          <CameraController
            zoomTarget={selectedPlanet?.pos ?? null}
            zoomRadius={selectedPlanet?.zoomRadius ?? 4}
            onReturnComplete={handleReturnComplete}
          />
          {orbitEnabled && (
            <OrbitControls makeDefault minDistance={10} maxDistance={80} />
          )}
        </Canvas>
    </div>
  );
}
