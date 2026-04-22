import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, Html } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
//import { getDailyHoroscope } from "./agents/horoscopeAgent";

const CONSTELLATIONS = [
  {
    name: "Aries", symbol: "♈", element: "Fire", dates: "Mar 21 – Apr 19",
    position: [-22, 12, -15],
    stars: [[0,0,0],[1.2,0.5,0],[2.2,0.3,0],[3.0,1.0,0]],
    lines: [[0,1],[1,2],[2,3]],
    color: "#90a4ae",
    traits: ["Courage", "Initiative", "Passion"],
    symbol_meaning: "The golden ram of Chrysomallus, sent by Hermes to save Phrixus and Helle from sacrifice.",
  },
  {
    name: "Taurus", symbol: "♉", element: "Earth", dates: "Apr 20 – May 20",
    position: [-8, 18, -20],
    stars: [[0,0,0],[1,0.8,0],[2,0.4,0],[2.8,1.2,0],[3.2,0.2,0],[1.5,-0.5,0]],
    lines: [[0,1],[1,2],[2,3],[2,4],[1,5]],
    color: "#90a4ae",
    traits: ["Patience", "Loyalty", "Sensuality"],
    symbol_meaning: "Zeus transformed into a white bull to carry Europa across the sea to the shores of Crete.",
  },
  {
    name: "Gemini", symbol: "♊", element: "Air", dates: "May 21 – Jun 20",
    position: [5, 14, -25],
    stars: [[0,0,0],[0,1.5,0],[0,2.8,0],[1.2,0,0],[1.2,1.5,0],[1.2,2.8,0],[0.6,-0.8,0]],
    lines: [[0,1],[1,2],[3,4],[4,5],[0,3],[1,4],[6,0],[6,3]],
    color: "#90a4ae",
    traits: ["Curiosity", "Wit", "Adaptability"],
    symbol_meaning: "The twin brothers Castor and Pollux, inseparable even in death, immortalized together by Zeus.",
  },
  {
    name: "Cancer", symbol: "♋", element: "Water", dates: "Jun 21 – Jul 22",
    position: [20, 8, -10],
    stars: [[0,0,0],[0.8,0.6,0],[1.8,0.2,0],[2.4,1.0,0],[1.0,1.4,0]],
    lines: [[0,1],[1,2],[2,3],[1,4],[4,3]],
    color: "#90a4ae",
    traits: ["Intuition", "Nurturing", "Empathy"],
    symbol_meaning: "The great crab sent by Hera to distract Heracles during his battle with the Lernaean Hydra.",
  },
  {
    name: "Leo", symbol: "♌", element: "Fire", dates: "Jul 23 – Aug 22",
    position: [25, -5, -18],
    stars: [[0,0,0],[0.6,1.0,0],[1.4,1.6,0],[2.4,1.4,0],[3.0,0.6,0],[2.6,-0.2,0],[1.6,-0.6,0],[0.8,-0.2,0]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[3,6]],
    color: "#90a4ae",
    traits: ["Charisma", "Generosity", "Pride"],
    symbol_meaning: "The Nemean Lion, slain by Heracles as his first labour, placed among the stars by Zeus in tribute.",
  },
  {
    name: "Virgo", symbol: "♍", element: "Earth", dates: "Aug 23 – Sep 22",
    position: [15, -14, -8],
    stars: [[0,0,0],[0.5,1.0,0],[1.2,1.8,0],[2.0,1.6,0],[2.6,0.8,0],[2.2,-0.2,0],[1.2,-0.8,0]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]],
    color: "#90a4ae",
    traits: ["Precision", "Devotion", "Discernment"],
    symbol_meaning: "Demeter, goddess of the harvest, mourning her daughter Persephone's descent into the underworld.",
  },
  {
    name: "Libra", symbol: "♎", element: "Air", dates: "Sep 23 – Oct 22",
    position: [3, -20, -15],
    stars: [[0,0,0],[1.0,0,0],[2.0,0,0],[0.5,1.0,0],[1.5,1.0,0],[1.0,2.0,0]],
    lines: [[0,1],[1,2],[0,3],[2,4],[3,4],[3,5],[4,5]],
    color: "#90a4ae",
    traits: ["Balance", "Diplomacy", "Harmony"],
    symbol_meaning: "The scales of Astraea, goddess of justice, cast into the heavens as the last deity to leave the mortal world.",
  },
  {
    name: "Scorpio", symbol: "♏", element: "Water", dates: "Oct 23 – Nov 21",
    position: [-12, -16, -20],
    stars: [[0,0,0],[0.8,0.4,0],[1.6,0.2,0],[2.4,-0.2,0],[3.2,0,0],[3.8,0.6,0],[4.2,1.2,0],[4.0,1.8,0]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]],
    color: "#90a4ae",
    traits: ["Intensity", "Resilience", "Depth"],
    symbol_meaning: "The great scorpion sent by Gaia to slay Orion, both placed in opposite skies so they never meet.",
  },
  {
    name: "Sagittarius", symbol: "♐", element: "Fire", dates: "Nov 22 – Dec 21",
    position: [-24, -8, -12],
    stars: [[0,0,0],[1,0.8,0],[2,0,0],[1.5,1.6,0],[0.5,1.6,0],[2.5,1.2,0]],
    lines: [[0,1],[1,2],[1,3],[3,4],[4,0],[3,5],[5,2]],
    color: "#90a4ae",
    traits: ["Freedom", "Wisdom", "Optimism"],
    symbol_meaning: "Chiron the wise centaur, teacher of heroes, who sacrificed his immortality and was honoured among the stars.",
  },
  {
    name: "Capricorn", symbol: "♑", element: "Earth", dates: "Dec 22 – Jan 19",
    position: [-18, 2, -22],
    stars: [[0,0,0],[1.0,0.4,0],[2.0,0.2,0],[2.8,0.8,0],[2.4,1.6,0],[1.2,1.4,0]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
    color: "#90a4ae",
    traits: ["Ambition", "Discipline", "Endurance"],
    symbol_meaning: "The sea-goat Pricus, father of all sea-goats, placed in the sky by Chronos to honour his memory forever.",
  },
  {
    name: "Aquarius", symbol: "♒", element: "Air", dates: "Jan 20 – Feb 18",
    position: [10, 20, -18],
    stars: [[0,0,0],[0.8,0.6,0],[1.6,0,0],[2.4,0.6,0],[0.4,1.2,0],[1.2,1.8,0],[2.0,1.2,0]],
    lines: [[0,1],[1,2],[2,3],[4,5],[5,6],[1,5],[2,6]],
    color: "#90a4ae",
    traits: ["Vision", "Originality", "Humanity"],
    symbol_meaning: "Ganymede, the beautiful youth taken by Zeus to pour water and nectar for the gods on Mount Olympus.",
  },
  {
    name: "Pisces", symbol: "♓", element: "Water", dates: "Feb 19 – Mar 20",
    position: [-5, -10, -28],
    stars: [[0,0,0],[0.6,0.8,0],[0.2,1.6,0],[1.8,0,0],[2.4,0.8,0],[1.8,1.6,0],[1.0,0.8,0]],
    lines: [[0,1],[1,2],[3,4],[4,5],[0,6],[6,3],[1,6],[6,4]],
    color: "#90a4ae",
    traits: ["Intuition", "Compassion", "Dreaminess"],
    symbol_meaning: "Aphrodite and Eros transformed into fish to escape Typhon, bound together by a cord so they would not be separated.",
  },
];

