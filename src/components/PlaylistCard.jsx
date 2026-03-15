import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="card" 
      style={styles.card}
      onClick={() => navigate(ROUTES.PLAYLIST.replace(':id', playlist.id))}
    >
      <div style={styles.imageContainer}>
        {/* Mock visual setup for Playlist */}
        <div style={styles.placeholderBg}>
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
