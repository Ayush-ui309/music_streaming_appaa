import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Shuffle, Repeat, Repeat1, ListMusic } from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer';
import { formatTime } from '../utils/formatTime';

const MusicPlayer = () => {
  const { 
    currentTrack, isPlaying, togglePlay, 
    volume, setVolume, playNext, playPrev,
    currentTime, duration, seek,
    isShuffle, toggleShuffle, repeatMode, toggleRepeat, queue
  } = usePlayer();
  
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) return null;

  const handleSeek = (e) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return (
    <div className="player-wrapper" style={styles.playerWrapper}>
      <div className="player-container" style={styles.playerContainer}>
        {/* Track Info */}
        <div style={styles.trackInfoContainer}>
          <img src={currentTrack.image || 'https://via.placeholder.com/60'} alt="cover" style={styles.coverImage} />
          <div style={styles.textInfo}>
            <h4 className="text-ellipsis" style={styles.title}>{currentTrack.title}</h4>
            <p className="text-ellipsis text-muted" style={styles.artist}>{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="player-controls" style={styles.controlsContainer}>
          <div style={styles.mainControls}>
            <button 
              className="hide-mobile"
              style={{ ...styles.controlBtn, color: isShuffle ? 'var(--primary-color)' : 'var(--text-secondary)' }} 
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle size={16} />
            </button>
            <button style={styles.controlBtn} onClick={playPrev} title="Previous"><SkipBack size={20} fill="currentColor" /></button>
            <button onClick={togglePlay} style={styles.playBtn} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? (
                <Pause size={20} fill="#000" color="#000" />
              ) : (
                <Play size={20} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
              )}
            </button>
            <button style={styles.controlBtn} onClick={() => playNext(true)} title="Next"><SkipForward size={20} fill="currentColor" /></button>
            <button 
              className="hide-mobile"
              style={{ ...styles.controlBtn, color: repeatMode !== 'none' ? 'var(--primary-color)' : 'var(--text-secondary)' }} 
              onClick={toggleRepeat}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="hide-mobile" style={styles.progressContainer}>
            <span style={styles.timeText}>{formatTime(currentTime)}</span>
            <div style={styles.progressWrapper}>
              <input 
                type="range" 
                min={0} 
                max={duration || 100} 
                value={currentTime} 
                onChange={handleSeek}
                style={styles.progressBar}
                className="custom-range progress-range"
              />
              <div style={{...styles.progressFill, width: `${progressPercent}%`}} />
            </div>
            <span style={styles.timeText}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Queue */}
        <div className="hide-mobile" style={styles.volumeContainer}>
          <button 
            style={{ ...styles.controlBtn, color: showQueue ? 'var(--primary-color)' : 'var(--text-secondary)' }} 
            onClick={() => setShowQueue(!showQueue)}
            title="Queue"
          >
            <ListMusic size={20} />
          </button>
          <button style={styles.controlBtn} onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div style={styles.volumeWrapper}>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.01} 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange}
              style={styles.volumeBar}
              className="custom-range volume-range"
            />
            <div style={{...styles.volumeFill, width: `${volumePercent}%`}} />
          </div>
        </div>

        {/* Queue Dropdown */}
        {showQueue && (
          <div style={styles.queuePanel}>
            <h4 style={styles.queueTitle}>Next Up</h4>
            <div style={styles.queueList}>
              {queue.map((track, i) => (
                <div key={`${track.id}-${i}`} style={{
                  ...styles.queueItem,
                  color: currentTrack.id === track.id ? 'var(--primary-color)' : 'var(--text-primary)'
                }}>
                  <span style={styles.queueIdx}>{i + 1}</span>
                  <span className="text-ellipsis" style={{ flex: 1 }}>{track.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  playerWrapper: { position: 'fixed', bottom: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none' },
  playerContainer: { backgroundColor: '#111822', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', width: '100%', maxWidth: '1200px', pointerEvents: 'auto', backdropFilter: 'blur(10px)' },
  trackInfoContainer: { display: 'flex', alignItems: 'center', width: '30%', minWidth: '200px' },
  coverImage: { width: '48px', height: '48px', borderRadius: '8px', marginRight: '16px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' },
  textInfo: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  title: { fontSize: '15px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' },
  artist: { fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' },
  controlsContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%', maxWidth: '600px' },
  mainControls: { display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '8px' },
  controlBtn: { color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  playBtn: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(77, 244, 120, 0.3)' },
  progressContainer: { display: 'flex', alignItems: 'center', width: '100%', gap: '12px' },
  timeText: { fontSize: '11px', color: 'var(--text-secondary)', minWidth: '35px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
  progressWrapper: { flex: 1, height: '4px', position: 'relative', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', cursor: 'pointer' },
  progressBar: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 },
  progressFill: { position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: 'var(--primary-color)', borderRadius: '2px', zIndex: 1, pointerEvents: 'none' },
  volumeContainer: { display: 'flex', alignItems: 'center', width: '30%', minWidth: '150px', justifyContent: 'flex-end', gap: '12px' },
  volumeWrapper: { width: '100px', height: '4px', position: 'relative', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', cursor: 'pointer' },
  volumeBar: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 },
  volumeFill: { position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#fff', borderRadius: '2px', zIndex: 1, pointerEvents: 'none' },
  queuePanel: {
    position: 'absolute',
    bottom: 'calc(100% + 12px)',
    right: 0,
    width: '300px',
    maxHeight: '400px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 200,
  },
  queueTitle: { margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800', letterSpacing: '0.5px', color: 'var(--text-primary)' },
  queueList: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
  queueItem: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', padding: '8px', borderRadius: '8px', cursor: 'default' },
  queueIdx: { width: '20px', fontSize: '11px', color: 'var(--text-secondary)' },
};

export default MusicPlayer;
