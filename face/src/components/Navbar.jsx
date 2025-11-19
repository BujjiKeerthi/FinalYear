// Navbar.js
import React from 'react';
import image from '../assets/Spotify.png';
import { IoMdPerson } from "react-icons/io";
import Camera from './Camera';
import { Link } from 'react-router-dom';

const Navbar = ({ keyword, setKeyword, getTracks }) => {
  return (
    <nav className="bg-gray-900 text-white p-8 sticky top-0 scroll-smooth">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src={image} alt="Spotify Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">Moodify</span>
        </div>
        <div className="flex items-center space-x-2 w-1/2 gap-5">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)} // This should work
            type="text"
            placeholder="Search..."
            className="px-3 py-1 rounded-md text-black focus:outline-none w-full"
          />    
           <Link to="/camera">
  <IoMdPerson className='text-2xl' />
</Link>
          <button
            onClick={getTracks}
            className="bg-purple-500 px-8 py-2 rounded-md hover:bg-purple-600"
          >
            Go
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
