import { useState } from "react";
import Scene from "./Scene";
import ConstellationScene from "./ConstellationScene";
import "./App.css";

function App() {
  const [view, setView] = useState("solar"); // "solar" | "constellations"

  return (
    <div className="App">
      {view === "solar" ? (
        <Scene onDeepSpace={() => setView("constellations")} />
      ) : (
        <ConstellationScene onBack={() => setView("solar")} />
      )}
    </div>
  );
}

export default App;
