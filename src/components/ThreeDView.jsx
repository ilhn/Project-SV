import { useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

export default function ThreeDView({ previewRoof, roofs, activeIndex }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const previewMeshRef = useRef(null);

  useEffect(() => {
    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    const camera = new BABYLON.ArcRotateCamera("cam", Math.PI/2, Math.PI/3, 20, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
    ground.material = new GridMaterial("grid", scene);

    engine.runRenderLoop(() => scene.render());
    return () => engine.dispose();
  }, []);

  // Preview logic
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !previewRoof) { if(previewMeshRef.current) previewMeshRef.current.setEnabled(false); return; }
    
    if (!previewMeshRef.current) {
      previewMeshRef.current = BABYLON.MeshBuilder.CreateBox("preview", { size: 1 }, scene);
      const mat = new BABYLON.StandardMaterial("pMat", scene);
      mat.diffuseColor = new BABYLON.Color3(0, 1, 0); mat.alpha = 0.5;
      previewMeshRef.current.material = mat;
    }
    previewMeshRef.current.setEnabled(true);
    previewMeshRef.current.position.set(previewRoof.x, 0.5, previewRoof.y);
  }, [previewRoof]);

  // Placed roofs & Selection Sync
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    roofs.forEach((roof, index) => {
      let mesh = scene.getMeshByName("placed_" + index);
      if (!mesh) {
        mesh = BABYLON.MeshBuilder.CreateBox("placed_" + index, { size: 1 }, scene);
        const mat = new BABYLON.StandardMaterial("m" + index, scene);
        mesh.material = mat;
      }
      mesh.position.set(roof.x, 0.5, roof.y);
      mesh.material.diffuseColor = roof.type === "flat" ? new BABYLON.Color3(0.1, 0.6, 1) : new BABYLON.Color3(1, 0.6, 0.1);
      
      // Outline kontrolü
      mesh.renderOutline = (index === activeIndex);
      mesh.outlineColor = BABYLON.Color3.Yellow();
      mesh.outlineWidth = 0.1;
    });
  }, [roofs, activeIndex]);

  return <canvas ref={canvasRef} style={{ width: "50%", height: "100%" }} />;
}