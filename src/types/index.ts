export interface Song {
  id: string;
  name: string;
  playCount?: string;
  duration: string;
  image: string[];
  url: string;
  downloadUrl: Array<{
    quality: string;
    url: string;
  }>;
  primaryArtists: string;
  primaryArtistsId: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
}

export interface Album {
  id: string;
  name: string;
  year: string;
  playCount: string;
  language: string;
  image: string[];
  url: string;
  primaryArtists: Array<{
    id: string;
    name: string;
    url: string;
    image: string[];
  }>;
  songCount: string;
}

export interface Artist {
  id: string;
  name: string;
  url: string;
  image: string[];
  followerCount: string;
  fanCount: string;
  isVerified: boolean;
}

export interface SearchResults {
  songs?: {
    results: Song[];
    total: number;
  };
  albums?: {
    results: Album[];
    total: number;
  };
  artists?: {
    results: Artist[];
    total: number;
  };
}

export interface MusicPlayer {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
} 