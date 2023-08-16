import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';

const BlazePoseComponent = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBlazePose = async () => {
    console.log('Running BlazePose');

    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: 'mediapipe',
      modelType: 'full'
    };

    const detector = await poseDetection.createDetector(model, detectorConfig);

    const webcam = webcamRef.current;
    const canvas = canvasRef.current;
    canvas.width = webcam.video.videoWidth;
    canvas.height = webcam.video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const poses = await detector.estimatePoses(webcam.video);
    console.log(poses);
    console.log("helo");
    console.log("hi"+poses);

    setTimeout(runBlazePose, 5000); 
  };

  useEffect(() => {
    tf.setBackend('webgl');
    runBlazePose();
  }, []);

  return (
    <div>
      <Webcam ref={webcamRef} mirrored={true} />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BlazePoseComponent;
