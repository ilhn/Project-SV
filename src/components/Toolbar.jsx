export default function Toolbar({ onSelectRoof }) {
  return (
    <div
      style={{
        height: "50px",
        background: "#222",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0 10px",
      }}
    >
      <button onClick={() => onSelectRoof("flat")}>Flat Roof</button>
      <button onClick={() => onSelectRoof("dual")}>Dual Pitch Roof</button>
    </div>
  );
}