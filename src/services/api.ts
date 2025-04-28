import axios from 'axios';
import { SearchResults, Song, Album, Artist } from '../types';

const API_BASE_URL = 'https://saavn.dev/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchAll = async (query: string): Promise<SearchResults> => {
  try {
    const response = await api.get(`/search`, {
      params: { 
        query,
        limit: 50,
        page: 1
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching:', error);
    return {};
  }
};

export const searchSongs = async (query: string): Promise<Song[]> => {
  try {
    const response = await api.get(`/search/songs`, {
      params: { 
        query,
        limit: 50,
        page: 1
      }
    });
    return response.data.data.results;
  } catch (error) {
    console.error('Error searching songs:', error);
    return [];
  }
};

export const searchAlbums = async (query: string): Promise<Album[]> => {
  try {
    const response = await api.get(`/search/albums`, {
      params: { 
        query,
        limit: 50,
        page: 1
      }
    });
    return response.data.data.results;
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
};

export const searchArtists = async (query: string): Promise<Artist[]> => {
  try {
    const response = await api.get(`/search/artists`, {
      params: { 
        query,
        limit: 50,
        page: 1
      }
    });
    return response.data.data.results;
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
};

export const getSongDetails = async (id: string): Promise<Song | null> => {
  try {
    const response = await api.get(`/songs`, {
      params: { id }
    });
    return response.data.data[0];
  } catch (error) {
    console.error('Error getting song details:', error);
    return null;
  }
};

export const getAlbumDetails = async (id: string): Promise<Album | null> => {
  try {
    const response = await api.get(`/albums`, {
      params: { id }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error getting album details:', error);
    return null;
  }
};

export const getAlbumSongs = async (id: string): Promise<Song[]> => {
  try {
    const response = await api.get(`/albums`, {
      params: { id }
    });
    return response.data.data.songs;
  } catch (error) {
    console.error('Error getting album songs:', error);
    return [];
  }
};

export const getArtistDetails = async (id: string): Promise<Artist | null> => {
  try {
    const response = await api.get(`/artists`, {
      params: { id }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error getting artist details:', error);
    return null;
  }
};

export const getArtistSongs = async (id: string): Promise<Song[]> => {
  try {
    const response = await api.get(`/artists/${id}/songs`, {
      params: {
        limit: 50,
        page: 1
      }
    });
    return response.data.data.results;
  } catch (error) {
    console.error('Error getting artist songs:', error);
    return [];
  }
};

export const getTrendingSongs = async (): Promise<Song[]> => {
  try {
    const response = await api.get('/modules?language=hindi');
    const trendingSongs = response.data.data.trending?.songs?.find((section: any) => 
      section.title === 'Trending Songs'
    )?.contents || [];
    return trendingSongs.slice(0, 50); // Limit to 50 songs
  } catch (error) {
    console.error('Error getting trending songs:', error);
    return [];
  }
}; 

export const searchPlaylists = async (query: string, limit: number = 50): Promise<any[]> => {
  try {
    const response = await api.get(`/search/playlists`, {
      params: { 
        query,
        limit,
        page: 1
      }
    });
    return response.data.data.results || [];
  } catch (error) {
    console.error('Error searching playlists:', error);
    return [];
  }
}; 

export const getPlaylistDetails = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/playlists`, {
      params: { id }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error getting playlist details:', error);
    return null;
  }
};

export const getPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
  try {
    // First try to get playlist details which includes songs
    const response = await api.get(`/playlists`, {
      params: { id: playlistId }
    });
    
    if (response.data?.data?.songs && Array.isArray(response.data.data.songs)) {
      return response.data.data.songs;
    }
    
    // If no songs in the first response, try the JioSaavn method
    return getJioSaavnPlaylistSongs(playlistId);
  } catch (error) {
    console.error('Error fetching playlist songs:', error);
    return [];
  }
};

// Try direct JioSaavn playlist endpoint for all songs
export const getJioSaavnPlaylistSongs = async (id: string): Promise<Song[]> => {
  try {
    // Try multiple endpoint patterns to get all songs
    const endpoints = [
      `/playlists?id=${id}`,
      `/playlists/${id}`,
      `/playlists/${id}/songs?page=1&limit=300`
    ];
    
    let allSongs: Song[] = [];
    let success = false;
    
    // Try each endpoint until we get a valid response
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        
        if (response.data && response.data.data) {
          const data = response.data.data;
          
          // Check for songs in different possible response structures
          if (Array.isArray(data.songs) && data.songs.length > 0) {
            console.log(`Found ${data.songs.length} songs in response`);
            allSongs = data.songs;
            success = true;
            break;
          } else if (Array.isArray(data) && data.length > 0) {
            console.log(`Found ${data.length} songs in response array`);
            allSongs = data;
            success = true;
            break;
          } else if (data.list && Array.isArray(data.list) && data.list.length > 0) {
            console.log(`Found ${data.list.length} songs in list property`);
            allSongs = data.list;
            success = true;
            break;
          }
        }
      } catch (err) {
        console.log(`Endpoint ${endpoint} failed`);
      }
    }
    
    if (success) {
      return allSongs;
    } else {
      // Fall back to regular method if none of our direct attempts worked
      return getPlaylistSongs(id);
    }
  } catch (error) {
    console.error('Error in direct playlist songs fetch:', error);
    return [];
  }
}; 