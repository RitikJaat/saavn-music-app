import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaArrowLeft } from '../icons';
import { getAlbumDetails, getAlbumSongs } from '../services/api';
import { Album, Song } from '../types';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { decodeHtmlEntities, getBestImageUrl, safeParseInt } from '../utils/helpers';

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
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
    const fetchAlbumData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const albumData = await getAlbumDetails(id);
        const albumSongs = await getAlbumSongs(id);
        
        if (albumData) {
          setAlbum(albumData);
          setSongs(albumSongs);
          setError(null);
        } else {
          setError('Album not found');
        }
      } catch (err) {
        setError('Failed to load album');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [id]);

  const playAllSongs = () => {
    if (songs.length > 0) {
      console.log('Playing all songs from album');
      // Take the first song to play immediately
      const firstSong = songs[0];
      // Get remaining songs for the queue
      const remainingSongs = songs.slice(1);
      
      // Play the first song
      playSong(firstSong);
      
      // Add the rest to queue
      if (remainingSongs.length > 0) {
        console.log(`Adding ${remainingSongs.length} songs to queue from album`);
        addMultipleToQueue(remainingSongs);
      }
    }
  };

  const isAlbumPlaying = isPlaying && currentSong && songs.some(song => song.id === currentSong.id);

  const toggleAlbumPlay = () => {
    if (isAlbumPlaying) {
      pauseSong();
    } else if (currentSong && songs.some(song => song.id === currentSong.id)) {
      resumeSong();
    } else {
      playAllSongs();
    }
  };

  const handleSongPlay = (song: Song) => {
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

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="glass p-10 rounded-lg flex items-center justify-center">
          <div className="animate-pulse">Loading album...</div>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="w-full p-6">
        <div className="glass p-10 rounded-lg flex items-center justify-center text-red-400">
          {error || 'Album not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 cursor-pointer"
      >
        <FaArrowLeft size={14} />
        <span>Back</span>
      </button>
      
      <div className="glass-dark rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img
            src={getBestImageUrl(album.image)}
            alt={album.name || album.title || ''}
            className="w-48 h-48 object-cover rounded-lg shadow-lg mb-6 md:mb-0 md:mr-8"
          />
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{album.name}</h1>
            <p className="text-gray-300 mb-2">
              {album.primaryArtists && album.primaryArtists.length > 0
                ? album.primaryArtists.map(artist => artist.name).join(', ')
                : 'Various Artists'
              }
            </p>
            <div className="flex items-center text-sm text-gray-400 mb-6">
              <span className="mr-4">{album.year}</span>
              <span className="mr-4">{album.songCount} songs</span>
              <span>{album.language}</span>
            </div>
            
            <button
              onClick={toggleAlbumPlay}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium flex items-center hover:opacity-90 transition-all"
            >
              {isAlbumPlaying ? (
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
      
      <div className="glass rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Songs</h2>
        </div>
        
        <div className="divide-y divide-gray-700">
          {songs.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No songs available for this album
            </div>
          ) : (
            songs.map((song, index) => {
              const isCurrentSong = currentSong?.id === song.id;
              
              return (
                <div
                  key={song.id}
                  className={`flex items-center p-4 hover:bg-white hover:bg-opacity-5 cursor-pointer ${
                    isCurrentSong ? 'bg-white bg-opacity-10' : ''
                  }`}
                  onClick={() => handleSongPlay(song)}
                >
                  <div className="w-8 text-center text-gray-400 mr-4">
                    {isCurrentSong ? (
                      isPlaying ? (
                        <div className="flex space-x-1 h-4 items-end justify-center">
                          <div className="w-1 bg-purple-400 h-3 animate-pulse"></div>
                          <div className="w-1 bg-purple-400 h-4 animate-pulse"></div>
                          <div className="w-1 bg-purple-400 h-2 animate-pulse"></div>
                        </div>
                      ) : (
                        <FaPause size={12} className="mx-auto" />
                      )
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium truncate ${isCurrentSong ? 'text-purple-400' : 'text-white'}`}>
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumPage; 