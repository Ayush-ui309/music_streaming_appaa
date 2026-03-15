import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, Search } from 'lucide-react';
import { ROUTES } from '../utils/constants';

const BottomNav = () => {
  return (
    <nav className="bottom-nav-container" style={styles.bottomNav}>
      <NavLink to={ROUTES.HOME} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)' })}>
        <Home size={24} />
        <span style={styles.label}>Home</span>
      </NavLink>
      <NavLink to={ROUTES.SEARCH} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)' })}>
        <Search size={24} />
        <span style={styles.label}>Search</span>
      </NavLink>
      <NavLink to={ROUTES.DASHBOARD} style={({ isActive }) => ({ ...styles.navItem, color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)' })}>
        <Library size={24} />
        <span style={styles.label}>Library</span>
      </NavLink>
    </nav>
  );
};

const styles = {
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'var(--bottom-nav-height)',
    backgroundColor: 'var(--bg-surface)',
    borderTop: '1px solid var(--border-color)',
    display: 'none', // Shown via media query in CSS or conditional rendering
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1001,
    padding: '0 12px',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  label: {
    fontSize: '10px',
    fontWeight: '600',
  }
};

// Add media query purely in styles if needed, but App.jsx will handle visibility
export default BottomNav;
