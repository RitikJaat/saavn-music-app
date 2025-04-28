import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaCheckCircle, FaArrowLeft } from '../icons';
import { getArtistDetails, getArtistSongs } from '../services/api';
import { Artist, Song } from '../types';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import SongCard from '../components/SongCard';
import { decodeHtmlEntities, getBestImageUrl, safeParseInt } from '../utils/helpers';

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
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
    const fetchArtistData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const artistData = await getArtistDetails(id);
        const artistSongs = await getArtistSongs(id);
        
        if (artistData) {
          setArtist(artistData);
          setSongs(artistSongs);
          setError(null);
        } else {
          setError('Artist not found');
        }
      } catch (err) {
        setError('Failed to load artist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  const playAllSongs = () => {
    if (songs.length > 0) {
      console.log('Playing all artist songs');
      // Take the first song to play immediately
      const firstSong = songs[0];
      // Get remaining songs for the queue
      const remainingSongs = songs.slice(1);
      
      // Play the first song
      playSong(firstSong);
      
      // Add the rest to queue
      if (remainingSongs.length > 0) {
        console.log(`Adding ${remainingSongs.length} songs to queue from artist`);
        addMultipleToQueue(remainingSongs);
      }
    }
  };

  const isArtistSongPlaying = isPlaying && currentSong && songs.some(song => song.id === currentSong.id);

  const toggleArtistPlay = () => {
    if (isArtistSongPlaying) {
      pauseSong();
    } else if (currentSong && songs.some(song => song.id === currentSong.id)) {
      resumeSong();
    } else {
      playAllSongs();
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="glass p-10 rounded-lg flex items-center justify-center">
          <div className="animate-pulse">Loading artist...</div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="w-full p-6">
        <div className="glass p-10 rounded-lg flex items-center justify-center text-red-400">
          {error || 'Artist not found'}
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
            src={getBestImageUrl(artist.image)}
            alt={artist.name || artist.title || ''}
            className="w-48 h-48 object-cover rounded-full shadow-lg mb-6 md:mb-0 md:mr-8"
          />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <h1 className="text-2xl font-bold">{artist.name}</h1>
              {artist.isVerified && (
                <FaCheckCircle className="ml-2 text-blue-400" />
              )}
            </div>
            
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-400 mb-6">
              <span className="mr-4">{safeParseInt(artist.followerCount).toLocaleString()} followers</span>
              <span>{safeParseInt(artist.fanCount).toLocaleString()} fans</span>
            </div>
            
            <button
              onClick={toggleArtistPlay}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium flex items-center hover:opacity-90 transition-all mx-auto md:mx-0"
            >
              {isArtistSongPlaying ? (
                <>
                  <FaPause className="mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" />
                  Play Artist's Songs
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Popular Songs</h2>
        
        {songs.length === 0 ? (
          <div className="glass p-10 rounded-lg flex items-center justify-center text-gray-400">
            No songs available for this artist
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {songs.slice(0, 12).map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
      
      <div className="glass rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About {artist.name}</h2>
        <p className="text-gray-300">
          {`${artist.name || artist.title || ''} is a popular music artist with ${safeParseInt(artist.followerCount).toLocaleString()} followers. Explore their music on SaavnMusic.`}
        </p>
      </div>
    </div>
  );
};

export default ArtistPage; 