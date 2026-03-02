/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/
import { useState } from "react";
import PlanView from "./components/PlanView";
import ThreeDView from "./components/ThreeDView";
import Toolbar from "./components/Toolbar";

export default function App() {
  const [selectedRoof, setSelectedRoof] = useState(null);
  const [placedRoofs3D, setPlacedRoofs3D] = useState([]);
  const [previewRoof3D, setPreviewRoof3D] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null); // Seçili objeyi takip eder

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Toolbar onSelectRoof={setSelectedRoof} />

      <div style={{ flex: 1, display: "flex" }}>
        <PlanView
          roofType={selectedRoof}
          roofs={placedRoofs3D}
          activeIndex={activeIndex}
          onAddRoof={(roof) => setPlacedRoofs3D(prev => [...prev, roof])}
          onPreviewMove={setPreviewRoof3D}
          onSelect={setActiveIndex}
          onPlaced={() => setSelectedRoof(null)}
        />

        <ThreeDView 
          previewRoof={previewRoof3D} 
          roofs={placedRoofs3D} 
          activeIndex={activeIndex} 
        />
      </div>
    </div>
  );
}