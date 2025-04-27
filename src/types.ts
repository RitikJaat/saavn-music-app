export interface ImageQuality {
  quality: string;
  url: string;
}

export interface Song {
  id: string;
  title: string;
  name: string;
  image?: string | ImageQuality[];
  album?: string;
  url?: string;
  type?: string;
  description?: string;
  primaryArtists?: string;
  singers?: string;
  language?: string;
  duration?: string;
  downloadUrl?: { url: string }[];
}

export interface AlbumArtist {
  name: string;
  id: string;
}

export interface Album {
  id: string;
  title: string;
  name: string;
  image?: string | ImageQuality[];
  artist?: string;
  url?: string;
  type?: string;
  description?: string;
  year?: string;
  songIds?: string;
  language?: string;
  songCount?: number;
  primaryArtists?: AlbumArtist[];
}

export interface Artist {
  id: string;
  title: string;
  name: string;
  image?: string | ImageQuality[];
  type?: string;
  description?: string;
  position?: number;
  isVerified?: boolean;
  followerCount?: string;
  fanCount?: string;
}

export interface Playlist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  image?: string | ImageQuality[];
  songs?: number;
  followers?: string;
  language?: string;
  url?: string;
  type?: string;
}

export interface SearchResults {
  songs?: Song[];
  albums?: Album[];
  artists?: Artist[];
  playlists?: Playlist[];
} 