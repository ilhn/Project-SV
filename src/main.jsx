/*
import * as BABYLON from '@babylonjs/core';
import '../style.css';

const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas);

const createScene = function() {

    const scene = new BABYLON.Scene(engine);

    scene.createDefaultCameraOrLight(true, false, true);

    const box = new BABYLON.MeshBuilder.CreateBox();

    

    return scene;
}

const scene = createScene();

engine.runRenderLoop(function() {
    scene.render();
});

window.addEventListener('resize', function() {
    engine.resize();
});
*/

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)