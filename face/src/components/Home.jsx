import React, { useState, useRef, useEffect } from "react";
import Navbar from './Navbar';
import Search from './Search';
import HomeComponent from './HomeComponent';

function Home() {
  const [keyword, setKeyword] = useState(""); // optional if you still want search
  const [tracks, setTracks] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const audioRef = useRef(null);
  const [isSearch, setIsSearch] = useState(false);

  // Fetch default songs automatically on component mount
  useEffect(() => {
    const fetchDefaultTracks = async () => {
      try {
        // Example: fetch top tracks for a default keyword or playlist
        const defaultKeyword = "kannada"; // you can change this
        const response = await fetch(
          `https://v1.nocodeapi.com/pavankajol/spotify/KDRVVRLEWygrHYNE/search?q=${defaultKeyword}&type=track`
        );
        const data = await response.json();

        if (data.tracks && data.tracks.items) {
          setTracks(data.tracks.items);
          setIsSearch(true); // show results immediately
        } else {
          console.error("No tracks found");
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchDefaultTracks();
  }, []);

  const getTracks = async () => {
    try {
      const response = await fetch(
        `https://v1.nocodeapi.com/pavankajol/spotify/KDRVVRLEWygrHYNE/search?q=${keyword}&type=track`
      );
      const data = await response.json();

      if (data.tracks && data.tracks.items) {
        setTracks(data.tracks.items);
        setIsSearch(true);
      } else {
        console.error("No tracks found");
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

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
    <div>
      <Navbar keyword={keyword} setKeyword={setKeyword} getTracks={getTracks} />

      {!isSearch ? (
        <HomeComponent /> 
      ) : (
        <Search
          tracks={tracks}
          currentTrackId={currentTrackId}
          handleCardClick={handleCardClick}
        />
      )}
    </div>
  );
}

export default Home;
