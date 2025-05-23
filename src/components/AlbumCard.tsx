import React from 'react';
import { Link } from 'react-router-dom';
import { Album } from '../types';
import { decodeHtmlEntities, getBestImageUrl } from '../utils/helpers';

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  // Default placeholder image as data URI
  const placeholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22500%22%20height%3D%22500%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20500%20500%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23919191%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A25pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22500%22%20height%3D%22500%22%20fill%3D%22%23232323%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22173%22%20y%3D%22256%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
  
  const errorImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22500%22%20height%3D%22500%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20500%20500%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23f05252%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A25pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22500%22%20height%3D%22500%22%20fill%3D%22%23232323%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22173%22%20y%3D%22256%22%3EError%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

  // Ensure we have an image to display
  const albumImage = album.image && album.image.length > 0 
    ? getBestImageUrl(album.image) 
    : placeholderImage;

  return (
    <Link 
      to={`/album/${album.id}`}
      className="glass p-3 rounded-lg flex flex-col overflow-hidden transition-transform hover:scale-105"
    >
      <div className="relative">
        <img 
          src={albumImage}
          alt={album.name}
          className="w-full aspect-square object-cover rounded-md mb-3" 
          onError={(e) => {
            e.currentTarget.src = errorImage;
          }}
        />
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {album.songCount} songs
        </div>
      </div>
      
      <div className="overflow-hidden">
        <h3 className="text-sm font-medium text-white truncate">{decodeHtmlEntities(album.name)}</h3>
        <p className="text-xs text-gray-400 truncate">
          {album.primaryArtists && album.primaryArtists.length > 0
            ? album.primaryArtists.map(artist => decodeHtmlEntities(artist.name)).join(', ')
            : 'Various Artists'
          }
        </p>
        <p className="text-xs text-gray-500 mt-1">{album.year}</p>
      </div>
    </Link>
  );
};

export default AlbumCard; 