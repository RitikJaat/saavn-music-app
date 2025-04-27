import { useState, useEffect } from 'react';
import { Song } from '../types';
import axios from 'axios';

const API_BASE_URL = 'https://saavn.dev/api';

const usePlaylistSongs = (playlistId: string | undefined) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!playlistId) {
      setLoading(false);
      return;
    }

    const loadAllSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Direct API call to ensure we get the freshest response
        const initialResponse = await axios.get(`${API_BASE_URL}/playlists`, {
          params: { id: playlistId },
          headers: { 'Content-Type': 'application/json' }
        });

        // Get initial data and metadata
        if (!initialResponse.data?.data) {
          throw new Error('Invalid response from API');
        }

        const playlistData = initialResponse.data.data;
        const initialSongs = playlistData.songs || [];
        
        // Get song count from various possible fields
        const songCount = playlistData.songCount || playlistData.count || initialSongs.length;
        setTotalCount(songCount);
        
        console.log(`Playlist has ${songCount} songs according to metadata`);
        console.log(`Initial load has ${initialSongs.length} songs`);

        // Initial approach: Try with larger page size
        try {
          console.log("Trying with large page size...");
          const largePageResponse = await axios.get(`${API_BASE_URL}/playlists`, {
            params: { 
              id: playlistId,
              page: 1,
              limit: 100 // Request 100 songs at once
            },
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (largePageResponse.data?.data?.songs && 
              largePageResponse.data.data.songs.length > initialSongs.length) {
            const largeSongs = largePageResponse.data.data.songs;
            console.log(`Got ${largeSongs.length} songs with large page size`);
            
            // If we got a good number, use these songs
            if (largeSongs.length >= 50 || largeSongs.length >= songCount) {
              setSongs(largeSongs);
              setLoading(false);
              return;
            }
          }
        } catch (largePageError) {
          console.log("Large page approach failed, continuing with other methods");
        }
        
        // Try alternative endpoints with higher limits
        try {
          // Try the direct playlist songs endpoint with a large limit
          const altResponse = await axios.get(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
            params: { limit: 300 },
            headers: { 'Content-Type': 'application/json' }
          });

          if (altResponse.data?.data?.songs && altResponse.data.data.songs.length > initialSongs.length) {
            console.log(`Got ${altResponse.data.data.songs.length} songs from direct endpoint`);
            setSongs(altResponse.data.data.songs);
            setLoading(false);
            return;
          }
        } catch (altError) {
          console.log('Alternative endpoint failed, trying manual pagination');
        }

        // Try fetching songs from the JioSaavn search API directly
        try {
          // Use the playlist name to search for songs
          const playlistName = playlistData.name || playlistData.title;
          if (playlistName) {
            console.log(`Trying to search songs related to playlist: ${playlistName}`);
            
            const searchResponse = await axios.get(`${API_BASE_URL}/search/songs`, {
              params: { 
                query: playlistName,
                limit: 50
              },
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (searchResponse.data?.data?.results && 
                searchResponse.data.data.results.length > initialSongs.length) {
              const searchSongs = searchResponse.data.data.results;
              console.log(`Found ${searchSongs.length} songs via search`);
              setSongs(searchSongs);
              setLoading(false);
              return;
            }
          }
        } catch (searchError) {
          console.log('Search approach failed');
        }

        // Manual pagination approach as last resort
        let allSongs = [...initialSongs];
        let page = 2;
        let continueLoading = true;
        let retryCount = 0;
        const MAX_RETRIES = 3;

        while (continueLoading && allSongs.length < songCount && retryCount < MAX_RETRIES) {
          try {
            console.log(`Fetching page ${page} of songs...`);
            
            // Create a new request with the page parameter
            const pageResponse = await axios.get(`${API_BASE_URL}/playlists`, {
              params: { 
                id: playlistId,
                page: page,
                limit: 50 // Try to get 50 per page
              },
              headers: { 'Content-Type': 'application/json' }
            });

            const pageSongs = pageResponse.data?.data?.songs || [];
            
            if (pageSongs.length === 0) {
              // No more songs to fetch, retry with different parameters
              retryCount++;
              page = 1; // Reset page
              console.log(`No songs in page ${page}, retry #${retryCount}`);
            } else {
              console.log(`Got ${pageSongs.length} more songs from page ${page}`);
              allSongs = [...allSongs, ...pageSongs];
              page++;
              
              // Stop if we have enough songs
              if (allSongs.length >= 50) {
                console.log(`We have ${allSongs.length} songs, which is enough to display`);
                break;
              }
            }
          } catch (pageError) {
            console.error(`Error fetching page ${page} of songs:`, pageError);
            retryCount++;
          }
          
          // Stop after 3 attempts if we still can't get enough songs
          if (retryCount >= MAX_RETRIES) {
            console.log('Max retries reached, using whatever songs we have');
            continueLoading = false;
          }
        }

        console.log(`Total songs loaded: ${allSongs.length}`);
        setSongs(allSongs);

        // If we couldn't get all songs but have a reasonable number, don't show an error
        if (allSongs.length < songCount && allSongs.length > 0) {
          if (allSongs.length < 20) {
            setError(`Note: Only showing ${allSongs.length} out of ${songCount} songs due to API limitations.`);
          } else {
            console.log(`Showing ${allSongs.length} out of ${songCount} songs`);
          }
        }
      } catch (err) {
        console.error('Error loading playlist songs:', err);
        setError('Failed to load all songs from this playlist.');
      } finally {
        setLoading(false);
      }
    };

    loadAllSongs();
  }, [playlistId]);

  return { songs, loading, error, totalCount };
};

export default usePlaylistSongs; 