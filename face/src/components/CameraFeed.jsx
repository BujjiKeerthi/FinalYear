import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://127.0.0.1:5000');  // Make sure this matches your Flask server address

const CameraFeed = () => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [emotion, setEmotion] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isCameraStarted, setIsCameraStarted] = useState(false); // Track if the camera has started

  useEffect(() => {
    // Listen for emotion detection events from Flask
    socket.on('emotion_detected', (data) => {
      setEmotion(data.emotion);
    });

    // Listen for camera status changes (stopped or restarted)
    socket.on('camera_stopped', (data) => {
      setStatusMessage(data.message);  // Display camera stopping message
    });

    socket.on('camera_restarted', (data) => {
      setStatusMessage('Camera has been restarted');  // Set status when camera is restarted
      setIsCameraActive(true); // Restart the camera feed
      setIsCameraStarted(true); // Set camera as started after restart
    });

    // Cleanup on component unmount
    return () => {
      socket.off('emotion_detected');
      socket.off('camera_stopped');
      socket.off('camera_restarted');
    };
  }, []);

  const handleRestartCamera = () => {
    setIsCameraActive(false);  // Stop the camera feed
    setStatusMessage('Camera is restarting...');  // Show restart message
    socket.emit('restart_camera');  // Emit the restart event to Flask
    setIsCameraStarted(false); // Reset the camera started flag before restart
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      {/* Display the webcam stream */}
      {isCameraActive ? (
        <div className='text-center'>
          <h2>Emotion: {emotion}</h2>
          {/* Uncomment below to display the actual video feed */}
          {/* <img id="video" src="http://127.0.0.1:5000/video_feed" alt="Webcam Feed" /> */}
        </div>
      ) : (
        <p>{statusMessage}</p>  // Show the camera status message (e.g., "Camera is restarting...")
      )}

      {/* Show message when the camera is started */}
      {isCameraStarted && <p>Camera has started.</p>}

      {/* Button to restart the camera */}
      <button onClick={handleRestartCamera} className="text-black bg-white rounded-2xl p-2">
        Restart Camera
      </button>
    </div>
  );
};

export default CameraFeed;
