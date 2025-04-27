import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaTrophy, FaList, FaFire } from '../icons';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="w-full p-6 flex flex-col border-b border-white/5">
      <div className="mb-6">
        <Link to="/" className="text-white text-2xl font-bold">Saavn</Link>
      </div>
      
      <div className="flex flex-col space-y-5">
        <div className="space-y-2">
          <h2 className="text-gray-400 uppercase text-xs font-bold tracking-wider">Menu</h2>
          <ul className="space-y-1">
            <li className={`${currentPath === '/' ? 'text-white bg-white/10' : 'text-gray-400'} flex items-center space-x-3 rounded-md p-2 hover:text-white transition-colors cursor-pointer`}>
              <Link to="/" className="flex items-center space-x-3 w-full">
                <FaHome size={18} />
                <span>Home</span>
              </Link>
            </li>
            <li className={`${currentPath === '/search' ? 'text-white bg-white/10' : 'text-gray-400'} flex items-center space-x-3 rounded-md p-2 hover:text-white transition-colors cursor-pointer`}>
              <Link to="/search" className="flex items-center space-x-3 w-full">
                <FaSearch size={18} />
                <span>Search</span>
              </Link>
            </li>
            <li className={`${currentPath === '/library' ? 'text-white bg-white/10' : 'text-gray-400'} flex items-center space-x-3 rounded-md p-2 hover:text-white transition-colors cursor-pointer`}>
              <Link to="/library" className="flex items-center space-x-3 w-full">
                <FaList size={18} />
                <span>Your Library</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-gray-400 uppercase text-xs font-bold tracking-wider">Discover</h2>
          <ul className="space-y-1">
            <li className={`${currentPath === '/trending' ? 'text-white bg-white/10' : 'text-gray-400'} flex items-center space-x-3 rounded-md p-2 hover:text-white transition-colors cursor-pointer`}>
              <Link to="/trending" className="flex items-center space-x-3 w-full">
                <FaTrophy size={18} />
                <span>Top Charts</span>
              </Link>
            </li>
            <li className={`${currentPath === '/new-releases' ? 'text-white bg-white/10' : 'text-gray-400'} flex items-center space-x-3 rounded-md p-2 hover:text-white transition-colors cursor-pointer`}>
              <Link to="/new-releases" className="flex items-center space-x-3 w-full">
                <FaFire size={18} />
                <span>New Releases</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 