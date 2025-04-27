import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaArrowLeft } from '../icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { decodeHtmlEntities, getBestImageUrl } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const formatTime = (time: number): string => {
  if (time && !isNaN(time)) {
    const minutes = Math.floor(time / 60);
    const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(time % 60);
    const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formatMinutes}:${formatSeconds}`;
  }
  return '00:00';
};

const MusicPlayer: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    pauseSong,
    resumeSong,
    nextSong,
    prevSong,
    setVolume,
    seekTo,
  } = useMusicPlayer();
  
  const [showVolume, setShowVolume] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };
  
  const handleNavigateToPlayer = () => {
    if (!currentSong) return;
    
    // Start transition animation
    setIsTransitioning(true);
    
    // Navigate after a short delay to allow animation
    setTimeout(() => {
      navigate('/player');
      
      // Reset transition state after navigation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  const handleMute = () => {
    if (isMuted) {
      setVolume(prevVolume || 0.7);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  if (!currentSong) {
    return (
      <div className="glass-dark fixed bottom-0 left-0 right-0 h-20 px-4 flex items-center justify-center">
        <p className="text-white text-opacity-60">Select a song to play</p>
      </div>
    );
  }

  return (
      <div className={`glass-dark fixed bottom-0 left-0 right-0 h-20 px-4 py-2 transition-all duration-200 
                      ${isTransitioning ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="container mx-auto flex items-center h-full">
          {/* Song info */}
          <div 
            onClick={handleNavigateToPlayer}
            className="flex-shrink-0 flex items-center w-1/4 cursor-pointer group"
          >
          {currentSong.image && (
              <img
              src={getBestImageUrl(currentSong.image)}
              alt={currentSong.name || currentSong.title || ''}
                className="h-12 w-12 rounded mr-3 object-cover group-hover:shadow-lg transition-shadow"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/48?text=Error';
                }}
              />
            )}
            <div className="truncate">
              <h4 className="text-white text-sm font-medium truncate">{decodeHtmlEntities(currentSong.name)}</h4>
              <p className="text-gray-400 text-xs truncate">{decodeHtmlEntities(currentSong.primaryArtists)}</p>
            </div>
            <button className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white">
              <FaArrowLeft size={14} />
            </button>
          </div>

          {/* Player controls */}
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="flex items-center mb-1">
              <button
                onClick={prevSong}
                className="text-gray-400 hover:text-white mx-2 transition-colors"
              >
                <FaStepBackward />
              </button>
              <button
                onClick={handlePlayPause}
                className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-indigo-900 mx-2 hover:bg-opacity-90 transition-colors"
              >
                {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="ml-0.5" />}
              </button>
              <button
                onClick={nextSong}
                className="text-gray-400 hover:text-white mx-2 transition-colors"
              >
                <FaStepForward />
              </button>
            </div>
            
            <div className="w-full flex items-center">
              <span className="text-xs text-gray-400 w-10">{formatTime(currentTime)}</span>
              <div className="flex-grow mx-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
              <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="w-1/4 flex justify-end items-center relative space-x-4">
            <button
              onClick={handleMute}
              onMouseEnter={() => setShowVolume(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            
            <div 
              className={`absolute bottom-full right-0 mb-2 glass p-2 rounded-lg transition-opacity duration-300 ${
                showVolume ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onMouseLeave={() => setShowVolume(false)}
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default MusicPlayer; 