// Single Constellation component
function Constellation({ data, onClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1 + data.position[0]) * 0.05;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.08 + data.position[1]) * 0.03;
    }
  });

  const color = new THREE.Color(data.color);
  const brightColor = new THREE.Color(data.color).multiplyScalar(hovered ? 3 : 1.5);

  const linePoints = useMemo(() => {
    return data.lines.map(([a, b]) => [
      new THREE.Vector3(...data.stars[a]),
      new THREE.Vector3(...data.stars[b]),
    ]);
  }, [data]);

  const hitbox = useMemo(() => {
    const xs = data.stars.map(p => p[0]);
    const ys = data.stars.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return {
      w: maxX - minX + 1.5,
      h: maxY - minY + 1.5,
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
    };
  }, [data]);

  return (
    <group
      ref={groupRef}
      position={data.position}
      onClick={(e) => { e.stopPropagation(); onClick(data); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      {/* invisible hitbox */}
      <mesh position={[hitbox.cx, hitbox.cy, 0]}>
        <planeGeometry args={[hitbox.w, hitbox.h]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {data.stars.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[hovered ? 0.12 : 0.08, 8, 8]} />
          <meshStandardMaterial color={brightColor} emissive={brightColor} emissiveIntensity={hovered ? 3 : 1.5} />
        </mesh>
      ))}

      {linePoints.map(([start, end], i) => {
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        const quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return (
          <mesh key={i} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.008, 0.008, len, 4]} />
            <meshStandardMaterial
              color={color} emissive={color}
              emissiveIntensity={hovered ? 1.5 : 0.5}
              transparent opacity={hovered ? 0.9 : 0.4}
            />
          </mesh>
        );
      })}

      <Html
        position={[
          data.stars.reduce((s, p) => s + p[0], 0) / data.stars.length,
          data.stars.reduce((s, p) => s + p[1], 0) / data.stars.length - 0.8,
          0,
        ]}
        center distanceFactor={12} style={{ pointerEvents: "none" }}
      >
        <div style={{
          color: hovered ? data.color : "rgba(255,255,255,0.6)",
          fontSize: "11px", fontFamily: "'Cinzel', serif",
          letterSpacing: "0.12em", textTransform: "uppercase",
          whiteSpace: "nowrap",
          textShadow: hovered ? `0 0 12px ${data.color}` : "none",
          transition: "all 0.3s", userSelect: "none",
        }}>
          {data.symbol} {data.name}
        </div>
      </Html>
    </group>
  );
}

