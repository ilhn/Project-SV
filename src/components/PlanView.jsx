import { useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";

export default function PlanView({ roofType, roofs, activeIndex, onAddRoof, onPreviewMove, onSelect, onPlaced }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const cursorRef = useRef(null);
  const gizmoManagerRef = useRef(null);
  const roofTypeRef = useRef(roofType);

  useEffect(() => { roofTypeRef.current = roofType; }, [roofType]);

  // SCENE INIT
  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    engineRef.current = engine;
    sceneRef.current = scene;

    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 10, 0), scene);
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    camera.rotation.x = Math.PI / 2;
    camera.setTarget(BABYLON.Vector3.Zero());

    const updateOrtho = () => {
      const ratio = canvas.clientWidth / canvas.clientHeight;
      const size = 10;
      camera.orthoLeft = -size * ratio; camera.orthoRight = size * ratio;
      camera.orthoTop = size; camera.orthoBottom = -size;
    };
    updateOrtho();

    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
    ground.isPickable = true;
    ground.visibility = 0.2;

    // GizmoManager oluştur
    const gizmoManager = new BABYLON.GizmoManager(scene);
    gizmoManager.attachableMeshes = [];
    gizmoManager.positionGizmoEnabled = true; // Konum için
    gizmoManager.scaleGizmoEnabled = true;    // Ölçek için
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManagerRef.current = gizmoManager;

    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => { engine.resize(); updateOrtho(); });
    return () => engine.dispose();
  }, []);

  // INPUT HANDLERS
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const moveHandler = () => {
      const activeType = roofTypeRef.current;
      if (!activeType) return;
      const pick = scene.pick(scene.pointerX, scene.pointerY);
      if (!pick.hit) return;

      if (!cursorRef.current) {
        cursorRef.current = BABYLON.MeshBuilder.CreatePlane("cursor", { width: 1, height: 1 }, scene);
        cursorRef.current.rotation.x = Math.PI / 2;
        const mat = new BABYLON.StandardMaterial("cMat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.1, 0.6, 1);
        mat.alpha = 0.5;
        cursorRef.current.material = mat;
      }
      cursorRef.current.position = pick.pickedPoint;

      if (onPreviewMove) onPreviewMove({ x: pick.pickedPoint.x, y: pick.pickedPoint.z, type: activeType });
    };

    const downHandler = () => {
      const activeType = roofTypeRef.current;
      const pick = scene.pick(scene.pointerX, scene.pointerY);
      if (!pick.hit) return;

      if (activeType) {
        const currentCount = roofs.length;
        const plane = BABYLON.MeshBuilder.CreatePlane("roof_" + currentCount, { width: 1, height: 1 }, scene);
        plane.rotation.x = Math.PI / 2;
        plane.position = pick.pickedPoint;
        plane.position.y = 0.1;

        const mat = new BABYLON.StandardMaterial("rMat", scene);
        mat.diffuseColor = activeType === "flat" ? new BABYLON.Color3(0.1, 0.6, 1) : new BABYLON.Color3(1, 0.6, 0.1);
        plane.material = mat;

        // Add roof and select
        onAddRoof({ x: pick.pickedPoint.x, y: pick.pickedPoint.z, type: activeType });
        onSelect(currentCount);
        if (onPlaced) onPlaced();
      } else {
        // Selection
        if (pick.pickedMesh && pick.pickedMesh.name.startsWith("roof_")) {
          const selectedId = parseInt(pick.pickedMesh.name.split("_")[1]);
          onSelect(selectedId);
        } else {
          onSelect(null);
        }
      }
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("pointermove", moveHandler);
    canvas.addEventListener("pointerdown", downHandler);
    return () => {
      canvas.removeEventListener("pointermove", moveHandler);
      canvas.removeEventListener("pointerdown", downHandler);
    };
  }, [onAddRoof, onSelect, onPlaced, roofs]);

  // Gizmo hedefi ve outline güncellemesi
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const gizmoManager = gizmoManagerRef.current;
    const roofMeshes = scene.meshes.filter(m => m.name.startsWith("roof_"));

    roofMeshes.forEach(mesh => {
      const idx = parseInt(mesh.name.split("_")[1]);
      if (idx === activeIndex) {
        mesh.renderOutline = true;
        mesh.outlineColor = BABYLON.Color3.Yellow();
        mesh.outlineWidth = 0.2;

        // Gizmo’yu bağla
        gizmoManager.attachToMesh(mesh);

        // Ölçek ve konum değişimini roof state ile eşle
        const positionObserver = mesh.onAfterWorldMatrixUpdateObservable.add(() => {
          if (onAddRoof) {
            onAddRoof(prev => prev.map((r, i) => i === idx ? { ...r, x: mesh.position.x, y: mesh.position.z } : r));
          }
        });
      } else {
        mesh.renderOutline = false;
      }
    });
  }, [activeIndex, roofs]);

  return <canvas ref={canvasRef} style={{ width: "50%", height: "100%", borderRight: "1px solid #ddd", display: "block" }} />;
}