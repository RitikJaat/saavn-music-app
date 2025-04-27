import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchSongs, searchAlbums, searchArtists, searchPlaylists } from '../services/api';
import { Song, Album, Artist, Playlist } from '../types';
import SearchBar from '../components/SearchBar';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import { FaPlay, FaPause, FaMusic } from '../icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { getBestImageUrl } from '../utils/helpers';
import { Link } from 'react-router-dom';

// Sample playlists as fallback if API fails
const samplePlaylists: Playlist[] = [
  {
    id: 'playlist/2676373',
    title: 'Top 50 - Global',
    name: 'Top 50 - Global',
    description: 'The most popular songs worldwide right now',
    image: '/playlist-images/top-hits.jpg',
    songs: 50,
    followers: '3.2M'
  },
  {
    id: 'playlist/100738310',
    title: 'Chill Lofi Beats',
    name: 'Chill Lofi Beats',
    description: 'Relaxing lofi tunes to study and unwind',
    image: '/playlist-images/chill-vibes.jpg',
    songs: 42,
    followers: '1.8M'
  },
  {
    id: 'playlist/4144832',
    title: 'Bollywood Hits',
    name: 'Bollywood Hits',
    description: 'Top Bollywood tracks everyone loves',
    image: '/playlist-images/workout.jpg',
    songs: 45,
    followers: '2.1M'
  },
  {
    id: 'playlist3',
    title: 'Workout Motivation',
    name: 'Workout Motivation',
    description: 'Energetic tracks for your workout',
    image: '/playlist-images/workout.jpg',
    songs: 38,
    followers: '980K'
  }
];

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  
  const [songResults, setSongResults] = useState<Song[]>([]);
  const [albumResults, setAlbumResults] = useState<Album[]>([]);
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [playlistResults, setPlaylistResults] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'songs' | 'albums' | 'artists' | 'playlists'>('songs');
  
  const { 
    currentSong,
    isPlaying,
    playSong,
    pauseSong,
    resumeSong,
    addToQueue
  } = useMusicPlayer();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setSongResults([]);
        setAlbumResults([]);
        setArtistResults([]);
        setPlaylistResults([]);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch results in parallel for better performance
        const [songs, albums, artists, playlists] = await Promise.all([
          searchSongs(query),
          searchAlbums(query),
          searchArtists(query),
          searchPlaylists(query, 50)
        ]);
        
        setSongResults(songs);
        setAlbumResults(albums);
        setArtistResults(artists);
        setPlaylistResults(playlists.length > 0 ? playlists : 
          // Fallback to sample playlists only if API returns empty results
          samplePlaylists.filter(playlist => 
            (playlist.name?.toLowerCase().includes(query.toLowerCase()) || false) || 
            (playlist.description?.toLowerCase().includes(query.toLowerCase()) || false) ||
            (playlist.title?.toLowerCase().includes(query.toLowerCase()) || false)
          )
        );
      } catch (error) {
        console.error('Error searching:', error);
        // If API fails, use filtered sample playlists
        setPlaylistResults(
          samplePlaylists.filter(playlist => 
            (playlist.name?.toLowerCase().includes(query.toLowerCase()) || false) || 
            (playlist.description?.toLowerCase().includes(query.toLowerCase()) || false) ||
            (playlist.title?.toLowerCase().includes(query.toLowerCase()) || false)
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const playAllSongs = () => {
    if (songResults.length > 0) {
      // Play the first song
      playSong(songResults[0]);
      
      // Add rest to queue
      songResults.slice(1, 10).forEach(song => {
        addToQueue(song);
      });
    }
  };

  const isSearchSongPlaying = isPlaying && currentSong && 
    songResults.some(song => song.id === currentSong.id);

  const toggleSearchPlay = () => {
    if (isSearchSongPlaying) {
      pauseSong();
    } else if (currentSong && songResults.some(song => song.id === currentSong.id)) {
      resumeSong();
    } else {
      playAllSongs();
    }
  };
  
  const hasResults = songResults.length > 0 || albumResults.length > 0 || 
                     artistResults.length > 0 || playlistResults.length > 0;

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Search Music</h1>
        <SearchBar className="max-w-2xl" />
      </div>

      {query && (
        <>
          <h2 className="text-xl font-semibold mb-6">
            {loading ? 'Searching...' : `Results for "${query}"`}
          </h2>
          
          {!loading && !hasResults && (
            <div className="glass p-10 rounded-lg flex items-center justify-center">
              No results found for "{query}"
            </div>
          )}

          {hasResults && (
            <>
              <div className="mb-6 border-b border-gray-700">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('songs')}
                    className={`py-3 px-1 relative ${
                      activeTab === 'songs'
                        ? 'text-white border-b-2 border-purple-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Songs ({songResults.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('albums')}
                    className={`py-3 px-1 relative ${
                      activeTab === 'albums'
                        ? 'text-white border-b-2 border-purple-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Albums ({albumResults.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('artists')}
                    className={`py-3 px-1 relative ${
                      activeTab === 'artists'
                        ? 'text-white border-b-2 border-purple-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Artists ({artistResults.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('playlists')}
                    className={`py-3 px-1 relative ${
                      activeTab === 'playlists'
                        ? 'text-white border-b-2 border-purple-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Playlists ({playlistResults.length})
                  </button>
                </nav>
              </div>

              {activeTab === 'songs' && songResults.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={toggleSearchPlay}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium flex items-center hover:opacity-90 transition-all mb-6"
                  >
                    {isSearchSongPlaying ? (
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
              )}

              <div className="mt-6">
                {activeTab === 'songs' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {songResults.map((song: Song) => (
                      <SongCard key={song.id} song={song} />
                    ))}
                  </div>
                )}

                {activeTab === 'albums' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {albumResults.map((album: Album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </div>
                )}

                {activeTab === 'artists' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {artistResults.map((artist: Artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                )}
                
                {activeTab === 'playlists' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {playlistResults.map((playlist) => (
                      <Link 
                        to={`/playlist/${playlist.id}`}
                        key={playlist.id} 
                        className="glass rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                      >
                        <div className="relative">
                          <img 
                            src={getBestImageUrl(playlist.image)}
                            alt={playlist.title || playlist.name || ''} 
                            className="w-full aspect-square object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAABZ0RVh0Q3JlYXRpb24gVGltZQAwMS8wOC8xMOr+6FIAAAPsSURBVHic7dyxjsIwFABBfOL/f9lXXIu2cC44ZqYGWysW2bFsN8MwjAFc2j79B8AnEwhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUA=';
                            }}
                          />
                          {/* Gradient overlay for better text readability */}
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
                          
                          {/* Play button in the corner */}
                          <div className="absolute bottom-3 right-3">
                            <button className="bg-purple-600 hover:bg-purple-700 rounded-full p-2 transition-colors">
                              <FaMusic className="text-white" size={16} />
                            </button>
                          </div>
                          
                          {/* Title over the image */}
                          <div className="absolute bottom-3 left-3 right-14 truncate">
                            <h3 className="text-white font-bold truncate text-sm">{playlist.title || playlist.name || ''}</h3>
                            <p className="text-gray-300 text-xs truncate">
                              {playlist.songs ? `${playlist.songs} songs` : playlist.description || ''}
                            </p>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <p className="text-gray-400 text-xs truncate mb-2">
                            {playlist.followers ? `${playlist.followers} followers` : playlist.language || ''}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {!query && (
        <div className="glass p-10 rounded-lg flex items-center justify-center">
          Enter a search term to find songs, albums, artists, and playlists
        </div>
      )}
    </div>
  );
};

export default SearchPage; 