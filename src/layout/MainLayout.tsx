import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MusicPlayer from '../components/MusicPlayer';
import Queue from '../components/Queue';
import { FaMusic } from '../icons';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side Container */}
      <div className="h-full flex flex-col w-64 min-w-64 bg-black/30 backdrop-blur-xl">
        {/* Sidebar Navigation */}
        <div className="flex-shrink-0">
        <Sidebar />
        </div>
        
        {/* Queue - Make it fill available space */}
        <div className="flex-grow overflow-auto mx-2 mt-4 scrollbar-hide">
          <h2 className="text-white text-xl font-bold px-3 mb-2">Queue</h2>
          <Queue className="h-full" />
        </div>
        
        {/* Premium Banner */}
        <div className="mx-3 mb-24 mt-2">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl">
            <p className="text-white font-medium mb-1">Listen Without Limits</p>
            <p className="text-white/80 text-xs mb-1">Enjoy premium features</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-24 scrollbar-hide relative">
        {/* Playlist Button Fixed on Right Side */}
        <Link 
          to="/playlists"
          className="fixed right-6 top-6 z-10 glass-dark p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          title="Playlists"
        >
          <FaMusic size={22} className="text-white" />
        </Link>
        
        <Outlet />
      </div>
      
      {/* Music Player at bottom */}
      <MusicPlayer />
    </div>
  );
};

export default MainLayout; 