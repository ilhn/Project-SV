import { BabylonEngineBase } from "./shared/BabylonEngineBase";
import { ArcRotateCamera, HemisphericLight, Vector3, Color4 } from "@babylonjs/core";

export class ThreeDViewEngine extends BabylonEngineBase {
  constructor(canvas) {
    super(canvas);

    // 3D kamera
    const camera = new ArcRotateCamera(
      "3dCam",
      Math.PI / 2,
      Math.PI / 3,
      20,
      new Vector3(0, 0, 0),
      this.scene
    );
    camera.attachControl(canvas, true);

    // Basit ışık
    new HemisphericLight("light", new Vector3(1, 1, 0), this.scene);

    this.scene.clearColor = new Color4(0.15, 0.15, 0.2, 1.0); // Koyu mor-gri arka plan
  }
}