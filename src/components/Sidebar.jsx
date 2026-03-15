import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, Library, Heart, Diamond, Music2 } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { usePlaylists } from '../context/PlaylistContext';
import { notificationService } from '../services/notificationService';

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const { playlists } = usePlaylists();
  const navigate = useNavigate();

  return (
    <aside className="sidebar-container" style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <img src="/logo.jpg" alt="SonicWave Logo" style={styles.logoImage} />
        <span style={styles.logoText}>SonicWave</span>
      </div>

      <nav style={styles.nav}>
        <NavLink to={ROUTES.HOME} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)' })}>
          <Home size={24} style={styles.icon} /> Home
        </NavLink>
        <NavLink to={ROUTES.SEARCH} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)' })}>
          <Compass size={24} style={styles.icon} /> Explore
        </NavLink>
        <NavLink to={ROUTES.DASHBOARD} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)' })}>
          <Library size={24} style={styles.icon} /> Library
        </NavLink>
      </nav>

      <div style={styles.section}>
        <NavLink to={ROUTES.FAVORITES} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)' })}>
          <div style={{ ...styles.iconBox, background: 'linear-gradient(135deg, #1f3f2d, #13271c)' }}>
            <Heart size={16} color="var(--primary-color)" fill="var(--primary-hover)" />
          </div>
          Liked Songs
        </NavLink>
      </div>

      <hr style={styles.divider} />

      <div style={styles.playlistSection}>
        <p style={styles.sectionLabel}>YOUR PLAYLISTS</p>
        {isAuthenticated && playlists.length === 0 && (
          <p style={{ ...styles.playlistText, fontStyle: 'italic', opacity: 0.5, paddingLeft: '16px' }}>
            No playlists yet
          </p>
        )}
        {playlists.map(pl => (
          <NavLink
            key={pl.id}
            to={`/playlist/${pl.id}`}
            style={({ isActive }) => ({
              ...styles.playlistText,
              color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(77, 244, 120, 0.05)' : 'transparent',
            })}
            title={pl.name}
          >
            <Music2 size={16} style={{ marginRight: '12px', opacity: 0.6 }} />
            <span className="text-ellipsis">{pl.name}</span>
          </NavLink>
        ))}
      </div>

      <button
        style={styles.premiumBox}
        onClick={() => navigate('/premium')}
      >
        <Diamond size={20} color="var(--primary-color)" />
        <span style={styles.premiumText}>Go Premium</span>
      </button>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 24px',
    height: '100%',
    position: 'relative',
    zIndex: 10,
  },
  logoContainer: { display: 'flex', alignItems: 'center', marginBottom: '40px' },
  logoImage: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    marginRight: '12px',
    objectFit: 'cover',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  logoText: { color: 'var(--primary-color)', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' },
  navItem: {
    display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: '600',
    transition: 'all 0.2s', padding: '12px 16px', borderRadius: '8px',
  },
  icon: { marginRight: '16px' },
  section: { marginBottom: '16px' },
  iconBox: {
    width: '32px', height: '32px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', borderRadius: '8px', marginRight: '12px',
    border: '1px solid var(--border-color)',
  },
  divider: { border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' },
  sectionLabel: {
    fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)',
    letterSpacing: '1.5px', paddingLeft: '16px', marginBottom: '8px',
  },
  playlistSection: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' },
  playlistText: {
    fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)',
    padding: '8px 16px', cursor: 'pointer', transition: 'color 0.2s',
    borderRadius: '4px', textAlign: 'left', background: 'none', border: 'none',
    width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  premiumBox: {
    marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px', backgroundColor: 'rgba(77, 244, 120, 0.1)',
    borderRadius: '12px', cursor: 'pointer', border: '1px solid rgba(77, 244, 120, 0.2)',
    transition: 'all 0.2s', width: '100%',
  },
  premiumText: { color: 'var(--primary-color)', fontWeight: '700', fontSize: '14px' },
};

export default Sidebar;
