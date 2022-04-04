import React, { useEffect, useState } from "react";
import { Node } from "gl-react";
import * as THREE from "three";
import { shaders } from "./shader";
import "./styles.scss";

let lastUpdate: number;
let container;
let camera: THREE.Camera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let uniforms: {
  time: { type: string; value: number };
  resolution: { type: string; value: THREE.Vector2 };
};

function RainbowPulse() {
  function init(showStats: boolean) {
    /* basic setup */
    container = document.getElementById("container");
    camera = new THREE.Camera();
    camera.position.z = 1;
    scene = new THREE.Scene();
    let geometry = new THREE.PlaneBufferGeometry(2, 2);

    /* shader stuff */
    uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    };

    const vertexShader = document.getElementById("vertexShader")!.textContent!;
    const fragmentShader =
      document.getElementById("fragmentShader")!.textContent!;

    let material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: shaders.vertexShader.toString(),
      fragmentShader: shaders.fragmentShader.toString(),
    });

    lastUpdate = new Date().getTime();

    /* put it together for rendering */
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio / 2);
    container!.appendChild(renderer.domElement);

    /* event listeners */
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
    document
      .getElementById("resolution")!
      .addEventListener("change", onResolutionChange, false);
  }

  /* events */
  function onWindowResize(evt?: Event) {
    renderer.setSize(window.innerWidth, Math.max(window.innerHeight / 5, 100));
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
  }

  function onResolutionChange(evt: any) {
    let newResolutionScale = parseFloat(evt.target.value);
    renderer.setPixelRatio(window.devicePixelRatio / newResolutionScale);
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
  }

  function animate() {
    let currentTime = new Date().getTime();
    let timeSinceLastUpdate = currentTime - lastUpdate;
    lastUpdate = currentTime;

    requestAnimationFrame(animate);
    render(timeSinceLastUpdate);
  }

  function render(timeDelta: number) {
    uniforms.time.value += timeDelta ? timeDelta / 1000 : 0.05;
    renderer.render(scene, camera);
  }

  useEffect(() => {
    /* boot */
    init(false);
    animate();
  }, []);

  return (
    <div>
      <Node shader={shaders.helloBlue} />
      <div id="container"></div>
      <div id="info">
        Rainbow Pulse - GLSL shader - with{" "}
        <a href="https://threejs.org" target="_blank">
          three.js
        </a>
      </div>
      <div id="controls">
        <label htmlFor="resolution">resolution: </label>
        <select id="resolution" value="2">
          <option value="0.5">0.5x</option>
          <option value="1" selected>
            1x
          </option>
          <option value="2">2x</option>
          <option value="4">4x</option>
          <option value="8">8x</option>
        </select>
      </div>
    </div>
  );
}

export default RainbowPulse;
