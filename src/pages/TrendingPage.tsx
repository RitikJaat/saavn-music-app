import React, { useEffect, useState } from 'react';
import { getTrendingSongs } from '../services/api';
import { Song } from '../types';
import SongCard from '../components/SongCard';
import { FaFire, FaPlay, FaPause } from '../icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const TrendingPage: React.FC = () => {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    currentSong,
    isPlaying,
    playSong,
    pauseSong,
    resumeSong,
    addToQueue,
    addMultipleToQueue
  } = useMusicPlayer();

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        setLoading(true);
        const songs = await getTrendingSongs();
        setTrendingSongs(songs);
        setError(null);
      } catch (err) {
        setError('Failed to load trending songs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingSongs();
  }, []);

  const playAllSongs = () => {
    if (trendingSongs.length > 0) {
      console.log('Playing all trending songs');
      // Take the first song to play immediately
      const firstSong = trendingSongs[0];
      // Get remaining songs for the queue
      const remainingSongs = trendingSongs.slice(1);
      
      // Play the first song
      playSong(firstSong);
      
      // Add the rest to queue
      if (remainingSongs.length > 0) {
        console.log(`Adding ${remainingSongs.length} songs to queue from trending`);
        addMultipleToQueue(remainingSongs);
      }
    }
  };

  const isTrendingSongPlaying = isPlaying && currentSong && 
    trendingSongs.some(song => song.id === currentSong.id);

  const toggleTrendingPlay = () => {
    if (isTrendingSongPlaying) {
      pauseSong();
    } else if (currentSong && trendingSongs.some(song => song.id === currentSong.id)) {
      resumeSong();
    } else {
      playAllSongs();
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="glass p-10 rounded-lg flex items-center justify-center">
          <div className="animate-pulse">Loading trending songs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="glass p-10 rounded-lg flex items-center justify-center text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="glass-dark rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="flex items-center justify-center w-40 h-40 rounded-lg glass-dark mb-6 md:mb-0 md:mr-8">
            <FaFire className="text-6xl text-orange-400" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">Trending Now</h1>
            <p className="text-gray-300 mb-6">
              The hottest tracks on SaavnMusic right now
            </p>
            
            <button
              onClick={toggleTrendingPlay}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium flex items-center hover:opacity-90 transition-all mx-auto md:mx-0"
            >
              {isTrendingSongPlaying ? (
                <>
                  <FaPause className="mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" />
                  Play All
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Top Trending Songs</h2>
        
        {trendingSongs.length === 0 ? (
          <div className="glass p-10 rounded-lg flex items-center justify-center text-gray-400">
            No trending songs available right now
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage; 