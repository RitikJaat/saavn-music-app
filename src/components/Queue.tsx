import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Song } from '../types';
import { FaPlay, FaPause, FaTimes } from '../icons';
import { decodeHtmlEntities, getBestImageUrl } from '../utils/helpers';

interface QueueProps {
  className?: string;
}

const Queue: React.FC<QueueProps> = ({ className }) => {
  const { 
    queue, 
    currentSong, 
    isPlaying,
    playSong,
    pauseSong,
    resumeSong,
    removeFromQueue,
    clearQueue
  } = useMusicPlayer();

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song);
    }
  };

  return (
    <div className={`bg-gray-800/50 rounded-lg overflow-y-auto ${className}`}>
      <div className="sticky top-0 bg-gray-800/90 p-3 border-b border-gray-700 flex justify-between items-center">
        <p className="text-gray-400 text-xs">{queue.length} songs in queue</p>
        {queue.length > 0 && (
            <button 
              onClick={clearQueue}
            className="text-gray-400 hover:text-white transition-colors text-xs bg-gray-700 px-2 py-1 rounded"
            >
            Clear
            </button>
        )}
        </div>

        {currentSong && (
        <div className="p-2 border-b border-gray-700">
          <h3 className="text-xs font-semibold text-gray-300 px-2 mb-1">Now Playing</h3>
            <div className="flex items-center p-2 hover:bg-white hover:bg-opacity-5 rounded-md">
              <div 
              className="w-6 h-6 mr-2 flex-shrink-0 cursor-pointer bg-gray-700 rounded-full flex items-center justify-center"
                onClick={() => {
                  if (isPlaying) {
                    pauseSong();
                  } else {
                    resumeSong();
                  }
                }}
              >
                {isPlaying ? (
                <div className="flex space-x-0.5 h-3 items-end justify-center">
                  <div className="w-0.5 bg-purple-400 h-2 animate-pulse"></div>
                  <div className="w-0.5 bg-purple-400 h-3 animate-pulse"></div>
                  <div className="w-0.5 bg-purple-400 h-1.5 animate-pulse"></div>
                  </div>
                ) : (
                <FaPlay className="text-white" size={10} />
                )}
              </div>
              <img 
              src={currentSong.image ? getBestImageUrl(currentSong.image) : 'https://via.placeholder.com/40?text=No+Image'} 
              alt={currentSong.name || currentSong.title || ''} 
              className="w-10 h-10 rounded mr-2"
                onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/40?text=Error';
                }}
              />
              <div className="flex-1 min-w-0">
              <h4 className="text-white text-xs font-medium truncate">
                  {decodeHtmlEntities(currentSong.name)}
                </h4>
                <p className="text-gray-400 text-xs truncate">
                  {decodeHtmlEntities(currentSong.primaryArtists)}
                </p>
              </div>
            </div>
          </div>
        )}

        {queue.length > 0 ? (
        <div className="divide-y divide-gray-700/50">
          <h3 className="text-xs font-semibold text-gray-300 p-2">Next Up</h3>
            {queue.map((song, index) => (
              <div 
                key={`${song.id}-${index}`}
              className="flex items-center p-2 hover:bg-white hover:bg-opacity-5"
              >
              <div className="w-6 text-center text-gray-400 mr-2 text-xs bg-gray-700/50 rounded-full h-6 flex items-center justify-center">
                  {index + 1}
                </div>
                <img 
                src={song.image ? getBestImageUrl(song.image) : 'https://via.placeholder.com/40?text=No+Image'} 
                alt={song.name || song.title || ''} 
                className="w-10 h-10 rounded object-cover mr-2 cursor-pointer"
                  onClick={() => handlePlaySong(song)}
                  onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/40?text=Error';
                  }}
                />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handlePlaySong(song)}>
                <h4 className="text-white text-xs font-medium truncate">
                    {decodeHtmlEntities(song.name)}
                  </h4>
                  <p className="text-gray-400 text-xs truncate">
                    {decodeHtmlEntities(song.primaryArtists)}
                  </p>
                </div>
                <button 
                  onClick={() => removeFromQueue(index)}
                className="text-gray-500 hover:text-white p-1 bg-gray-700/50 rounded-full"
                >
                <FaTimes size={10} />
                </button>
              </div>
            ))}
          </div>
        ) : (
        <div className="p-4 text-center text-gray-400 text-sm">
          Your queue is empty. Add songs to start playing.
          </div>
        )}
    </div>
  );
};

export default Queue; 