import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { getDailyHoroscope } from "./agents/horoscopeAgent";
import { parseMarkdown } from "./lib/parsers";
import Constellation from "./components/Constellation/Constellation";
import "./css/ConstellationScene.css";

const CONSTELLATIONS = [
  {
    name: "Bélier",
    symbol: "♈",
    element: "Feu",
    dates: "21 mars – 19 avr.",
    position: [-22, 12, -15],
    stars: [
      [0, 0, 0],
      [1.2, 0.5, 0],
      [2.2, 0.3, 0],
      [3.0, 1.0, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    color: "#90a4ae",
    traits: ["Courage", "Initiative", "Passion"],
    symbol_meaning:
      "Le bélier d'or de Chrysomallos, envoyé par Hermès pour sauver Phrixos et Hellé du sacrifice.",
  },
  {
    name: "Taureau",
    symbol: "♉",
    element: "Terre",
    dates: "20 avr. – 20 mai",
    position: [-8, 18, -20],
    stars: [
      [0, 0, 0],
      [1, 0.8, 0],
      [2, 0.4, 0],
      [2.8, 1.2, 0],
      [3.2, 0.2, 0],
      [1.5, -0.5, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
      [1, 5],
    ],
    color: "#90a4ae",
    traits: ["Patience", "Loyauté", "Sensualité"],
    symbol_meaning:
      "Zeus transformé en taureau blanc pour emmener Europe par-delà les mers jusqu'aux rivages de Crète.",
  },
  {
    name: "Gémeaux",
    symbol: "♊",
    element: "Air",
    dates: "21 mai – 20 juin",
    position: [5, 14, -25],
    stars: [
      [0, 0, 0],
      [0, 1.5, 0],
      [0, 2.8, 0],
      [1.2, 0, 0],
      [1.2, 1.5, 0],
      [1.2, 2.8, 0],
      [0.6, -0.8, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [3, 4],
      [4, 5],
      [0, 3],
      [1, 4],
      [6, 0],
      [6, 3],
    ],
    color: "#90a4ae",
    traits: ["Curiosité", "Esprit vif", "Adaptabilité"],
    symbol_meaning:
      "Les jumeaux Castor et Pollux, inséparables même dans la mort, immortalisés ensemble par Zeus.",
  },
  {
    name: "Cancer",
    symbol: "♋",
    element: "Eau",
    dates: "21 juin – 22 juil.",
    position: [20, 8, -10],
    stars: [
      [0, 0, 0],
      [0.8, 0.6, 0],
      [1.8, 0.2, 0],
      [2.4, 1.0, 0],
      [1.0, 1.4, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
      [4, 3],
    ],
    color: "#90a4ae",
    traits: ["Intuition", "Bienveillance", "Empathie"],
    symbol_meaning:
      "Le grand crabe envoyé par Héra pour distraire Héraclès lors de son combat contre l'Hydre de Lerne.",
  },
  {
    name: "Lion",
    symbol: "♌",
    element: "Feu",
    dates: "23 juil. – 22 août",
    position: [25, -5, -18],
    stars: [
      [0, 0, 0],
      [0.6, 1.0, 0],
      [1.4, 1.6, 0],
      [2.4, 1.4, 0],
      [3.0, 0.6, 0],
      [2.6, -0.2, 0],
      [1.6, -0.6, 0],
      [0.8, -0.2, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 0],
      [3, 6],
    ],
    color: "#90a4ae",
    traits: ["Charisme", "Générosité", "Fierté"],
    symbol_meaning:
      "Le lion de Némée, tué par Héraclès lors de son premier travail, placé parmi les étoiles par Zeus en son honneur.",
  },
  {
    name: "Vierge",
    symbol: "♍",
    element: "Terre",
    dates: "23 août – 22 sep.",
    position: [15, -14, -8],
    stars: [
      [0, 0, 0],
      [0.5, 1.0, 0],
      [1.2, 1.8, 0],
      [2.0, 1.6, 0],
      [2.6, 0.8, 0],
      [2.2, -0.2, 0],
      [1.2, -0.8, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 0],
    ],
    color: "#90a4ae",
    traits: ["Précision", "Dévouement", "Discernement"],
    symbol_meaning:
      "Déméter, déesse des moissons, pleurant la descente de sa fille Perséphone aux Enfers.",
  },
  {
    name: "Balance",
    symbol: "♎",
    element: "Air",
    dates: "23 sep. – 22 oct.",
    position: [3, -20, -15],
    stars: [
      [0, 0, 0],
      [1.0, 0, 0],
      [2.0, 0, 0],
      [0.5, 1.0, 0],
      [1.5, 1.0, 0],
      [1.0, 2.0, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [0, 3],
      [2, 4],
      [3, 4],
      [3, 5],
      [4, 5],
    ],
    color: "#90a4ae",
    traits: ["Équilibre", "Diplomatie", "Harmonie"],
    symbol_meaning:
      "La balance d'Astrée, déesse de la justice, projetée dans les cieux en dernière divinité à quitter le monde mortel.",
  },
  {
    name: "Scorpion",
    symbol: "♏",
    element: "Eau",
    dates: "23 oct. – 21 nov.",
    position: [-12, -16, -20],
    stars: [
      [0, 0, 0],
      [0.8, 0.4, 0],
      [1.6, 0.2, 0],
      [2.4, -0.2, 0],
      [3.2, 0, 0],
      [3.8, 0.6, 0],
      [4.2, 1.2, 0],
      [4.0, 1.8, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ],
    color: "#90a4ae",
    traits: ["Intensité", "Résilience", "Profondeur"],
    symbol_meaning:
      "Le grand scorpion envoyé par Gaïa pour tuer Orion, tous deux placés aux antipodes du ciel pour ne jamais se croiser.",
  },
  {
    name: "Sagittaire",
    symbol: "♐",
    element: "Feu",
    dates: "22 nov. – 21 déc.",
    position: [-24, -8, -12],
    stars: [
      [0, 0, 0],
      [1, 0.8, 0],
      [2, 0, 0],
      [1.5, 1.6, 0],
      [0.5, 1.6, 0],
      [2.5, 1.2, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [4, 0],
      [3, 5],
      [5, 2],
    ],
    color: "#90a4ae",
    traits: ["Liberté", "Sagesse", "Optimisme"],
    symbol_meaning:
      "Chiron, le sage centaure, précepteur des héros, qui sacrifia son immortalité et fut honoré parmi les étoiles.",
  },
  {
    name: "Capricorne",
    symbol: "♑",
    element: "Terre",
    dates: "22 déc. – 19 jan.",
    position: [-18, 2, -22],
    stars: [
      [0, 0, 0],
      [1.0, 0.4, 0],
      [2.0, 0.2, 0],
      [2.8, 0.8, 0],
      [2.4, 1.6, 0],
      [1.2, 1.4, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ],
    color: "#90a4ae",
    traits: ["Ambition", "Discipline", "Endurance"],
    symbol_meaning:
      "Le bouc-poisson Pricus, père de tous les boucs-poissons, placé dans le ciel par Chronos pour honorer sa mémoire.",
  },
  {
    name: "Verseau",
    symbol: "♒",
    element: "Air",
    dates: "20 jan. – 18 fév.",
    position: [10, 20, -18],
    stars: [
      [0, 0, 0],
      [0.8, 0.6, 0],
      [1.6, 0, 0],
      [2.4, 0.6, 0],
      [0.4, 1.2, 0],
      [1.2, 1.8, 0],
      [2.0, 1.2, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [4, 5],
      [5, 6],
      [1, 5],
      [2, 6],
    ],
    color: "#90a4ae",
    traits: ["Vision", "Originalité", "Humanisme"],
    symbol_meaning:
      "Ganymède, le beau jeune homme enlevé par Zeus pour verser eau et nectar aux dieux de l'Olympe.",
  },
  {
    name: "Poissons",
    symbol: "♓",
    element: "Eau",
    dates: "19 fév. – 20 mars",
    position: [-5, -10, -28],
    stars: [
      [0, 0, 0],
      [0.6, 0.8, 0],
      [0.2, 1.6, 0],
      [1.8, 0, 0],
      [2.4, 0.8, 0],
      [1.8, 1.6, 0],
      [1.0, 0.8, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [3, 4],
      [4, 5],
      [0, 6],
      [6, 3],
      [1, 6],
      [6, 4],
    ],
    color: "#90a4ae",
    traits: ["Intuition", "Compassion", "Rêverie"],
    symbol_meaning:
      "Aphrodite et Éros transformés en poissons pour fuir Typhon, liés ensemble par un fil pour ne jamais se perdre.",
  },
];

function HoroscopeContent({ constellation }) {
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const fetchHoroscope = async () => {
    setLoading(true);
    setStarted(true);
    const date = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    try {
      const raw = await getDailyHoroscope(constellation.name, date);
      setToday(parseMarkdown(raw));
    } catch (e) {
      console.error(e);
      setToday("Les étoiles sont silencieuses ce soir.");
    }
    setLoading(false);
  };

  if (!started) {
    return (
      <div className="horoscope-cta">
        <button
          className="horoscope-cta__btn"
          style={{ "--constellation-color": constellation.color }}
          onClick={fetchHoroscope}
        >
          ✦ Lire les étoiles du jour
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="horoscope-loading">
        <div className="horoscope-loading__icon">✦</div>
        <div className="horoscope-loading__text">LECTURE DES ETOILES</div>
      </div>
    );
  }

  return (
    <div
      className="horoscope-result"
      style={{
        "--constellation-color": constellation.color,
        "overflow-y": "auto",
      }}
    >
      <div className="horoscope-result__label">✦ ENERGIE DU JOUR</div>
      <p className="horoscope-result__text">{today}</p>
    </div>
  );
}

function HoroscopeCard({ constellation, onClose }) {
  if (!constellation) return null;

  return (
    <div
      className="horoscope-card"
      style={{ "--constellation-color": constellation.color }}
    >
      <button className="horoscope-card__close" onClick={onClose}>
        ✕
      </button>

      <div className="horoscope-card__header">
        <div className="horoscope-card__symbol">{constellation.symbol}</div>
        <div className="horoscope-card__name">
          {constellation.name.toUpperCase()}
        </div>
        <div className="horoscope-card__dates">{constellation.dates}</div>
      </div>

      <div className="horoscope-card__element">
        <span className="horoscope-card__element-badge">
          SIGNE {constellation.element.toUpperCase()}
        </span>
      </div>

      <hr className="horoscope-card__divider" />

      <div className="horoscope-card__section">
        <div className="horoscope-card__section-label">TRAITS</div>
        <div className="horoscope-card__traits">
          {constellation.traits.map((t, i) => (
            <span key={i} className="horoscope-card__trait">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="horoscope-card__section">
        <div className="horoscope-card__section-label">MYTHOLOGIE</div>
        <p className="horoscope-card__mythology">
          {constellation.symbol_meaning}
        </p>
      </div>

      <hr className="horoscope-card__divider" />

      <HoroscopeContent constellation={constellation} />
    </div>
  );
}

export default function ConstellationScene({ onBack }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="constellation-scene">
      <Canvas camera={{ position: [0, 0, 45], fov: 60 }}>
        <Stars radius={150} count={8000} factor={5} fade saturation={0.3} />
        <ambientLight intensity={0.3} />
        <Suspense fallback={null}>
          {CONSTELLATIONS.map((c) => (
            <Constellation key={c.name} data={c} onClick={setSelected} />
          ))}
          <EffectComposer>
            <Bloom luminanceThreshold={0.4} intensity={1.2} mipmapBlur />
          </EffectComposer>
        </Suspense>
        <OrbitControls
          makeDefault
          minDistance={20}
          maxDistance={80}
          autoRotate
          autoRotateSpeed={0.15}
        />
      </Canvas>

      <button className="constellation-scene__back-btn" onClick={onBack}>
        ← SYSTÈME SOLAIRE
      </button>

      <div className="constellation-scene__title">
        Constellations du Zodiaque
      </div>

      {selected && (
        <HoroscopeCard
          constellation={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
