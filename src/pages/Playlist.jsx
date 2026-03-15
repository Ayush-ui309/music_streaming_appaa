import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Heart, Download, Pause, Share2, Music2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { playlistService } from '../services/playlistService';
import { usePlayer } from '../hooks/usePlayer';
import Loader from '../components/Loader';
import { formatTime } from '../utils/formatTime';

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const data = await playlistService.getPlaylist(id);
        setPlaylist(data);
      } catch (error) {
        console.error("Failed to fetch playlist", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  if (loading) return <Loader text="Loading playlist..." />;

  if (!playlist) return <div>Playlist not found.</div>;

  const tracks = playlist.playlist_tracks?.map(pt => ({
    ...pt.metadata,
    id: pt.track_id, 
  })) || [];

  // Calculate duration correctly
  const totalSeconds = tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const durationStr = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

  const coverImage = tracks[0]?.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4';

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    addToast('Playlist link copied to clipboard!', 'success');
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  return (
    <div style={styles.playlistContainer}>
      <div style={styles.header}>
        <div style={styles.imagePlaceholder}>
           {tracks[0]?.image ? (
             <img src={coverImage} alt="playlist cover" style={styles.coverImage} />
           ) : (
             <div style={styles.emptyCover}><Music2 size={64} color="var(--text-secondary)" /></div>
           )}
        </div>
        <div style={styles.headerInfo}>
          <span style={styles.tag}>PLAYLIST</span>
          <h1 style={styles.title}>{playlist.name}</h1>
          <p style={styles.description}>{playlist.description || 'Collection of my favorite tracks'}</p>
          <p style={styles.meta}>
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{tracks.length} {tracks.length === 1 ? 'song' : 'songs'}</span> • {durationStr}
          </p>
        </div>
      </div>

      <div style={styles.actionsBox}>
        <button className="btn-primary" onClick={handlePlayAll} style={styles.playAllBtn}>
          <Play size={20} fill="#000" style={{ marginRight: '8px' }} /> Play All
        </button>
        <button style={styles.iconCircle} title="Like Playlist"><Heart size={20} /></button>
        <button style={styles.iconCircle} onClick={handleShare} title="Share Playlist"><Share2 size={20} /></button>
        <button style={styles.iconCircle} title="Download"><Download size={20} /></button>
      </div>

      <div style={styles.trackListContainer}>
        <div style={styles.tableHeader}>
          <div style={{ width: '40px', textAlign: 'center' }}>#</div>
          <div style={{ flex: 1 }}>TITLE</div>
          <div style={{ width: '80px', textAlign: 'right' }}>DURATION</div>
        </div>

        {tracks.length === 0 ? (
          <div style={styles.emptyState}>
            <p>This playlist is empty. Start adding songs!</p>
          </div>
        ) : (
          <div style={styles.tracks}>
            {tracks.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              
              return (
                <div 
                  key={track.id} 
                  style={{
                    ...styles.trackRow, 
                    backgroundColor: isCurrent ? 'var(--bg-hover)' : 'transparent',
                    borderLeft: isCurrent ? '4px solid var(--primary-color)' : '4px solid transparent'
                  }}
                  onClick={() => playTrack(track, tracks)}
                >
                  <div style={styles.trackIndex}>
                    {isCurrent ? (
                       isPlaying ? <Pause size={16} color="var(--primary-color)" /> : <Play size={16} color="var(--primary-color)" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div style={styles.trackInfo}>
                    <h4 style={{
                      ...styles.trackTitle,
                      color: isCurrent ? 'var(--primary-color)' : 'var(--text-primary)'
                    }}>{track.title}</h4>
                    <p style={styles.trackArtist}>{track.artist || 'Unknown Artist'}</p>
                  </div>
                  <div style={styles.trackDuration}>
                    {formatTime(track.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  playlistContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 0 80px 0'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '24px 0',
  },
  imagePlaceholder: {
    width: '320px',
    height: '320px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '32px',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  emptyCover: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-surface-light)',
  },
  headerInfo: {
    textAlign: 'left',
    width: '100%',
    maxWidth: '800px'
  },
  tag: {
    color: 'var(--primary-color)',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '56px',
    fontWeight: '800',
    margin: '8px 0 16px 0',
    letterSpacing: '-1.5px',
    lineHeight: '1.1'
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '18px',
    marginBottom: '16px',
    lineHeight: '1.5',
    maxWidth: '600px'
  },
  meta: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  actionsBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '40px',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto 40px auto'
  },
  playAllBtn: {
    padding: '16px 40px',
    fontSize: '16px',
    borderRadius: '100px',
    boxShadow: '0 0 30px rgba(77, 244, 120, 0.3)',
  },
  iconCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
    transition: 'all 0.2s',
  },
  trackListContainer: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto'
  },
  tableHeader: {
    display: 'flex',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: '800',
    padding: '0 16px 12px 16px',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '8px'
  },
  tracks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  trackRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '0 8px 8px 0',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  trackIndex: {
    width: '40px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontSize: '14px'
  },
  trackInfo: {
    flex: 1,
    overflow: 'hidden'
  },
  trackTitle: {
    fontSize: '15px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  trackArtist: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0
  },
  trackDuration: {
    width: '80px',
    textAlign: 'right',
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },
  emptyState: {
    padding: '48px 0',
    color: 'var(--text-secondary)',
    textAlign: 'center'
  }
};

export default Playlist;
