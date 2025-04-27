import React, { useState, FormEvent } from 'react';
import { FaSearch } from '../icons';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search for songs, artists, or albums...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="search"
          className="w-full p-3 pl-10 pr-4 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2.5 bottom-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 