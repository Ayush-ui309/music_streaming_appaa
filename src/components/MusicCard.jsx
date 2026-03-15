import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer';
import { useAuth } from '../hooks/useAuth';
import { favoriteService } from '../services/favoriteService';
import { useToast } from '../context/ToastContext';
import AddToPlaylistButton from './AddToPlaylistButton';

const MusicCard = ({ track, onPlay }) => {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFav, setIsFav] = React.useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;

  React.useEffect(() => {
    if (isAuthenticated) {
      favoriteService.checkIsFavorite(track.id).then(setIsFav);
    }
  }, [track.id, isAuthenticated]);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(track);
    } else {
      playTrack(track);
    }
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return addToast("Please log in to add favorites", "info");

    try {
      if (isFav) {
        await favoriteService.removeFavorite(track.id);
        setIsFav(false);
        addToast("Removed from Liked Songs", "info");
      } else {
        await favoriteService.addFavorite(track.id, track);
        setIsFav(true);
        addToast("Added to Liked Songs", "success");
      }
    } catch (error) {
      console.error("Error toggling favorite", error);
      addToast("Failed to update favorites", "error");
    }
  };

  return (
    <div 
      style={{
        ...styles.card,
        backgroundColor: isHovered ? 'var(--bg-hover)' : 'transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img src={track.image || 'https://via.placeholder.com/150'} alt={track.title} style={styles.image} />
        
        {(isHovered || isCurrentTrack) && (
          <button style={styles.playButton} onClick={handlePlayClick}>
            {isCurrentTrack && isPlaying ? (
              <Pause size={24} color="#000" fill="#000" />
            ) : (
              <Play size={24} color="#000" fill="#000" style={{ marginLeft: '4px' }} />
            )}
          </button>
        )}
      </div>

      <div style={styles.infoContainer}>
        <div style={styles.textContainer}>
          <h4 className="text-ellipsis" style={styles.title}>{track.title}</h4>
          <p className="text-ellipsis text-muted" style={styles.artist}>{track.artist}</p>
        </div>
        
        {isAuthenticated && isHovered && (
          <div style={styles.actionBtns}>
            <AddToPlaylistButton track={track} />
            <button onClick={toggleFavorite} style={styles.favBtn} title={isFav ? "Remove from favorites" : "Add to favorites"}>
              <Heart size={20} color={isFav ? 'var(--primary-color)' : 'var(--text-secondary)'} fill={isFav ? 'var(--primary-color)' : 'transparent'} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: { display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer', padding: '16px', borderRadius: '12px', transition: 'background-color 0.2s' },
  imageContainer: { position: 'relative', width: '100%', aspectRatio: '1', marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' },
  image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' },
  playButton: { position: 'absolute', bottom: '12px', right: '12px', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.4)', transition: 'all 0.2s', zIndex: 2 },
  infoContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  textContainer: { flex: 1, overflow: 'hidden' },
  title: { fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' },
  artist: { fontSize: '14px', margin: 0 },
  actionBtns: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 },
  favBtn: { padding: '4px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.1s' }
};

export default MusicCard;
