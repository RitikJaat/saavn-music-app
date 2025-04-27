import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, 
  FaMusic, FaArrowLeft, FaList, FaPlus, FaSearch } from '../icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { decodeHtmlEntities, getBestImageUrl } from '../utils/helpers';

// Format time in minutes:seconds
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

const PlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [repeatOn, setRepeatOn] = useState(false);
  
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
    queue,
  } = useMusicPlayer();

  useEffect(() => {
    // Animation entrance effect
    setIsAnimatingIn(true);
    const timer = setTimeout(() => {
      setIsAnimatingIn(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGoBack = () => {
    // Start exit animation
    setIsAnimatingIn(true);
    
    // Wait for animation, then navigate back
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const toggleShuffle = () => {
    setShuffleOn(!shuffleOn);
    // Logic for shuffling would be implemented in the context
  };
  
  const toggleRepeat = () => {
    setRepeatOn(!repeatOn);
    // Logic for repeat would be implemented in the context
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  if (!currentSong) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 flex items-center justify-center p-6">
        <div className="glass-dark p-12 rounded-xl text-center">
          <h2 className="text-xl font-bold text-white mb-6">No song is currently playing</h2>
          <button
            onClick={handleGoBack}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 flex flex-col p-6 
        transition-all duration-300 ease-in-out 
        ${isAnimatingIn ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleGoBack}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <FaArrowLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-white font-bold text-lg">Now Playing</h1>
        </div>
        <button className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
          <FaList size={20} />
        </button>
      </div>
      
      {/* Album Art */}
      <div className="flex-1 flex justify-center items-center mb-8">
        <div className={`relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-lg overflow-hidden shadow-2xl
          transition-all duration-500 ${isPlaying ? 'scale-100' : 'scale-95'}`}>
          <img 
            src={getBestImageUrl(currentSong.image)} 
            alt={currentSong.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAABZ0RVh0Q3JlYXRpb24gVGltZQAwMS8wOC8xMOr+6FIAAAPsSURBVHic7dyxjsIwFABBfOL/f9lXXIu2cC44ZqYGWysW2bFsN8MwjAFc2j79B8AnEwhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCETBQAR=';
            }}
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={handlePlayPause}
              className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-indigo-900 hover:bg-opacity-90 transition-colors"
            >
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ml-1.5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Song Info */}
      <div className="mb-8 text-center">
        <h2 className="text-white text-xl font-bold mb-2">{decodeHtmlEntities(currentSong.name)}</h2>
        <p className="text-gray-400">{decodeHtmlEntities(currentSong.primaryArtists)}</p>
        <div className="flex justify-center mt-4 space-x-6">
          <button 
            onClick={toggleFavorite}
            className={`text-2xl transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
          >
            <FaMusic />
          </button>
        </div>
      </div>
      
      {/* Seekbar */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <span className="text-xs text-gray-400 w-12">{formatTime(currentTime)}</span>
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
          <span className="text-xs text-gray-400 w-12 text-right">{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="mb-8">
        <div className="flex justify-center items-center space-x-8">
          <button 
            onClick={toggleShuffle}
            className={`text-lg ${shuffleOn ? 'text-purple-400' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            <FaSearch />
          </button>
          
          <button
            onClick={prevSong}
            className="text-white hover:text-purple-400 transition-colors text-xl"
          >
            <FaStepBackward />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="bg-white rounded-full w-14 h-14 flex items-center justify-center text-indigo-900 hover:bg-opacity-90 transition-colors"
          >
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} className="ml-1" />}
          </button>
          
          <button
            onClick={nextSong}
            className="text-white hover:text-purple-400 transition-colors text-xl"
          >
            <FaStepForward />
          </button>
          
          <button 
            onClick={toggleRepeat}
            className={`text-lg ${repeatOn ? 'text-purple-400' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            <FaMusic />
          </button>
        </div>
      </div>
      
      {/* Volume Control */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center w-full max-w-md">
          <FaVolumeMute className="text-gray-400 mr-2" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <FaVolumeUp className="text-gray-400 ml-2" />
        </div>
      </div>
      
      {/* Queue Preview */}
      {queue.length > 0 && (
        <div className="mt-auto pt-4">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Coming Up Next ({queue.length})</h3>
          <div className="glass-dark rounded-lg p-3 max-h-32 overflow-y-auto">
            {queue.slice(0, 3).map((song, index) => (
              <div key={index} className="flex items-center mb-2 last:mb-0">
                <img 
                  src={getBestImageUrl(song.image)} 
                  alt={song.name} 
                  className="w-10 h-10 rounded object-cover mr-3"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAABZ0RVh0Q3JlYXRpb24gVGltZQAwMS8wOC8xMOr+6FIAAAPsSURBVHic7dyxjsIwFABBfOL/f9lXXIu2cC44ZqYGWysW2bFsN8MwjAFc2j79B8AnEwhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCETBQAR=';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{decodeHtmlEntities(song.name)}</p>
                  <p className="text-gray-500 text-xs truncate">{decodeHtmlEntities(song.primaryArtists)}</p>
                </div>
              </div>
            ))}
            {queue.length > 3 && (
              <p className="text-gray-500 text-xs mt-2 text-center">
                +{queue.length - 3} more song{queue.length - 3 !== 1 ? 's' : ''} in queue
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerPage; 