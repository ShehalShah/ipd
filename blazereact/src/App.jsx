import React, { useEffect } from 'react';
import BlazePoseComponent from './components/BlazePoseComponent';
import * as tracker from './tracker.js';
import * as app from "./app.js";
import "./App.css"
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-converter';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as THREE from 'three';
import ScatterGL from 'scatter-gl';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Home />} exact path="/" />
        <Route element={<BlazePoseComponent />} exact path="/blaze" />
      </Routes>
    </Router>
  );
}

export default App;
