import React, { useEffect, useRef,useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const BlazePoseComponent = () => {
  const [pos, setpos] = useState("")
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const sendImageToServer = async (base64Image) => {
    const formData = new FormData();
    formData.append('image', base64Image);

    try {
      console.log("f");
      const response = await axios.post('http://localhost:5001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Predicted Posture:', response.data.predicted_posture);
      setpos(response.data.predicted_posture)
    } catch (error) {
      console.error('Error predicting posture:', error);
    }
  };

  const captureImageAndPredict = () => {
    const webcam = webcamRef.current;
    const canvas = canvasRef.current;
    canvas.width = webcam.video.videoWidth;
    canvas.height = webcam.video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(webcam.video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL('image/jpeg'); 
    canvas.toBlob(sendImageToServer, 'image/jpeg');
    // sendImageToServer(base64Image);
  };

  useEffect(() => {
    const loadVideo = async () => {
      await webcamRef.current.video.play(); // Play the video to make sure it's loaded
      setInterval(captureImageAndPredict, 5000); // Capture and predict every 5 seconds
    };

    loadVideo();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen bg-white'>
<h2 className='text-black text-3xl'>{pos.slice(0,1).toUpperCase()+pos.slice(1,pos.length)}</h2>
      <div className='flex'>
      <Webcam ref={webcamRef} mirrored={true} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
    </div>
  );
};

export default BlazePoseComponent;

// import React, { useEffect, useRef } from 'react';
// import Webcam from 'react-webcam';
// import io from 'socket.io-client';

// const BlazePoseComponent = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const socketRef = useRef(null);

//   const captureImageAndPredict = () => {
//     const webcam = webcamRef.current;
//     const canvas = canvasRef.current;
//     canvas.width = webcam.video.videoWidth;
//     canvas.height = webcam.video.videoHeight;

//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(webcam.video, 0, 0, canvas.width, canvas.height);

//     const base64Image = canvas.toDataURL('image/jpeg'); // Convert canvas to base64 JPEG
//     socketRef.current.emit('image', base64Image);
//   };

//   useEffect(() => {
//     const socket = io('http://localhost:5000');
//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('WebSocket connection opened');
//     });

//     socket.on('disconnect', () => {
//       console.log('WebSocket connection closed');
//     });

//     const loadVideo = async () => {
//       await webcamRef.current.video.play(); // Play the video to make sure it's loaded
//       setInterval(captureImageAndPredict, 5000); // Capture and predict every 5 seconds
//     };

//     loadVideo();

//     // Cleanup when component unmounts
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <Webcam ref={webcamRef} mirrored={true} />
//       <canvas ref={canvasRef} style={{ display: 'none' }} />
//     </div>
//   );
// };

// export default BlazePoseComponent;
// import React, { useEffect, useRef } from 'react';
// import Webcam from 'react-webcam';
// import io from 'socket.io-client';

// const BlazePoseComponent = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const socket = io('http://localhost:5000/socket');
    
//     const captureImageAndPredict = () => {
//       const webcam = webcamRef.current;
//       const canvas = canvasRef.current;
//       canvas.width = webcam.video.videoWidth;
//       canvas.height = webcam.video.videoHeight;

//       const ctx = canvas.getContext('2d');
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(webcam.video, 0, 0, canvas.width, canvas.height);

//       const base64Image = canvas.toDataURL('image/jpeg'); // Convert canvas to base64 JPEG
//       socket.emit('image', base64Image);
//     };

//     const loadVideo = async () => {
//       await webcamRef.current.video.play();
//       setInterval(captureImageAndPredict, 5000);
//     };

//     loadVideo();

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <Webcam ref={webcamRef} mirrored={true} />
//       <canvas ref={canvasRef} style={{ display: 'none' }} />
//     </div>
//   );
// };

// export default BlazePoseComponent;


// import React, { useEffect, useRef } from 'react';
// import * as tf from '@tensorflow/tfjs-core';
// import * as poseDetection from '@tensorflow-models/pose-detection';
// import '@tensorflow/tfjs-backend-webgl';
// import Webcam from 'react-webcam';

// const BlazePoseComponent = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);

//   const runBlazePose = async () => {
//     console.log('Running BlazePose');

//     const model = poseDetection.SupportedModels.BlazePose;
//     const detectorConfig = {
//       runtime: 'tfjs',
//       enableSmoothing: true,
//       modelType: 'lite'
//     };

//     const detector = await poseDetection.createDetector(model, detectorConfig);

//     const webcam = webcamRef.current;
//     const canvas = canvasRef.current;
//     console.log(webcam.video);
//     canvas.width = webcam.video.videoWidth;
//     canvas.height = webcam.video.videoHeight;

//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     try {
//       // Get the base64 image data
//       const base64Image = webcamRef.current.getScreenshot();

//       // Convert base64 to ImageData
//       const img = new Image();
//       img.src = base64Image;
//       await img.decode(); // Wait for image to load
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//       const image = ctx.getImageData(0, 0, canvas.width, canvas.height);

//       // Estimate poses using the canvas image data
//       const poses = await detector.estimatePoses(image);

//       if (poses.length > 0) {
//         console.log('Poses:', poses);
//         console.log('Keypoints of the first pose:', poses[0].keypoints);
//         console.log('3D Keypoints of the first pose:', poses[0].keypoints3D);
//         // poses[0].keypoints.forEach((keypoint, index) => {
//         //   console.log(`Keypoint ${index}: x=${keypoint.x}, y=${keypoint.y}`);
//         // });
//       } else {
//         console.log('No poses detected.');
//       }
//     } catch (error) {
//       console.error('Pose estimation error:', error);
//     }

//     setTimeout(runBlazePose, 5000);
//   };

//   useEffect(() => {
//     tf.setBackend('webgl');

//     const loadVideo = async () => {
//       await webcamRef.current.video.play(); // Play the video to make sure it's loaded
//       runBlazePose(); // Start pose estimation
//     };

//     loadVideo();
//   }, []);

//   return (
//     <div>
//       <Webcam ref={webcamRef} mirrored={true} />
//       <canvas ref={canvasRef} />
//     </div>
//   );
// };

// export default BlazePoseComponent;

