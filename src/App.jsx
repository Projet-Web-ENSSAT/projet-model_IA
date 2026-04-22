import { useState } from "react";
import Scene from "./Scene";
import ConstellationScene from "./ConstellationScene";
import "./App.css";

function App() {
  const [view, setView] = useState("solar"); // "solar" | "constellations"

  return (
    <div className="App">
      {view === "solar" ? (
        <>
          <Scene />
          {/* Deep Space button */}
          <button
            onClick={() => setView("constellations")}
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 50,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.7)",
              padding: "8px 18px",
              fontSize: "11px",
              letterSpacing: "0.15em",
              fontFamily: "'Cinzel', serif",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
            }}
          >
            ✦ DEEP SPACE
          </button>
        </>
      ) : (
        <ConstellationScene onBack={() => setView("solar")} />
      )}
    </div>
  );
}

export default App;








// import Scene from "./Scene";
// import "./App.css";

// function App() {
//   return (
//     <div className="App">
//       <Scene />
//     </div>
//   );
// }

// export default App;
