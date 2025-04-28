import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MusicPlayerProvider } from './context/MusicPlayerContext';

// Import layout
import MainLayout from './layout/MainLayout';

// Import pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AlbumPage from './pages/AlbumPage';
import ArtistPage from './pages/ArtistPage';
import LibraryPage from './pages/LibraryPage';
import TrendingPage from './pages/TrendingPage';
import NewReleasesPage from './pages/NewReleasesPage';
import PlayerPage from './pages/PlayerPage';
import PlaylistPage from './pages/PlaylistPage';
import AlbumsPage from './pages/AlbumsPage';
import ArtistsPage from './pages/ArtistsPage';

function App() {
  return (
    <Router>
      <MusicPlayerProvider>
        <Routes>
          {/* Full-screen player page outside main layout */}
          <Route path="/player" element={<PlayerPage />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="album/:id" element={<AlbumPage />} />
            <Route path="artist/:id" element={<ArtistPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="trending" element={<TrendingPage />} />
            <Route path="new-releases" element={<NewReleasesPage />} />
            
            {/* New routes */}
            <Route path="playlist/:id" element={<PlaylistPage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="artists" element={<ArtistsPage />} />
            
            {/* Redirect any undefined routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </MusicPlayerProvider>
    </Router>
  );
}

export default App;
