import { useState } from "react";
import Scene from "./Scene";
import ConstellationScene from "./ConstellationScene";
import "./App.css";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState("solar"); // "solar" | "constellations"

  return (
    <div className="App">
      {showIntro && (
        <div className="block">
          <h1 className="title">Bienvenue sur Astro-Learning</h1>
          <p className="description">
            Découvrez les merveilles de l'univers grâce à notre modèle interactif du système solaire en 3D. Explorez les planètes, les lunes et les corps célestes avec un niveau de détail remarquable, et apprenez leurs caractéristiques uniques ainsi que des faits fascinants. Que vous soyez étudiant, enseignant ou passionné d'espace, Astro-Learning offre une expérience immersive et éducative pour tous les âges. Commencez votre voyage cosmique dès aujourd'hui et découvrez les mystères de l'univers !
          </p>
          <button
            className="button"
            onClick={() => setShowIntro(false)}
          >
            Explorez maintenant
          </button>
        </div>
      )}

      {!showIntro && (
        view === "solar" ? (
          <Scene onDeepSpace={() => setView("constellations")} />
        ) : (
          <ConstellationScene onBack={() => setView("solar")} />
        )
      )}
    </div>
  );
}

export default App;
