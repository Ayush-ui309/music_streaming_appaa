import React from 'react';
import { Play, Pause, Heart, BookMarked } from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer';
import { useAuth } from '../hooks/useAuth';
import { useWatchlist } from '../context/WatchlistContext';
import { favoriteService } from '../services/favoriteService';
import { useToast } from '../context/ToastContext';
import AddToPlaylistButton from './AddToPlaylistButton';

const MusicCard = ({ track, onPlay, variant = 'track' }) => {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const { isAuthenticated } = useAuth();
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { addToast } = useToast();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFav, setIsFav] = React.useState(false);

  const watchlisted = isInWatchlist(track.id);

  const toggleWatchlist = async (e) => {
    e.stopPropagation();
    if (watchlisted) {
      await removeFromWatchlist(track.id);
    } else {
      await addToWatchlist(track);
    }
  };

  const isCurrentTrack = currentTrack?.id === track.id;
  const isArtist = variant === 'artist';

  React.useEffect(() => {
    if (isAuthenticated && !isArtist) {
      favoriteService.checkIsFavorite(track.id).then(setIsFav);
    }
  }, [track.id, isAuthenticated, isArtist]);

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
      className="card fade-in"
      style={{
        ...styles.card,
        backgroundColor: isHovered ? 'var(--bg-hover)' : 'transparent',
        textAlign: isArtist ? 'center' : 'left',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayClick}
    >
      <div style={{
        ...styles.imageContainer,
        borderRadius: isArtist ? '50%' : '4px',
      }}>
        <img src={track.image || 'https://via.placeholder.com/150'} alt={track.title} style={styles.image} />
        
        {!isArtist && (
          <div style={{
            ...styles.playButton,
            opacity: isHovered || isCurrentTrack ? 1 : 0,
            transform: isHovered || isCurrentTrack ? 'translateY(0)' : 'translateY(8px)',
          }} onClick={(e) => { e.stopPropagation(); handlePlayClick(e); }}>
            {isCurrentTrack && isPlaying ? (
              <Pause size={24} color="#000" fill="#000" />
            ) : (
              <Play size={24} color="#000" fill="#000" style={{ marginLeft: '4px' }} />
            )}
          </div>
        )}
      </div>

      <div style={styles.infoContainer}>
        <div style={{ ...styles.textContainer, alignItems: isArtist ? 'center' : 'flex-start', display: 'flex', flexDirection: 'column' }}>
          <h4 className="text-ellipsis" style={styles.title}>{isArtist ? track.artist : track.title}</h4>
          <p className="text-ellipsis text-muted" style={styles.artist}>{isArtist ? 'Artist' : track.artist}</p>
        </div>
        
        {isAuthenticated && isHovered && (
          <div style={styles.actionBtns} onClick={(e) => e.stopPropagation()}>
            <AddToPlaylistButton track={track} />
            <button onClick={toggleWatchlist} style={styles.favBtn} title={watchlisted ? "Remove from watchlist" : "Add to watchlist"}>
              <BookMarked size={18} color={watchlisted ? 'var(--primary-color)' : 'var(--text-secondary)'} />
            </button>
            <button onClick={toggleFavorite} style={styles.favBtn} title={isFav ? "Remove from favorites" : "Add to favorites"}>
              <Heart size={18} color={isFav ? 'var(--primary-color)' : 'var(--text-secondary)'} fill={isFav ? 'var(--primary-color)' : 'transparent'} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: { 
    display: 'flex', 
    flexDirection: 'column', 
    position: 'relative', 
    cursor: 'pointer', 
    padding: '12px', /* Reduced from 16px */
    borderRadius: '8px', /* More standard Spotify rounding */
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  imageContainer: { 
    position: 'relative', 
    width: '100%', 
    aspectRatio: '1', 
    marginBottom: '12px', /* Reduced from 16px */
    borderRadius: '4px', /* Tighter rounding for smaller cards */
    overflow: 'hidden', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  },
  image: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover',
  },
  playButton: { 
    position: 'absolute', 
    bottom: '6px', 
    right: '6px', 
    width: '40px', /* Reduced from 48px */
    height: '40px', /* Reduced from 48px */
    borderRadius: '50%', 
    backgroundColor: 'var(--primary-color)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    boxShadow: '0 4px 8px rgba(0,0,0,0.4)', 
    transition: 'all 0.3s ease', 
    zIndex: 2,
    cursor: 'pointer',
  },
  infoContainer: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    minHeight: '32px',
  },
  textContainer: { 
    flex: 1, 
    overflow: 'hidden',
  },
  title: { 
    fontSize: '14px', /* Reduced from 16px */
    fontWeight: '700', 
    margin: '0 0 2px 0',
    color: 'var(--text-primary)',
  },
  artist: { 
    fontSize: '12px', /* Reduced from 13px */
    margin: 0,
    fontWeight: '500',
  },
  actionBtns: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '4px', 
    flexShrink: 0,
    marginTop: '4px',
  },
  favBtn: { 
    padding: '4px', 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    transition: 'transform 0.1s',
  }
};

export default MusicCard;
