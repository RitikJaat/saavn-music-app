import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaylistDetails } from '../services/api';
import { Song, Playlist } from '../types';
import { FaPlay, FaPause, FaMusic, FaArrowLeft } from '../icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { getBestImageUrl } from '../utils/helpers';
import SongCard from '../components/SongCard';
import usePlaylistSongs from '../hooks/usePlaylistSongs';

const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlaylist, setLoadingPlaylist] = useState(true);
  
  // Use our custom hook to fetch songs
  const { songs, loading: loadingSongs, error: songsError, totalCount } = usePlaylistSongs(id);
  
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
    const fetchPlaylist = async () => {
      if (!id) return;
      
      try {
        setLoadingPlaylist(true);
        
        // Only get playlist details, songs handled by hook
        const playlistData = await getPlaylistDetails(id);
        setPlaylist(playlistData);
      } catch (err) {
        console.error('Error fetching playlist details:', err);
      } finally {
        setLoadingPlaylist(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  // Update loading state based on both playlist and songs loading
  useEffect(() => {
    setLoading(loadingPlaylist || loadingSongs);
  }, [loadingPlaylist, loadingSongs]);

  const playAllSongs = () => {
    if (songs.length > 0) {
      // Play the first song and add the rest to queue in one operation
      const firstSong = songs[0];
      const remainingSongs = songs.slice(1);
      
      // Play first song
      playSong(firstSong);
      
      // Add remaining songs to queue
      if (remainingSongs.length > 0) {
        console.log(`Adding ${remainingSongs.length} songs to queue from playlist`);
        addMultipleToQueue(remainingSongs);
        
        // Show a notification about added songs
        const message = document.createElement('div');
        message.className = 'fixed bottom-24 right-4 glass-dark px-4 py-3 rounded-lg text-white text-sm z-50';
        message.textContent = `Added ${remainingSongs.length} songs to queue`;
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
          if (document.body.contains(message)) {
            document.body.removeChild(message);
          }
        }, 3000);
      }
    }
  };

  const isPlaylistPlaying = isPlaying && currentSong && 
    songs.some(song => song.id === currentSong.id);

  const togglePlaylistPlay = () => {
    if (isPlaylistPlaying) {
      pauseSong();
    } else if (currentSong && songs.some(song => song.id === currentSong.id)) {
      resumeSong();
    } else {
      playAllSongs();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="glass p-10 rounded-lg">
          <h2 className="text-xl text-white">Loading playlist...</h2>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="container mx-auto px-6 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="glass p-10 rounded-lg">
          <h2 className="text-xl text-white">Playlist not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-300 hover:text-white mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="glass p-5 rounded-lg overflow-hidden">
            <img 
              src={getBestImageUrl(playlist.image)} 
              alt={playlist.title || playlist.name || 'Playlist'} 
              className="w-full aspect-square object-cover rounded-md mb-4"
              onError={(e) => {
                e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAABZ0RVh0Q3JlYXRpb24gVGltZQAwMS8wOC8xMOr+6FIAAAPsSURBVHic7dyxjsIwFABBfOL/f9lXXIu2cC44ZqYGWysW2bFsN8MwjAFc2j79B8AnEwhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUA=';
              }}
            />
            <h1 className="text-2xl font-bold text-white mb-2 truncate">
              {playlist.title || playlist.name || 'Playlist'}
            </h1>
            <p className="text-gray-300 mb-4 truncate text-sm">
              {playlist.description || ''}
            </p>
            <div className="flex justify-between text-gray-400 text-sm mb-4">
              <span>
                {totalCount > 0 ? (
                  <>{totalCount} songs</>
                ) : (
                  <>{songs.length} songs</>
                )}
                {loadingSongs && (
                  <span className="ml-2 inline-block animate-pulse">Loading...</span>
                )}
              </span>
              <span>{playlist.followers ? `${playlist.followers} followers` : ''}</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={togglePlaylistPlay}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center hover:opacity-90 transition-all"
              >
                {isPlaylistPlaying ? (
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
              <button
                onClick={() => {
                  addMultipleToQueue(songs);
                  // Show notification
                  const message = document.createElement('div');
                  message.className = 'fixed bottom-24 right-4 glass-dark px-4 py-3 rounded-lg text-white text-sm z-50';
                  message.textContent = `Added ${songs.length} songs to queue`;
                  document.body.appendChild(message);
                  
                  // Remove message after 3 seconds
                  setTimeout(() => {
                    if (document.body.contains(message)) {
                      document.body.removeChild(message);
                    }
                  }, 3000);
                }}
                className="flex-1 bg-purple-600/50 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center hover:opacity-90 transition-all"
              >
                <FaMusic className="mr-2" />
                Add to Queue
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="glass p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-white">
              Songs
              {loadingSongs && (
                <span className="ml-3 text-sm font-normal text-gray-400 animate-pulse">
                  Loading songs...
                </span>
              )}
            </h2>
            
            {songsError && songs.length > 0 && (
              <div className="mb-4 p-2 glass-dark rounded-md text-yellow-300 text-sm">
                {songsError}
              </div>
            )}
            
            {songs.length === 0 ? (
              <p className="text-gray-400">
                {loadingSongs ? 'Loading songs...' : 'No songs found in this playlist'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage; 