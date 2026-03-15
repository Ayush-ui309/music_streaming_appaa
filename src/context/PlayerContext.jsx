import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { addToRecentlyPlayed } from '../api/jamendoApi';

import { historyService } from '../services/historyService';
export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [queue, setQueue] = useState([]);
  const [shuffledQueue, setShuffledQueue] = useState([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);

  // Auto-play next track when one ends
  const playNext = useCallback((isManual = false) => {
    const activeQueue = isShuffle ? shuffledQueue : queue;
    if (activeQueue.length === 0) return;

    if (!isManual && repeatMode === 'one') {
      // Replay current only on auto-play
      playTrack(currentTrack, null, true);
      return;
    }

    const currentIndex = activeQueue.findIndex(t => t.id === currentTrack?.id);
    
    if (currentIndex === -1 || currentIndex === activeQueue.length - 1) {
      if (repeatMode === 'all') {
        playTrack(activeQueue[0], null, true);
      } else {
        setIsPlaying(false);
      }
    } else {
      playTrack(activeQueue[currentIndex + 1], null, true);
    }
  }, [queue, shuffledQueue, isShuffle, repeatMode, currentTrack]);

  const playPrev = useCallback(() => {
    const activeQueue = isShuffle ? shuffledQueue : queue;
    if (activeQueue.length === 0) return;

    const currentIndex = activeQueue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex <= 0) {
      if (repeatMode === 'all') {
        playTrack(activeQueue[activeQueue.length - 1], null, true);
      }
    } else {
      playTrack(activeQueue[currentIndex - 1], null, true);
    }
  }, [queue, shuffledQueue, isShuffle, repeatMode, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleEnded = () => {
      if (queue.length > 0) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [queue, playNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const playTrack = (track, newQueue = null, forcePlay = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (newQueue) {
      setQueue(newQueue);
      if (isShuffle) {
        const shuffled = [...newQueue].sort(() => Math.random() - 0.5);
        setShuffledQueue(shuffled);
      }
    }

    if (!forcePlay && currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(e => console.error("Error playing audio", e));
        setIsPlaying(true);
      }
      return;
    }

    if (forcePlay && currentTrack?.id === track.id) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Error playing audio", e));
      setIsPlaying(true);
      return;
    }

    // Track play in history (persistent in Supabase)
    historyService.addToHistory(track.id, track).catch(console.error);
    
    addToRecentlyPlayed(track); // Keep localStorage for now too as a cache
    setCurrentTrack(track);
    audio.src = track.audioUrl || track.audiodownload;
    audio.play().catch(e => console.error("Error playing audio", e));
    setIsPlaying(true);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) audio.pause();
    else if (currentTrack) audio.play().catch(e => console.error("Error playing audio", e));
    setIsPlaying(!isPlaying);
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleShuffle = () => {
    if (!isShuffle) {
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setShuffledQueue(shuffled);
    }
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const value = {
    currentTrack,
    isPlaying,
    volume,
    setVolume,
    playTrack,
    togglePlay,
    queue,
    setQueue,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    playNext,
    playPrev,
    currentTime,
    duration,
    seek,
    audioRef
  };

  return (
    <PlayerContext.Provider value={value}>
      <audio ref={audioRef} style={{ display: 'none' }} />
      {children}
    </PlayerContext.Provider>
  );
};
