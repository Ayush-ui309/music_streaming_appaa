import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, Library, Heart, Diamond, Music2, BookMarked } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { usePlaylists } from '../context/PlaylistContext';
import { notificationService } from '../services/notificationService';
import CreatePlaylistModal from './CreatePlaylistModal';

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const { playlists } = usePlaylists();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <aside className="sidebar-container" style={styles.sidebar}>
      <div style={styles.topSection}>
        <div style={styles.logoContainer}>
          <img src="/logo.jpg" alt="SonicWave Logo" style={styles.logoImage} />
          <span style={styles.logoText}>SonicWave</span>
        </div>

        <nav style={styles.nav}>
          <NavLink to={ROUTES.HOME} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' })}>
            <Home size={24} style={styles.icon} /> Home
          </NavLink>
          <NavLink to={ROUTES.SEARCH} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' })}>
            <Compass size={24} style={styles.icon} /> Explore
          </NavLink>
          <NavLink to={ROUTES.WATCHLIST} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' })}>
            <BookMarked size={24} style={styles.icon} /> Watchlist
          </NavLink>
        </nav>
      </div>

      <div style={styles.librarySection}>
        <div style={styles.libraryHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Library size={24} color="var(--text-secondary)" />
            <span style={styles.libraryTitle}>Your Library</span>
          </div>
          <button style={styles.addBtn} title="Create playlist or folder" onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}>+</button>
        </div>

        <div style={styles.scrollArea}>
          <div style={styles.libraryCard}>
            <p style={styles.cardTitle}>Create your first playlist</p>
            <p style={styles.cardSub}>It's easy, we'll help you</p>
            <button className="btn-primary" style={styles.cardBtn} onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}>Create playlist</button>
          </div>

          <div style={styles.libraryCard}>
            <p style={styles.cardTitle}>Let's find some podcasts to follow</p>
            <p style={styles.cardSub}>We'll keep you updated on new episodes</p>
            <button className="btn-primary" style={styles.cardBtn} onClick={(e) => { e.stopPropagation(); navigate('/?tab=Podcasts'); }}>Browse podcasts</button>
          </div>

          <div style={{ marginTop: '32px' }}>
            {playlists.map(pl => (
              <NavLink
                key={pl.id}
                to={`/playlist/${pl.id}`}
                style={({ isActive }) => ({
                  ...styles.playlistText,
                  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                })}
              >
                <Music2 size={16} style={{ marginRight: '12px', opacity: 0.6 }} />
                <span className="text-ellipsis">{pl.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.bottomSection}>
        <button
          style={styles.premiumBox}
          onClick={() => navigate('/premium')}
        >
          <Diamond size={20} color="var(--primary-color)" />
          <span style={styles.premiumText}>Go Premium</span>
        </button>
      </div>

      <CreatePlaylistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </aside>
  );
};

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '8px',
    gap: '8px',
  },
  topSection: {
    backgroundColor: '#121212',
    borderRadius: '8px',
    padding: '20px 24px',
  },
  logoContainer: { display: 'flex', alignItems: 'center', marginBottom: '24px' },
  logoImage: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    marginRight: '12px',
    objectFit: 'cover',
  },
  logoText: { color: 'var(--text-primary)', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: {
    display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: '700',
    transition: 'all 0.2s', padding: '12px 0', borderRadius: '4px',
  },
  icon: { marginRight: '20px' },
  librarySection: {
    flex: 1,
    backgroundColor: '#121212',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  libraryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
  },
  libraryTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  addBtn: {
    fontSize: '24px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px 8px',
    transition: 'color 0.2s',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 8px 16px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  libraryCard: {
    backgroundColor: '#242424',
    borderRadius: '8px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
  },
  cardSub: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    margin: 0,
  },
  cardBtn: {
    marginTop: '12px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '700',
    width: 'fit-content',
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  playlistText: {
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
  bottomSection: {
    padding: '8px',
  },
  premiumBox: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px', backgroundColor: 'rgba(30, 215, 96, 0.1)',
    borderRadius: '12px', cursor: 'pointer', border: '1px solid rgba(30, 215, 96, 0.2)',
    transition: 'all 0.2s', width: '100%',
  },
  premiumText: { color: 'var(--primary-color)', fontWeight: '700', fontSize: '14px' },
};

export default Sidebar;
