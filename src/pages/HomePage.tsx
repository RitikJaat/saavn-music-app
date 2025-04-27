import React, { useEffect, useState } from 'react';
import { getTrendingSongs } from '../services/api';
import { Song } from '../types';
import SongCard from '../components/SongCard';
import SearchBar from '../components/SearchBar';

const HomePage: React.FC = () => {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Discover Music</h1>
        <SearchBar className="max-w-2xl" />
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Trending Songs</h2>
        </div>

        {loading ? (
          <div className="glass p-10 rounded-lg flex items-center justify-center">
            <div className="animate-pulse">Loading trending songs...</div>
          </div>
        ) : error ? (
          <div className="glass p-10 rounded-lg flex items-center justify-center text-red-400">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <div className="glass-dark rounded-lg p-6 flex flex-col md:flex-row items-center">
          <div className="flex-1 mb-4 md:mb-0 md:mr-6">
            <h2 className="text-xl font-semibold mb-2">No Signup Needed</h2>
            <p className="text-gray-300 mb-4">
              Enjoy your favorite music without creating an account. Just search, click, and play.
            </p>
            <p className="text-gray-400 text-sm">
              Powered by Saavn API
            </p>
          </div>
          <div className="flex-shrink-0">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3059/3059484.png" 
              alt="Music" 
              className="w-32 h-32 object-contain opacity-80"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 