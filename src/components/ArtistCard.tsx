import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from '../icons';
import { Artist } from '../types';
import { decodeHtmlEntities, getBestImageUrl, safeParseInt } from '../utils/helpers';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  // Ensure we have an image to display
  const artistImage = getBestImageUrl(artist.image);
    
  return (
    <Link 
      to={`/artist/${artist.id}`}
      className="glass p-3 rounded-lg flex flex-col items-center overflow-hidden transition-transform hover:scale-105"
    >
      <div className="relative">
        <img 
          src={artistImage}
          alt={artist.name}
          className="w-32 h-32 rounded-full object-cover mb-3" 
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/500?text=Error';
          }}
        />
        {artist.isVerified && (
          <div className="absolute bottom-3 right-0 text-blue-400">
            <FaCheckCircle size={18} />
          </div>
        )}
      </div>
      
      <div className="text-center overflow-hidden w-full">
        <h3 className="text-sm font-medium text-white truncate">{decodeHtmlEntities(artist.name)}</h3>
        <p className="text-xs text-gray-400">
          {safeParseInt(artist.followerCount).toLocaleString()} followers
        </p>
      </div>
    </Link>
  );
};

export default ArtistCard; 