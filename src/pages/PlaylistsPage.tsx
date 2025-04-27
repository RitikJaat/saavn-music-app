import React from 'react';
import { FaPlus, FaMusic } from '../icons';
import { getBestImageUrl } from '../utils/helpers';
import { Playlist } from '../types';

// Sample playlists data with updated structure to match API
const samplePlaylists: Playlist[] = [
  {
    id: 'playlist1',
    name: 'Top Hits 2023',
    title: 'Top Hits 2023',
    description: 'The most popular songs right now',
    image: '/playlist-images/top-hits.jpg',
    songs: 50,
    followers: '2.5M'
  },
  {
    id: 'playlist2',
    name: 'Chill Vibes',
    title: 'Chill Vibes',
    description: 'Relaxing tunes to unwind',
    image: '/playlist-images/chill-vibes.jpg',
    songs: 40,
    followers: '1.2M'
  },
  {
    id: 'playlist3',
    name: 'Workout Motivation',
    title: 'Workout Motivation',
    description: 'Power through your workout with these energetic tracks',
    image: '/playlist-images/workout.jpg',
    songs: 45,
    followers: '980K'
  },
  {
    id: 'playlist4',
    name: 'Acoustic Covers',
    title: 'Acoustic Covers',
    description: 'Beautiful acoustic versions of your favorite songs',
    image: '/playlist-images/acoustic.jpg',
    songs: 30,
    followers: '750K'
  }
];

const PlaylistsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Playlists</h1>
      
      {/* Featured Playlists */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Featured Playlists</h2>
          <button className="text-sm font-medium text-purple-400 hover:text-purple-300">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {samplePlaylists.map(playlist => (
            <div key={playlist.id} className="glass rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="relative">
                <img 
                  src={getBestImageUrl(playlist.image)}
                  alt={playlist.title || playlist.name || ''}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAABZ0RVh0Q3JlYXRpb24gVGltZQAwMS8wOC8xMOr+6FIAAAPsSURBVHic7dyxjsIwFABBfOL/f9lXXIu2cC44ZqYGWysW2bFsN8MwjAFc2j79B8AnEwhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUAUCESBQBQIRIFAFAhEgUA=';
                  }}
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* Play button is now just an icon in the corner instead of center overlay */}
                <div className="absolute bottom-3 right-3">
                  <button className="bg-purple-600 hover:bg-purple-700 rounded-full p-2 transition-colors">
                    <FaMusic className="text-white" size={16} />
                  </button>
                </div>
                
                {/* Title now appears over the image at the bottom */}
                <div className="absolute bottom-3 left-3 right-14 truncate">
                  <h3 className="text-white font-bold truncate text-sm">{playlist.title || playlist.name}</h3>
                  <p className="text-gray-300 text-xs truncate">{playlist.songs} songs</p>
                </div>
              </div>
              
              <div className="p-3">
                <p className="text-gray-400 text-xs truncate mb-2">{playlist.followers} followers</p>
                <div className="flex justify-between">
                  <button className="flex items-center text-gray-300 hover:text-white text-xs">
                    <FaPlus size={10} className="mr-1" />
                    Add to Library
                  </button>
                  <button className="flex items-center text-gray-300 hover:text-white text-xs">
                    <FaPlus size={10} className="mr-1" />
                    Add to Queue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Create Playlist Banner */}
      <div className="glass p-6 rounded-lg bg-gradient-to-r from-indigo-700 to-purple-700">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Create Your Own Playlist</h3>
            <p className="text-gray-300 mb-4 md:mb-0">Craft your perfect collection of tracks to share with friends</p>
          </div>
          <button className="bg-white text-purple-700 px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition">
            Create Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistsPage; 