import { Engine, Scene } from "@babylonjs/core";

export class BabylonEngineBase {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

    // Render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // Auto-resize
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }
}