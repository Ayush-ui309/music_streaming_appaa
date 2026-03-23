import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const PLAYLIST_GRADIENTS = [
  'linear-gradient(135deg, #450af5 0%, #c4efd9 100%)',
  'linear-gradient(135deg, #f50a45 0%, #d9efc4 100%)',
  'linear-gradient(135deg, #0af545 0%, #c4d9ef 100%)',
  'linear-gradient(135deg, #f5a50a 0%, #efc4d9 100%)',
  'linear-gradient(135deg, #0ac4f5 0%, #efd9c4 100%)',
];

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();
  // Use playlist ID to consistently pick a gradient
  const gradientIndex = Math.abs(playlist.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % PLAYLIST_GRADIENTS.length;
  const background = PLAYLIST_GRADIENTS[gradientIndex];

  return (
    <div 
      className="card fade-in" 
      style={styles.card}
      onClick={() => navigate(ROUTES.PLAYLIST.replace(':id', playlist.id))}
    >
      <div style={styles.imageContainer}>
        <div style={{ ...styles.placeholderBg, background }}>
          <span style={styles.initial}>{playlist.name.charAt(0).toUpperCase()}</span>
        </div>
      </div>
      <h4 className="text-ellipsis" style={styles.title}>{playlist.name}</h4>
      <p className="text-ellipsis" style={styles.desc}>By You</p>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: '1',
    marginBottom: '16px',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  placeholderBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  desc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
  }
};

export default PlaylistCard;
