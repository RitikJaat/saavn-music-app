import React, { useEffect, useState } from 'react';
import { getAlbumSongs, getAlbumDetails } from '../services/api';
import { Song, Album } from '../types';
import SongCard from '../components/SongCard';
import { FaFire, FaPlay, FaPause } from '../icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import AlbumCard from '../components/AlbumCard';

// For demo purposes, we'll use a fixed new album ID
const NEW_ALBUM_ID = "1152944601";

const NewReleasesPage: React.FC = () => {
  const [newReleases, setNewReleases] = useState<Song[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    currentSong,
    isPlaying,
    playSong,
    pauseSong,
    resumeSong,
    addToQueue
  } = useMusicPlayer();

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        const albumData = await getAlbumDetails(NEW_ALBUM_ID);
        const songs = await getAlbumSongs(NEW_ALBUM_ID);
        
        if (albumData && songs) {
          setAlbum(albumData);
          setNewReleases(songs);
          setError(null);
        } else {
          setError('Failed to load new releases');
        }
      } catch (err) {
        setError('Failed to load new releases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  const playAllSongs = () => {
    if (newReleases.length > 0) {
      // Play the first song
      playSong(newReleases[0]);
      
      // Add rest to queue
      newReleases.slice(1).forEach(song => {
        addToQueue(song);
      });
    }
  };

  const isNewReleasePlaying = isPlaying && currentSong && 
    newReleases.some(song => song.id === currentSong.id);

  const toggleNewReleasePlay = () => {
    if (isNewReleasePlaying) {
      pauseSong();
    } else if (currentSong && newReleases.some(song => song.id === currentSong.id)) {
      resumeSong();
    } else {
      playAllSongs();
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="glass p-10 rounded-lg flex items-center justify-center">
          <div className="animate-pulse">Loading new releases...</div>
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
            <h1 className="text-2xl font-bold mb-2">New Releases</h1>
            <p className="text-gray-300 mb-6">
              The latest music on SaavnMusic
            </p>
            
            <button
              onClick={toggleNewReleasePlay}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium flex items-center hover:opacity-90 transition-all mx-auto md:mx-0"
            >
              {isNewReleasePlaying ? (
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

      {album && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Album</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AlbumCard album={album} />
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Songs</h2>
        
        {newReleases.length === 0 ? (
          <div className="glass p-10 rounded-lg flex items-center justify-center text-gray-400">
            No new releases available right now
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {newReleases.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewReleasesPage; 