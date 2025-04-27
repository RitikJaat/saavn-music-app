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

export const getPlaylistSongs = async (id: string): Promise<Song[]> => {
  try {
    // First request to get initial songs and details
    const initialResponse = await api.get(`/playlists`, {
      params: { id }
    });
    
    // Check if we got valid data
    if (!initialResponse.data.data) {
      console.error("Invalid playlist data received");
      return [];
    }
    
    // Get songs from initial response
    const initialSongs = initialResponse.data.data.songs || [];
    console.log(`Initial songs loaded: ${initialSongs.length}`);
    
    // Get total song count - some APIs use songCount, others might use count or total
    const totalSongs = 
      initialResponse.data.data.songCount || 
      initialResponse.data.data.count || 
      initialResponse.data.data.total || 
      initialSongs.length;
    
    console.log(`Total songs in playlist according to API: ${totalSongs}`);
    
    // If we have all songs or no songs, return what we have
    if (initialSongs.length >= totalSongs || initialSongs.length === 0) {
      return initialSongs;
    }
    
    // If we need to fetch more songs, try a different approach
    // Some APIs require a different endpoint for paginated songs
    try {
      const fullResponse = await api.get(`/playlists/${id}/songs`, {
        params: { 
          limit: 100  // Try a larger limit
        }
      });
      
      if (fullResponse.data.data && Array.isArray(fullResponse.data.data.songs)) {
        const allSongs = fullResponse.data.data.songs;
        console.log(`Fetched ${allSongs.length} songs using dedicated endpoint`);
        return allSongs;
      }
    } catch (paginationError) {
      console.log("Dedicated songs endpoint failed, falling back to manual pagination");
    }
    
    // Manual pagination as fallback
    let allSongs = [...initialSongs];
    let page = 2;
    let hasMoreSongs = true;
    
    // Keep fetching until we have all songs or hit an error
    while (hasMoreSongs && allSongs.length < totalSongs) {
      try {
        const response = await api.get(`/playlists`, {
          params: { 
            id,
            page
          }
        });
        
        const pageSongs = response.data.data.songs || [];
        console.log(`Page ${page} songs: ${pageSongs.length}`);
        
        if (pageSongs.length === 0) {
          // No more songs to fetch
          hasMoreSongs = false;
        } else {
          // Add songs to our collection
          allSongs = [...allSongs, ...pageSongs];
          page++;
        }
      } catch (error) {
        console.error(`Error fetching page ${page} of songs:`, error);
        hasMoreSongs = false;
      }
    }
    
    console.log(`Total songs loaded: ${allSongs.length}`);
    return allSongs;
  } catch (error) {
    console.error('Error getting playlist songs:', error);
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