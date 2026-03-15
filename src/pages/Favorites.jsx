import React, { useEffect, useState } from 'react';
import { favoriteService } from '../services/favoriteService';
import MusicCard from '../components/MusicCard';
import Loader from '../components/Loader';
import { usePlayer } from '../hooks/usePlayer';
import { Heart, Disc } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    const fetchFavoriteTracks = async () => {
      try {
        const data = await favoriteService.getFavorites();
        // Inject the track_id into metadata to fix the "all songs playing" bug
        setFavorites(data.map(fav => ({
          ...fav.metadata,
          id: fav.track_id
        })));
      } catch (error) {
        console.error("Failed to load favorites", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavoriteTracks();
  }, []);

  if (loading) return <Loader text="Retrieving your collection..." />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.heroGlow} />
        <div style={styles.iconBox}><Heart size={48} color="#fff" fill="#fff" /></div>
        <div style={styles.headerInfo}>
          <p style={styles.label}>PLAYLIST</p>
          <h1 style={styles.title}>Liked Songs</h1>
          <p style={styles.meta}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{favorites.length} songs</span>
          </p>
        </div>
      </div>

      <div style={styles.content}>
        {favorites.length === 0 ? (
          <div style={styles.emptyState}>
            <Disc size={64} color="var(--text-secondary)" style={{ marginBottom: '24px', opacity: 0.3 }} />
            <h3>Your collection is empty</h3>
            <p style={{ maxWidth: '400px', margin: '8px auto 0 auto' }}>
              Save songs to your library by clicking the heart icon. They will appear here for quick access.
            </p>
          </div>
        ) : (
          <div className="grid-system">
            {favorites.map(track => (
              <MusicCard key={track.id} track={track} onPlay={() => playTrack(track, favorites)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' },
  header: {
    display: 'flex', alignItems: 'flex-end', gap: '32px', padding: '60px 0 32px 0',
    position: 'relative', overflow: 'hidden', marginBottom: '40px',
    borderBottom: '1px solid var(--border-color)',
  },
  heroGlow: {
    position: 'absolute', top: '-50%', left: '-20%', width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(77, 244, 120, 0.08) 0%, transparent 70%)',
    zIndex: -1, pointerEvents: 'none',
  },
  iconBox: {
    width: '180px', height: '180px', background: 'linear-gradient(135deg, #4df478, #2a8a44)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', flexShrink: 0,
  },
  headerInfo: { flex: 1, paddingBottom: '8px' },
  label: { fontSize: '12px', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px' },
  title: { fontSize: '72px', fontWeight: '900', margin: '0 0 12px 0', letterSpacing: '-3px', lineHeight: 1 },
  meta: { fontSize: '15px', color: 'var(--text-secondary)' },
  content: { marginTop: '24px' },
  emptyState: { textAlign: 'center', padding: '120px 0', color: 'var(--text-secondary)' }
};

export default Favorites;
