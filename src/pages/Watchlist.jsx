import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { usePlayer } from '../hooks/usePlayer';
import MusicCard from '../components/MusicCard';
import Loader from '../components/Loader';
import { BookMarked, Play, Trash2 } from 'lucide-react';

const Watchlist = () => {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  if (loading && watchlist.length === 0) return <Loader text="Loading your watchlist..." />;

  const tracks = watchlist.map(item => ({
    id: item.track_id,
    ...item.metadata
  }));

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.iconBox}>
          <BookMarked size={48} color="var(--primary-color)" />
        </div>
        <div style={styles.headerInfo}>
          <p style={styles.label}>Private List</p>
          <h1 style={styles.title}>Watchlist</h1>
          <p style={styles.stats}>{watchlist.length} tracks</p>
        </div>
      </header>

      <div style={styles.content}>
        {watchlist.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '48px' }}>📑</p>
            <h2 style={{ marginTop: '24px' }}>Your watchlist is empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Save songs here to listen to them later.
            </p>
          </div>
        ) : (
          <div className="grid-system">
            {tracks.map(track => (
              <div key={track.id} style={{ position: 'relative' }}>
                <MusicCard 
                  track={track} 
                  onPlay={() => playTrack(track, tracks)} 
                />
                <button 
                  style={styles.removeBtn} 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(track.id);
                  }}
                  title="Remove from watchlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '0 0 80px 0' },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '24px',
    padding: '40px 32px 32px 32px',
    background: 'linear-gradient(to bottom, #2a2a2a, var(--bg-color))',
    marginBottom: '24px',
  },
  iconBox: {
    width: '160px',
    height: '160px',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  headerInfo: { flex: 1 },
  label: { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#fff' },
  title: { fontSize: '72px', fontWeight: '900', margin: '0 0 12px 0', letterSpacing: '-2px', lineHeight: 1, color: '#fff' },
  stats: { fontSize: '14px', fontWeight: '600', color: '#fff' },
  content: { padding: '0 32px' },
  empty: { textAlign: 'center', padding: '100px 0' },
  removeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    border: 'none',
    borderRadius: '50%',
    color: '#ff4d4d',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
};

export default Watchlist;
