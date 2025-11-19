// src/components/Camera.jsx

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import CameraFeed from "./CameraFeed";
import "../App.css";

const socket = io("http://127.0.0.1:5000");

const albumsData = {
  Angry: [
    { name: "Obbane", src: "src/Songs/Obbane(256k).mp3", coverImage: "src/images/obbane.jpeg" },
    { name: "Salaga Title Track", src: "src/Songs/Salaga__Title_Track___From__Salaga__(256k).mp3", coverImage: "src/images/salaga.jpeg" },
    { name: "Ba Ba Ba Na Ready", src: "src/Songs/Ba_Ba_Ba_Na_Ready(256k).mp3", coverImage: "src/images/baa.jpeg" },
  ],
  Happy: [
    { name: "Dwapara", src: "src/Songs/Dwapara(256k).mp3", coverImage: "src/images/Krishnam.jpeg" },
    { name: "Ra_Ra_Rakkamma", src: "src/Songs/Ra_Ra_Rakkamma(256k).mp3", coverImage: "src/images/rona.jpeg" },
    { name: "Innu Bekagide", src: "src/Songs/Innunu_Bekagide(256k).mp3", coverImage: "src/images/innu.jpeg" },
  ],
  Sad: [
    { name: "Annthamma", src: "src/Songs/Anntamma.mp3", coverImage: "src/images/Rama.png" },
    { name: "Oh_Manase_Manase", src: "src/Songs/Oh_Manase_Manase(256k).mp3", coverImage: "src/images/gaja.jpeg" },
    { name: "Mungaru_Maleye", src: "src/Songs/Mungaru_Maleye(256k).mp3", coverImage: "src/images/mugaru.jpeg" },
  ],
};

function Camera() {
  const [emotion, setEmotion] = useState("");
  const [currentAlbums, setCurrentAlbums] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [cameraStopped, setCameraStopped] = useState(false);

  useEffect(() => {
    socket.on("emotion_detected", (data) => {
      setEmotion(data.emotion);

      if (albumsData[data.emotion]) {
        setCurrentAlbums(albumsData[data.emotion]);
      } else {
        setCurrentAlbums([]);
      }

      socket.emit("stop_camera");
    });

    socket.on("camera_stopped", () => {
      setCameraStopped(true);
    });

    return () => {
      socket.off("emotion_detected");
      socket.off("camera_stopped");
    };
  }, []);

  useEffect(() => {
    if (currentAlbums.length > 0) {
      playSong(currentAlbums[0], 0);
    }
  }, [currentAlbums]);

  const playSong = (album, index) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(album.src);
    audio.play().catch(console.error);

    setCurrentAudio(audio);
    setActiveAlbum(index);
  };

  const handleAlbumClick = (album, index) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(album.src);
    setCurrentAudio(audio);
    setActiveAlbum(index);
    audio.play();
  };

  return (
    <div className="font-sans text-white min-h-screen bg-gray-900">
      <h1 className="text-center text-2xl py-4">Emotion-Based Album Player</h1>
      <p className="text-center text-gray-300 mb-4">
        Detected Emotion: {emotion || "No emotion detected yet."}
      </p>

      {cameraStopped && (
        <p className="text-center text-gray-500 mb-4">
          The camera has been stopped after detecting emotion.
        </p>
      )}

      <CameraFeed />

      {/* Albums */}
      <div className="p-6">
        <div className="flex flex-wrap justify-center gap-6">
          {currentAlbums.length > 0 ? (
            currentAlbums.map((album, index) => (
              <div
                key={index}
                className={`relative bg-white text-black rounded-lg shadow-lg w-72 h-96 cursor-pointer transform transition-transform duration-300 ${
                  activeAlbum === index ? "scale-105 border-4 border-purple-400" : ""
                }`}
                onClick={() => handleAlbumClick(album, index)}
              >
                <img
                  src={album.coverImage}
                  alt={album.name}
                  className="w-full h-56 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold">{album.name}</h4>
                  <p className="text-gray-600 capitalize">{emotion}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No albums available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Camera;
