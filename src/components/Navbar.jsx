import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Bell, Settings, Sun, Moon, LogOut, Star } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../utils/constants';
import { notificationService } from '../services/notificationService';

const Navbar = () => {
  const { user, profile, isAuthenticated } = useAuth();
  console.log("[Navbar] Rendering. Profile:", profile?.avatar);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Poll unread count when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      const count = await notificationService.getUnreadCount();
      setUnread(count);
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpenNotifications = async () => {
    if (showNotif) { setShowNotif(false); return; }
    const data = await notificationService.getNotifications();
    setNotifications(data);
    setShowNotif(true);
    if (unread > 0) {
      await notificationService.markAllRead();
      setUnread(0);
    }
  };

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  const handleLogout = async () => {
    import('../services/authService').then(async ({ authService }) => {
      await authService.logout();
      navigate(ROUTES.LOGIN);
    });
  };



  const TYPE_COLOR = { info: '#64a0ff', success: '#4df478', warning: '#ffb347', error: '#ff4d4d' };

  return (
    <nav style={styles.navbar}>
      {/* Left: clickable profile area */}
      <div style={styles.leftSection} ref={profileRef}>
        <div 
          style={styles.profileTrigger} 
          onClick={() => setShowProfile(!showProfile)}
        >
          <UserAvatar avatar={profile?.avatar} size={40} border />
          
          <div className="hide-mobile" style={styles.welcomeText}>
            <span style={styles.welcomeSub}>Welcome back,</span><br />
            <span style={styles.welcomeMain}>
              {isAuthenticated
                ? (user.user_metadata?.display_name || user.email.split('@')[0]).replace(/_/g, ' ')
                : 'Guest'}
            </span>
          </div>
        </div>

        {/* Profile Dropdown */}
        {showProfile && isAuthenticated && (
          <div style={styles.profileDropdown}>
            <div style={styles.dropdownHeader}>
              <UserAvatar avatar={profile?.avatar} size={48} border />
              <div style={{ overflow: 'hidden' }}>
                <p style={styles.dropdownName}>{(user.user_metadata?.display_name || user.email.split('@')[0]).replace(/_/g, ' ')}</p>
                <p style={styles.dropdownEmail}>{user.email}</p>
              </div>
            </div>
            
            <div style={styles.menuList}>
              <div style={styles.menuItem} onClick={() => { navigate(ROUTES.PROFILE); setShowProfile(false); }}>
                <Settings size={18} />
                <span>Account Settings</span>
              </div>
              <div style={styles.menuItem} onClick={() => { navigate('/premium'); setShowProfile(false); }}>
                <Star size={18} color="var(--primary-color)" />
                <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Try SonicWave Pro</span>
              </div>
              <hr style={styles.menuDivider} />
              <div style={{ ...styles.menuItem, color: '#ff4d4d' }} onClick={handleLogout}>
                <LogOut size={18} />
                <span>Log Out</span>
              </div>
            </div>
          </div>
        )}

        <img src="/logo.jpg" alt="Logo" className="hide-desktop" style={styles.mobileLogo} />
      </div>

      {/* Right: icons */}
      <div style={styles.authSection}>
        {/* Theme Toggle */}
        <button style={styles.iconCircle} onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {isAuthenticated ? (
          <>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button style={styles.iconCircle} onClick={handleOpenNotifications} title="Notifications">
                <Bell size={20} color="var(--text-primary)" />
                {unread > 0 && (
                  <span style={styles.badge}>{unread}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotif && (
                <div style={styles.notifDropdown}>
                  <div style={styles.notifHeader}>
                    <span style={{ fontWeight: '700', fontSize: '15px' }}>Notifications</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {notifications.length} total
                    </span>
                  </div>
                  <div style={styles.notifList}>
                    {notifications.length === 0 ? (
                      <div style={styles.notifEmpty}>
                        <Bell size={32} color="var(--text-secondary)" />
                        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                          No notifications yet
                        </p>
                      </div>
                    ) : notifications.map(n => (
                      <div key={n.id} style={{
                        ...styles.notifItem,
                        background: n.read ? 'transparent' : 'rgba(77,244,120,0.04)',
                      }}>
                        <span style={{
                          width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                          backgroundColor: TYPE_COLOR[n.type] || '#64a0ff',
                          marginTop: '4px',
                        }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)' }}>
                            {n.message}
                          </p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {timeAgo(n.created_at)}
                          </p>
                        </div>
                        {!n.read && <span style={styles.unreadDot} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings → Profile */}
            <button style={styles.iconCircle} onClick={() => navigate(ROUTES.PROFILE)} title="Profile & Settings">
              <Settings size={20} color="var(--text-primary)" />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => navigate(ROUTES.LOGIN)}>Sign in</button>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', backgroundColor: 'rgba(11, 17, 13, 0.75)', 
    position: 'fixed', top: 0, left: 'var(--navbar-left)', right: 0, 
    height: 'var(--navbar-height)', zIndex: 100,
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-color)',
  },
  leftSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  profileBadge: {
    width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(77, 244, 120, 0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid rgba(77, 244, 120, 0.2)', cursor: 'pointer',
  },
  welcomeText: { lineHeight: '1.2' },
  mobileLogo: { width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' },
  welcomeSub: { fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' },
  authSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  profileTrigger: {
    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
    padding: '4px 8px', borderRadius: '500px', transition: 'all 0.2s',
    backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
  },
  profileDropdown: {
    position: 'absolute', top: 'calc(100% + 12px)', left: '24px', width: '280px',
    backgroundColor: '#141f1a', border: '1px solid var(--border-color)',
    borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    zIndex: 200, overflow: 'hidden',
  },
  dropdownHeader: {
    padding: '20px', borderBottom: '1px solid var(--border-color)',
    display: 'flex', gap: '12px', alignItems: 'center',
    background: 'linear-gradient(to bottom right, rgba(77,244,120,0.05), transparent)',
  },
  dropdownName: { margin: 0, fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' },
  dropdownEmail: { margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)', wordBreak: 'break-all' },
  menuList: { padding: '8px' },
  menuItem: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s',
    fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)',
  },
  menuDivider: { border: 'none', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '4px 0' },
  iconCircle: {
    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
    border: '1px solid var(--border-color)', transition: 'all 0.2s', cursor: 'pointer',
  },
  badge: {
    position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px',
    borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: '#000',
    fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center',
    justifyContent: 'center',
  },
  notifDropdown: {
    position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '320px',
    backgroundColor: '#141f1a', border: '1px solid var(--border-color)',
    borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    zIndex: 200, overflow: 'hidden',
  },
  notifHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid var(--border-color)',
  },
  notifList: { maxHeight: '380px', overflowY: 'auto' },
  notifEmpty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '48px 24px',
  },
  notifItem: {
    display: 'flex', gap: '12px', alignItems: 'flex-start',
    padding: '12px 20px', transition: 'background 0.15s',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  unreadDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    backgroundColor: 'var(--primary-color)', flexShrink: 0, marginTop: '6px',
  },
};

export default Navbar;
