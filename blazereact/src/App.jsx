import React, { useEffect } from 'react';
import BlazePoseComponent from './BlazePoseComponent';
import * as tracker from './tracker.js';
import * as app from "./app.js";
import "./App.css"
// Import TensorFlow.js dependencies
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-converter';

// Import pose-detection related dependencies
import * as poseDetection from '@tensorflow-models/pose-detection';

// Import Three.js
import * as THREE from 'three';

// Import scatter-gl
import ScatterGL from 'scatter-gl';

function App() {

  // useEffect(() => {
  //   console.log("yo");
  //   let source = 'camera'; // camera|video|stream
  //   let sourceVideo = '';
  //   let defaultVideo = 'mp4/whatislove.mp4';
  //   let defaultStream =
  //     'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8';
  //   let model = 'MoveNetSinglePoseLightning';

  //   // initialize app
  //   app.init();

  //   // initialize AI tracker model
  //   tracker.setModel(model);
  //   tracker.autofit = true; // enable auto resize/fit

  //   // set-up hooks
  //   tracker.on('statuschange', function (msg) {
  //     app.updateStatus(msg);
  //   });
  //   tracker.on('beforeupdate', function (poses) {
  //     app.updateDebug(poses);
  //     app.updateCounter(poses);
  //   });

  //   // config
  //   tracker.elCanvas = '#canvas';
  //   tracker.elVideo = '#video';
  //   tracker.el3D = '#view_3d';
  //   tracker.pointWidth = 6;
  //   tracker.pointRadius = 8;

  //   // run predictions
  //   tracker.run(source);
  // }, []);

  return (
    <div className="App">
      {/* <header classNameName="App-header"> */}
      <BlazePoseComponent />
      {/* </header> */}
      {/* <div className="gh">
        <div className="demo version-section"><a target="_blank" href="https://github.com/szczyglis-dev/js-ai-body-tracker"
          className="github-corner" aria-label="View source on GitHub">
          <svg width="80" height="80" viewBox="0 0 250 250"
            style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor" style="transform-origin: 130px 106px;" className="octo-arm"></path>
            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              fill="currentColor" className="octo-body"></path>
          </svg>
        </a>
        </div>
      </div>
      <div id="controls">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <button type="button" id="source-camera" className="source-select btn btn-primary" data-source="camera" >WEBCAM</button>
                <button type="button" id="source-video" className="source-select btn btn-primary" data-source="video" >VIDEO</button>
                <button type="button" id="source-stream" className="source-select btn btn-primary" data-source="stream">STREAM (IPTV / m3u8)</button>
              </div>
              <div className="col-md-6">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <span>MODEL</span>
                    </div>
                  </div>
                  <select name="model" id="model_select" className="form-control d-inline-block">
                    <option value="MoveNetSinglePoseLightning">2D only (FAST) singlepose (faster) / MoveNet </option>
                    <option value="MoveNetSinglePoseThunder">2D only (FAST) singlepose (slower) / MoveNet </option>
                    <option value="MoveNetMultiPoseLightning">2D only (FAST) multipose / MoveNet</option>
                    <option value="PoseNetMobileNetV1">2D only (SLOW) singlepose (faster) / PoseNet-MobileNetV1 </option>
                    <option value="PoseNetResNet50">2D only (SLOW) singlepose (slower) / PoseNet-ResNet50</option>
                    <option value="BlazePoseLite">2D + 3D singlepose (faster) / BlazePose</option>
                    <option value="BlazePoseHeavy">2D + 3D singlepose (slower) / BlazePose</option>
                    <option value="BlazePoseFull">2D + 3D singlepose (optimal) / BlazePose</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        <button id="btn_toggle_ai" className="btn btn-secondary">AI TRACKING ON/OFF</button>
        <button id="btn_toggle_video" className="btn btn-secondary">VIDEO ON/OFF</button>
        <button id="btn_toggle_3d" className="btn btn-secondary">3D VIEW ON/OFF</button>
        <button id="btn_toggle_debug" className="btn btn-secondary">DEBUG ON/OFF</button>

        <div id="video_src_area" style="display:none" className="text-center mt-3">
          <div className="container justify-content-center">
              <div className="form-row justify-content-center">
                <div className="col-10 text-right">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <span id="video_src_prefix"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <button id="btn_load_src" className="btn btn-primary">LOAD</button>
                </div>
              </div>
          </div>
          <div className="mt-2 text-center">
            <b>Tip:</b> click on "PLAY" icon to play or change video source URL and click "LOAD" button.
          </div>
        </div>
      </div>
      <button id="btn_toggle_controls" className="btn btn-primary">SHOW/HIDE CONTROLS</button>

      <div className="mt-2 text-center" id="status"></div>

      <div id="wrapper" className="container-fluid">
        <canvas id="canvas"></canvas>
        <video id="video" className="video-js vjs-fluid vjs-default-skin" preload="metadata">
          <source src="" />
        </video>
        <div id="info_debug"></div>
        <div id="info_counter"></div>
      </div>
      <div id="view_3d"></div>
      <div className="footer"><b>JS AI BODY TRACKER</b> v.1.0.0 | © 2022 Marcin "szczyglis" Szczyglinski | <a href="https://github.com/szczyglis-dev/js-ai-body-tracker" target="_blank">GitHUB</a></div>

     */}
     </div>
  );
}

export default App;
