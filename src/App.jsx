import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import BottomNav from './components/BottomNav';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlaylistProvider } from './context/PlaylistContext';
import './styles/global.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <PlaylistProvider>
              <PlayerProvider>
                <div className="app-container">
                  <Sidebar />
                  <main className="main-content">
                    <Navbar />
                    <div className="page-container">
                      <AppRoutes />
                    </div>
                  </main>
                  <MusicPlayer />
                  <BottomNav />
                </div>
              </PlayerProvider>
            </PlaylistProvider>
          </AuthProvider>
      </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
