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
      runtime: 'tfjs',
      enableSmoothing: true,
      modelType: 'lite'
    };

    const detector = await poseDetection.createDetector(model, detectorConfig);

    const webcam = webcamRef.current;
    const canvas = canvasRef.current;
    console.log(webcam.video);
    canvas.width = webcam.video.videoWidth;
    canvas.height = webcam.video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
      // Get the base64 image data
      const base64Image = webcamRef.current.getScreenshot();

      // Convert base64 to ImageData
      const img = new Image();
      img.src = base64Image;
      await img.decode(); // Wait for image to load
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Estimate poses using the canvas image data
      const poses = await detector.estimatePoses(image);

      if (poses.length > 0) {
        console.log('Poses:', poses);
        console.log('Keypoints of the first pose:', poses[0].keypoints);
        console.log('3D Keypoints of the first pose:', poses[0].keypoints3D);
        // poses[0].keypoints.forEach((keypoint, index) => {
        //   console.log(`Keypoint ${index}: x=${keypoint.x}, y=${keypoint.y}`);
        // });
      } else {
        console.log('No poses detected.');
      }
    } catch (error) {
      console.error('Pose estimation error:', error);
    }

    setTimeout(runBlazePose, 5000);
  };

  useEffect(() => {
    tf.setBackend('webgl');

    const loadVideo = async () => {
      await webcamRef.current.video.play(); // Play the video to make sure it's loaded
      runBlazePose(); // Start pose estimation
    };

    loadVideo();
  }, []);

  return (
    <div>
      <Webcam ref={webcamRef} mirrored={true} />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BlazePoseComponent;
