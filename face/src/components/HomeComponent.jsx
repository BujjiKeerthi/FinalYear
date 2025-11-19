import React, { useState, useEffect, useRef } from "react";
import Search from "./Search";

const HomeComponent = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const audioRef = useRef(null);


  useEffect(() => {
    const fetchDefaultTracks = async () => {
      try {
        const defaultKeyword = "Kannada"; // Default playlist or mood
        const response = await fetch(
          `https://v1.nocodeapi.com/pavankajol/spotify/KDRVVRLEWygrHYNE/search?q=${defaultKeyword}&type=track`
        );
        const data = await response.json();

        if (data.tracks && data.tracks.items) {
          setTracks(data.tracks.items);
        } else {
          console.error("No tracks found");
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchDefaultTracks();
  }, []);

  // Handle play/pause
  const handleCardClick = (trackId, previewUrl) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (currentTrackId === trackId) {
      setCurrentTrackId(null);
    } else {
      const newAudio = new Audio(previewUrl);
      audioRef.current = newAudio;
      newAudio.play();
      setCurrentTrackId(trackId);
    }
  };

  return (
    <div className="home-component">
      {tracks.length > 0 ? (
        <Search
          tracks={tracks}
          currentTrackId={currentTrackId}
          handleCardClick={handleCardClick}
        />
      ) : (
        <p className="text-center text-gray-500 mt-10">Loading top tracks...</p>
      )}
    </div>
  );
};

export default HomeComponent;