// Horoscope Card
function HoroscopeCard({ constellation, onClose }) {
  if (!constellation) return null;

  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 100, width: "360px",
      background: "linear-gradient(135deg, rgba(5,5,20,0.97) 0%, rgba(15,10,40,0.97) 100%)",
      border: `1px solid ${constellation.color}44`,
      borderRadius: "16px", padding: "28px 32px",
      boxShadow: `0 0 60px ${constellation.color}22, 0 0 0 1px ${constellation.color}33`,
      backdropFilter: "blur(20px)",
      fontFamily: "'Cinzel', serif", color: "#e8e8f0",
      animation: "cardIn 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');
        @keyframes cardIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>

      <button onClick={onClose} style={{
        position: "absolute", top: "14px", right: "18px",
        background: "none", border: "none", color: "#888", cursor: "pointer",
        fontSize: "18px", lineHeight: 1,
      }}>✕</button>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "40px", marginBottom: "6px", filter: `drop-shadow(0 0 16px ${constellation.color})` }}>
          {constellation.symbol}
        </div>
        <div style={{ fontSize: "20px", fontWeight: 600, letterSpacing: "0.2em", color: constellation.color }}>
          {constellation.name.toUpperCase()}
        </div>
        <div style={{ fontSize: "11px", color: "#888", letterSpacing: "0.15em", marginTop: "4px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
          {constellation.dates}
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{
          display: "inline-block", padding: "3px 14px", borderRadius: "20px",
          fontSize: "10px", letterSpacing: "0.2em",
          border: `1px solid ${constellation.color}66`, color: constellation.color,
        }}>
          {constellation.element.toUpperCase()} SIGN
        </span>
      </div>

      <div style={{ borderTop: `1px solid ${constellation.color}22`, marginBottom: "20px" }} />

      {/* Static traits */}
      <div style={{ marginBottom: "16px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
        <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#666", fontFamily: "'Cinzel', serif", marginBottom: "8px" }}>KNOWN FOR</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {constellation.traits.map((t, i) => (
            <span key={i} style={{
              padding: "2px 10px",
              background: `${constellation.color}11`,
              border: `1px solid ${constellation.color}33`,
              borderRadius: "20px", fontSize: "12px", color: "#ccc", fontStyle: "italic",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Static mythology */}
      <div style={{ marginBottom: "16px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
        <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#666", fontFamily: "'Cinzel', serif", marginBottom: "6px" }}>MYTHOLOGY</div>
        <p style={{ fontSize: "13px", color: "#aaa", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
          {constellation.symbol_meaning}
        </p>
      </div>

      <div style={{ borderTop: `1px solid ${constellation.color}22`, margin: "16px 0" }} />

      {/*  today's energy */}
      <HoroscopeContent constellation={constellation} />
    </div>
  );
}

// agent, today's energy  
function HoroscopeContent({ constellation }) {
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  // const fetchHoroscope = async () => {
  //   setLoading(true);
  //   setStarted(true);
  //   const date = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  //   try {
  //     const response = await fetch("https://api.anthropic.com/v1/messages", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         model: "claude-sonnet-4-20250514",
  //         max_tokens: 300,
  //         system: `You are a mystical, poetic astrologer. Respond with ONLY a plain string — no JSON, no markdown, no labels. Write 2-3 sentences of cosmic energy and advice for ${constellation.name} today, ${date}. Cover love, work, and health. Be poetic and specific.`,
  //         messages: [{ role: "user", content: `Today's horoscope for ${constellation.name} (${constellation.element} sign).` }],
  //       }),
  //     });
  //     const data = await response.json();
  //     setToday(data.content?.[0]?.text || "The stars are silent tonight.");
  //   } catch (e) {
  //     setToday("The stars are silent tonight. Try again.");
  //   }
  //   setLoading(false);
  // };

    const fetchHoroscope = async () => {
  setLoading(true);
  setStarted(true);
  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  try {
    const raw = await getDailyHoroscope(constellation.name, date);
    setToday(raw);
  } catch (e) {
    setToday("Les étoiles sont silencieuses ce soir.");
  }
  setLoading(false);
  };

  if (!started) {
    return (
      <div style={{ textAlign: "center" }}>
        <button onClick={fetchHoroscope} style={{
          background: `linear-gradient(135deg, ${constellation.color}22, ${constellation.color}44)`,
          border: `1px solid ${constellation.color}88`,
          borderRadius: "8px", color: constellation.color,
          padding: "10px 24px", fontSize: "11px", letterSpacing: "0.2em",
          fontFamily: "'Cinzel', serif", cursor: "pointer", textTransform: "uppercase",
        }}>
          ✦ Read Today's Stars
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "24px", animation: "pulse 1.5s ease-in-out infinite" }}>✦</div>
        <div style={{ fontSize: "11px", color: "#666", marginTop: "8px", letterSpacing: "0.15em" }}>READING THE STARS…</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: constellation.color, fontFamily: "'Cinzel', serif", marginBottom: "8px" }}>
        ✦ TODAY'S ENERGY
      </div>
      <p style={{ fontSize: "14px", color: "#ddd", margin: 0, lineHeight: 1.8, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
        {today}
      </p>
    </div>
  );
}

// The main scene 
export default function ConstellationScene({ onBack }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap" rel="stylesheet" />

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
        <OrbitControls makeDefault minDistance={20} maxDistance={80} autoRotate autoRotateSpeed={0.15} />
      </Canvas>

      <button onClick={onBack} style={{
        position: "fixed", top: "24px", left: "24px", zIndex: 50,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "8px", color: "rgba(255,255,255,0.7)",
        padding: "8px 18px", fontSize: "11px", letterSpacing: "0.15em",
        fontFamily: "'Cinzel', serif", cursor: "pointer", backdropFilter: "blur(10px)",
      }}>
        ← SOLAR SYSTEM
      </button>

      <div style={{
        position: "fixed", top: "24px", left: "50%", transform: "translateX(-50%)",
        zIndex: 50, textAlign: "center", pointerEvents: "none",
      }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "13px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
          Zodiac Constellations
        </div>
      </div>

      {selected && (
        <HoroscopeCard constellation={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

















  // const fetchHoroscope = async () => {
  // setLoading(true);
  // setStarted(true);
  // const date = new Date().toLocaleDateString("fr-FR", {
  //   weekday: "long", year: "numeric", month: "long", day: "numeric",
  // });
  // try {
  //   const raw = await getDailyHoroscope(constellation.name, date);
  //   setToday(raw);
  // } catch (e) {
  //   setToday("Les étoiles sont silencieuses ce soir.");
  // }
  // setLoading(false);
  // };