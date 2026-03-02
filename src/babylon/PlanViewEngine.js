import { BabylonEngineBase } from "./shared/BabylonEngineBase";
import { Color4, FreeCamera, Vector3 } from "@babylonjs/core";

export class PlanViewEngine extends BabylonEngineBase {
  constructor(canvas) {
    super(canvas);

    // 2D görünüm: Ortografik kamera
    const camera = new FreeCamera("planCam", new Vector3(0, 100, 0), this.scene);
    camera.mode = FreeCamera.ORTHOGRAPHIC_CAMERA;
    camera.setTarget(Vector3.Zero());

    this.scene.clearColor = new Color4(0.92, 0.92, 0.92, 1.0); // Açık gri arka plan
  }
}