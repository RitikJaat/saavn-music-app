import React, { useState } from 'react';
import { FaPlay, FaPause, FaPlus } from '../icons';
import { Song } from '../types';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { decodeHtmlEntities, getBestImageUrl } from '../utils/helpers';

interface SongCardProps {
  song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    pauseSong, 
    resumeSong,
    addToQueue 
  } = useMusicPlayer();
  
  const isCurrentSong = currentSong?.id === song.id;
  
  const handlePlayClick = () => {
    if (isCurrentSong) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
  };

  // Default placeholder image as data URI
  const placeholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22500%22%20height%3D%22500%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20500%20500%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23919191%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A25pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22500%22%20height%3D%22500%22%20fill%3D%22%23232323%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22173%22%20y%3D%22256%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
  
  const errorImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22500%22%20height%3D%22500%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20500%20500%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23f05252%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A25pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22500%22%20height%3D%22500%22%20fill%3D%22%23232323%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22173%22%20y%3D%22256%22%3EError%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

  // Ensure we have an image to display
  const songImage = song.image && song.image.length > 0 
    ? getBestImageUrl(song.image) 
    : placeholderImage;

  return (
    <div 
      className="glass p-3 rounded-lg flex flex-col overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={handlePlayClick}
    >
      <div className="relative group">
        <img 
          src={songImage}
          alt={song.name}
          className="w-full aspect-square object-cover rounded-md mb-3" 
          onError={(e) => {
            e.currentTarget.src = errorImage;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
          <button 
            className="bg-white rounded-full p-3 text-indigo-700 hover:scale-110 transition-transform"
          >
            {isCurrentSong && isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-start">
        <div className="flex-1 overflow-hidden">
          <h3 className="text-sm font-medium text-white truncate">{decodeHtmlEntities(song.name)}</h3>
          <p className="text-xs text-gray-400 truncate">{decodeHtmlEntities(song.primaryArtists)}</p>
        </div>
        <button 
          onClick={handleAddToQueue}
          className="text-gray-400 hover:text-white p-1 transition-colors"
          title="Add to queue"
        >
          <FaPlus size={14} />
        </button>
      </div>
    </div>
  );
};

export default SongCard; 