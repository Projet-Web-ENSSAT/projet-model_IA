import { createContext, useContext } from "react";

export const SimulationContext = createContext({ paused: false });

export const useSimulation = () => useContext(SimulationContext);
