import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { watchlistService } from '../services/watchlistService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWatchlist = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setWatchlist([]);
      return;
    }
    setLoading(true);
    try {
      const data = await watchlistService.getWatchlist();
      setWatchlist(data);
    } catch (err) {
      console.error("[WatchlistContext] Error fetching watchlist:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshWatchlist();
  }, [refreshWatchlist]);

  const addToWatchlist = async (track) => {
    if (!isAuthenticated) {
      addToast("Please log in to use watchlist", "info");
      return;
    }
    try {
      const metadata = {
        title: track.title,
        artist: track.artist,
        image: track.image,
        audioUrl: track.audioUrl,
        duration: track.duration
      };
      const newItem = await watchlistService.addToWatchlist(track.id, metadata);
      setWatchlist(prev => [newItem, ...prev]);
      addToast("Added to Watchlist", "success");
      return newItem;
    } catch (err) {
      if (err.code === '23505') {
        addToast("Already in Watchlist", "info");
      } else {
        console.error("[WatchlistContext] Error adding to watchlist:", err);
        addToast("Failed to add to watchlist", "error");
      }
    }
  };

  const removeFromWatchlist = async (trackId) => {
    try {
      await watchlistService.removeFromWatchlist(trackId);
      setWatchlist(prev => prev.filter(item => item.track_id !== trackId));
      addToast("Removed from Watchlist", "info");
    } catch (err) {
      console.error("[WatchlistContext] Error removing from watchlist:", err);
      addToast("Failed to remove from watchlist", "error");
    }
  };

  const isInWatchlist = (trackId) => {
    return watchlist.some(item => item.track_id === trackId);
  };

  const value = {
    watchlist,
    loading,
    refreshWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
