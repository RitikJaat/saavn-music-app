import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Song } from '../types';
import { decodeHtmlEntities } from '../utils/helpers';

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  addToQueue: (song: Song) => void;
  addMultipleToQueue: (songs: Song[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  queueHistory: Song[];
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.7);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueHistory, setQueueHistory] = useState<Song[]>([]);
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // This will help us handle the end of a song reliably
  const songEndHandled = useRef<boolean>(false);

  const cleanupSound = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
      soundRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (soundRef.current && soundRef.current.playing()) {
        const seconds = soundRef.current.seek();
        setCurrentTime(seconds);
      }
    }, 1000);
  };

  const playSong = (song: Song) => {
    console.log("Playing song:", song.name);
    
    // Clean up previous sound instance
    cleanupSound();
    
    // Reset the end handling flag
    songEndHandled.current = false;
    
    // Add current song to history if exists
    if (currentSong) {
      setQueueHistory(prev => [currentSong, ...prev.slice(0, 19)]); // Keep last 20 songs
    }
    
    // Update the current song immediately
    setCurrentSong(song);
    
    // Check if downloadUrl exists and has length
    if (!song.downloadUrl || song.downloadUrl.length === 0) {
      console.error('Song has no download URLs', song);
      
      // Try to play the next song
      setTimeout(() => {
        if (queue.length > 0) {
          const nextUpSong = queue[0];
          setQueue(prev => prev.slice(1));
          playSong(nextUpSong);
        }
      }, 100);
      
      return;
    }
    
    // Use highest quality URL
    const url = song.downloadUrl[song.downloadUrl.length - 1].url;
    
    // Create the sound instance
    soundRef.current = new Howl({
      src: [url],
      html5: true,
      volume: volume,
      autoplay: true,
      onplay: () => {
        console.log('Song started playing:', song.name);
        setIsPlaying(true);
        startTimer();
      },
      onend: () => {
        console.log('Song ended:', song.name);
        
        // Prevent duplicate handling of song end
        if (songEndHandled.current) {
          console.log('Song end already handled, skipping');
          return;
        }
        
        songEndHandled.current = true;
        
        // Schedule the next song after a small delay to ensure state updates
        setTimeout(() => {
          console.log('Queue length at song end:', queue.length);
          if (queue.length > 0) {
            // Get the next song
            const nextSong = queue[0];
            // Remove it from the queue
            setQueue(prev => prev.slice(1));
            // Play it
            playSong(nextSong);
          } else {
            console.log('No more songs in queue');
            // If no more songs in queue, reset but keep the current song info
            setIsPlaying(false);
            setCurrentTime(0);
          }
        }, 200);
      },
      onload: () => {
        setDuration(soundRef.current?.duration() || 0);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onloaderror: (id, error) => {
        console.error('Error loading song:', song.name, error);
        songEndHandled.current = true;
        
        // Try to play the next song on error
        setTimeout(() => {
          if (queue.length > 0) {
            const nextSong = queue[0];
            setQueue(prev => prev.slice(1));
            playSong(nextSong);
          }
        }, 100);
      },
    });
  };

  const pauseSong = () => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
    setIsPlaying(false);
  };

  const resumeSong = () => {
    if (soundRef.current) {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    if (queue.length > 0) {
      // Get the next song from the queue
      const nextUpSong = queue[0];
      // Remove it from the queue
      setQueue(prev => prev.slice(1));
      // Play it
      playSong(nextUpSong);
    } else if (currentSong && soundRef.current) {
      // If no more songs, just restart the current song
      soundRef.current.stop();
      soundRef.current.play();
    }
  };

  const prevSong = () => {
    if (currentTime > 3) {
      // If current song has played for more than 3 seconds, restart it
      seekTo(0);
    } else if (queueHistory.length > 0) {
      // Go to the previous song in history
      const prevSong = queueHistory[0];
      const newHistory = queueHistory.slice(1);
      
      // Add current song to the front of the queue
      if (currentSong) {
        setQueue(prev => [currentSong, ...prev]);
      }
      
      setQueueHistory(newHistory);
      playSong(prevSong);
    } else {
      // Just restart the current song
      seekTo(0);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const seekTo = (time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  const addToQueue = (song: Song) => {
    console.log('Adding to queue:', song.name);
    setQueue(prevQueue => [...prevQueue, song]);
  };
  
  const addMultipleToQueue = (songs: Song[]) => {
    if (songs.length === 0) return;
    
    console.log(`Adding ${songs.length} songs to queue`);
    setQueue(prevQueue => [...prevQueue, ...songs]);
    
    // If nothing is playing, start playing the first song
    if (!currentSong && songs.length > 0) {
      const firstSong = songs[0];
      const remainingSongs = songs.slice(1);
      
      // Play the first song
      playSong(firstSong);
      
      // Update the queue to have the remaining songs
      setQueue(remainingSongs);
    }
  };

  const removeFromQueue = (index: number) => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue];
      newQueue.splice(index, 1);
      return newQueue;
    });
  };

  const clearQueue = () => {
    console.log('Clearing queue');
    setQueue([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSound();
    };
  }, []);

  // Set page title when song changes
  useEffect(() => {
    if (currentSong) {
      const songName = decodeHtmlEntities(currentSong.name);
      const artistName = decodeHtmlEntities(currentSong.primaryArtists);
      document.title = `${songName} - ${artistName} | Saavn Music App`;
    } else {
      document.title = 'Saavn Music App';
    }
  }, [currentSong]);

  const value = {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    playSong,
    pauseSong,
    resumeSong,
    nextSong,
    prevSong,
    setVolume,
    seekTo,
    addToQueue,
    addMultipleToQueue,
    removeFromQueue,
    clearQueue,
    queueHistory
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}; 