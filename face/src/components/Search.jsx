// Search.js
import React from 'react';

const Search = ({ tracks, currentTrackId, handleCardClick }) => {
  return (
    <div className="track-list mt-0 bg-black flex flex-wrap justify-center overflow-hidden scrollbar-none scroll-smooth">
      {tracks.map((element, index) => (
        <div
          key={index}
          className={`max-w-sm rounded overflow-hidden shadow-lg bg-white mx-4 my-4 ${currentTrackId === element.id ? 'border-4 border-purple-500' : ''}`}
          onClick={() => handleCardClick(element.id, element.preview_url)}
        >
          <img src={element.album?.images[0]?.url} className="w-full object-cover" alt={`Album cover for ${element.name}`} />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{element.name}</h2>
            <p className="text-gray-700 text-base">
              by {element.album?.artists[0]?.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search; // Make sure to have this line
