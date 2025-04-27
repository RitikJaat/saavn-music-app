import React, { useEffect, useState } from 'react';
import { FaMusic, FaPlayCircle, FaClock } from '../icons';
import SongCard from '../components/SongCard';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Song } from '../types';
import { decodeHtmlEntities, getBestImageUrl, safeParseInt } from '../utils/helpers';

const LibraryPage: React.FC = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const { currentSong, queue } = useMusicPlayer();

  // In a real app, this would be stored in localStorage or a backend
  // For demo purposes, we'll just track current session's played songs
  useEffect(() => {
    if (currentSong && !recentlyPlayed.some(song => song.id === currentSong.id)) {
      setRecentlyPlayed(prev => [currentSong, ...prev.slice(0, 9)]);
    }
  }, [currentSong, recentlyPlayed]);

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Your Library</h1>
        
        <div className="glass-dark rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold">Local Music Library</h2>
              <p className="text-gray-400 text-sm mt-1">
                Your music is saved locally in this browser. No account needed.
              </p>
            </div>
            
            <div className="flex space-x-4 text-center">
              <div className="glass rounded-lg p-4 w-32">
                <FaPlayCircle className="text-purple-400 text-2xl mx-auto mb-2" />
                <p className="text-sm text-gray-300">{recentlyPlayed.length} Played</p>
              </div>
              
              <div className="glass rounded-lg p-4 w-32">
                <FaClock className="text-pink-400 text-2xl mx-auto mb-2" />
                <p className="text-sm text-gray-300">{queue.length} In Queue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Played */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
        
        {recentlyPlayed.length === 0 ? (
          <div className="glass p-10 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <FaMusic className="text-4xl mb-4 opacity-50" />
            <p>You haven't played any songs yet</p>
            <p className="text-sm mt-2">Play some music to see your history here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>

      {/* Queue */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Coming Up Next</h2>
        
        {queue.length === 0 ? (
          <div className="glass p-10 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <FaClock className="text-4xl mb-4 opacity-50" />
            <p>Your queue is empty</p>
            <p className="text-sm mt-2">Add songs to your queue to see them here</p>
          </div>
        ) : (
          <div className="glass rounded-lg overflow-hidden divide-y divide-gray-700">
            {queue.map((song, index) => (
              <div key={song.id} className="flex items-center p-4 hover:bg-white hover:bg-opacity-5">
                <div className="w-8 text-center text-gray-400 mr-4">
                  {index + 1}
                </div>
                
                {song.image && (
                  <img
                    src={getBestImageUrl(song.image)}
                    alt={song.name || song.title || ''}
                    className="h-10 w-10 rounded mr-4 object-cover"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">
                    {song.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    {song.primaryArtists}
                  </p>
                </div>
                
                <div className="text-xs text-gray-400 ml-4">
                  {Math.floor(safeParseInt(song.duration) / 60)}:
                  {(safeParseInt(song.duration) % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LibraryPage; 