import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { playlistService } from '../services/playlistService';
import { useAuth } from '../hooks/useAuth';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshPlaylists = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setPlaylists([]);
      return;
    }
    setLoading(true);
    try {
      const data = await playlistService.getUserPlaylists();
      setPlaylists(data);
    } catch (err) {
      console.error("[PlaylistContext] Error fetching playlists:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshPlaylists();
  }, [refreshPlaylists]);

  const createPlaylist = async (name, description) => {
    try {
      const newPlaylist = await playlistService.createPlaylist(name, description);
      setPlaylists(prev => [newPlaylist, ...prev]);
      return newPlaylist;
    } catch (err) {
      console.error("[PlaylistContext] Error creating playlist:", err);
      throw err;
    }
  };

  const deletePlaylist = async (id) => {
    try {
      await playlistService.deletePlaylist(id);
      setPlaylists(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("[PlaylistContext] Error deleting playlist:", err);
      throw err;
    }
  };

  const value = {
    playlists,
    loading,
    refreshPlaylists,
    createPlaylist,
    deletePlaylist
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};
