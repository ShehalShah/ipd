import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import back from "../assets/posture.png"

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen bg-white'>
        <img src={back} alt=""  className='h-[36rem] p-3 border-2 border-yellow-200 rounded-lg'/>
    </div>
  );
};

export default Home;