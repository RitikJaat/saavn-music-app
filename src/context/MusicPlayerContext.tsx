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
  
  // Keep track if we're manually skipping or song ended naturally
  const isAutoPlayingRef = useRef<boolean>(false);

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
    cleanupSound();
    
    // Add current song to history if exists
    if (currentSong) {
      setQueueHistory(prev => [currentSong, ...prev.slice(0, 19)]); // Keep last 20 songs
    }
    
    // Check if downloadUrl exists and has length
    if (!song.downloadUrl || song.downloadUrl.length === 0) {
      console.error('Song has no download URLs', song);
      // Try to play next song if this one fails
      if (queue.length > 0) {
        const nextSong = queue[0];
        setQueue(queue.slice(1));
        playSong(nextSong);
      }
      return;
    }
    
    // Use highest quality URL
    const url = song.downloadUrl[song.downloadUrl.length - 1].url;
    
    soundRef.current = new Howl({
      src: [url],
      html5: true,
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        startTimer();
      },
      onend: () => {
        isAutoPlayingRef.current = true;
        nextSong();
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
      onloaderror: () => {
        console.error('Error loading song', song);
        // Auto skip to next song on error
        if (queue.length > 0) {
          const nextSong = queue[0];
          setQueue(queue.slice(1));
          playSong(nextSong);
        }
      },
    });

    soundRef.current.play();
    setCurrentSong(song);
    
    // Title is now updated in useEffect, no need to do it here
  };

  const pauseSong = () => {
    soundRef.current?.pause();
    setIsPlaying(false);
  };

  const resumeSong = () => {
    if (soundRef.current) {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    const wasAutoPlaying = isAutoPlayingRef.current;
    isAutoPlayingRef.current = false;
    
    if (queue.length > 0) {
      const nextSong = queue[0];
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      playSong(nextSong);
    } else if (wasAutoPlaying) {
      // If auto-playing reached the end of queue, reset everything
      cleanupSound();
      setCurrentSong(null);
      setIsPlaying(false);
      setCurrentTime(0);
      // Title is now updated in useEffect, no need to do it here
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
        setQueue([currentSong, ...queue]);
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
    setQueue(prevQueue => [...prevQueue, song]);
  };
  
  const addMultipleToQueue = (songs: Song[]) => {
    if (songs.length === 0) return;
    
    setQueue(prevQueue => [...prevQueue, ...songs]);
    
    // If nothing is playing, start playing the first song
    if (!currentSong && songs.length > 0) {
      playSong(songs[0]);
      setQueue(prevQueue => (songs.length > 1 ? [...prevQueue.slice(1)] : prevQueue));
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
    setQueue([]);
  };

  useEffect(() => {
    return () => {
      cleanupSound();
    };
  }, []);

  // Set initial page title and handle title updates when currentSong changes
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