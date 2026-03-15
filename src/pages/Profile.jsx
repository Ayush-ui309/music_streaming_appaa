import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Music2, Diamond, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { playlistService } from '../services/playlistService';
import { usePlaylists } from '../context/PlaylistContext';
import { ROUTES } from '../utils/constants';
import { profileService } from '../services/profileService';
import UserAvatar, { AVATAR_OPTIONS } from '../components/UserAvatar';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, profile, refreshProfile, updateProfileState } = useAuth();
  const { playlists, loading: loadingPlaylists, deletePlaylist } = usePlaylists();
  const navigate = useNavigate();
  const [isPremium] = useState(false); // mock premium state
  const [avatar, setAvatar] = useState('icon:User:#4df478');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    if (profile?.avatar) {
      setAvatar(profile.avatar);
    }
  }, [user, profile]);

  const handleAvatarSelect = async (option) => {
    const newAvatar = `${option.type}:${option.value}:${option.color}`;
    setSaving(true);
    try {
      setAvatar(newAvatar);
      // Optimistically update global state
      updateProfileState({ avatar: newAvatar });
      
      await profileService.updateProfile(user.id, { avatar: newAvatar });
      // Follow up with a refresh to be safe
      await refreshProfile(user.id);
      addToast('Profile avatar updated!', 'success');
    } catch (err) {
      addToast('Failed to update avatar', 'error');
      // Revert optimism if needed (refresh handles it)
      await refreshProfile(user.id);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate(ROUTES.LOGIN);
  };

  const handleDeletePlaylist = async (id) => {
    if (!window.confirm('Delete this playlist?')) return;
    try {
      await deletePlaylist(id);
      addToast('Playlist deleted', 'success');
    } catch (err) {
      addToast('Failed to delete playlist', 'error');
    }
  };

  if (!user) return <div style={{ padding: '32px', color: 'var(--text-secondary)' }}>No user logged in.</div>;

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div style={styles.container}>
      {/* Hero Header */}
      <div style={styles.hero}>
        <div style={{ position: 'relative' }}>
          <UserAvatar avatar={avatar} size={140} border />
          {isPremium && (
            <div style={styles.premiumBadge}><Diamond size={12} color="#000" /></div>
          )}
        </div>
        <div style={styles.userInfo}>
          <p style={styles.profileLabel}>Profile</p>
          <h1 style={styles.name}>{displayName}</h1>
          <p style={styles.email}>{user.email}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Member since {joinedDate} · {playlists.length} playlists
          </p>
          {isPremium && (
            <div style={styles.premiumTag}>
              <Diamond size={14} color="var(--primary-color)" />
              <span>Premium Member</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{playlists.length}</span>
          <span style={styles.statLabel}>Playlists</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNum}>∞</span>
          <span style={styles.statLabel}>Songs Played</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{isPremium ? 'Premium' : 'Free'}</span>
          <span style={styles.statLabel}>Plan</span>
        </div>
      </div>

      {/* Playlists Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Playlists</h2>
        {loadingPlaylists ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading playlists...</p>
        ) : playlists.length === 0 ? (
          <div style={styles.emptyState}>
            <Music2 size={40} color="var(--text-secondary)" />
            <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>No playlists yet</p>
          </div>
        ) : (
          <div style={styles.playlistGrid}>
            {playlists.map(pl => (
              <div key={pl.id} style={styles.playlistRow}>
                <div
                  style={styles.playlistInfo}
                  onClick={() => navigate(`/playlist/${pl.id}`)}
                >
                  <div style={styles.playlistIcon}><Music2 size={18} color="var(--primary-color)" /></div>
                  <div>
                    <p style={styles.playlistName}>{pl.name}</p>
                    <p style={styles.playlistDate}>
                      {new Date(pl.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDeletePlaylist(pl.id)}
                  title="Delete playlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Avatar Selection */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Choose Your Avatar</h2>
        <div style={styles.avatarGrid}>
          {AVATAR_OPTIONS.map((opt, i) => {
            const optValue = `${opt.type}:${opt.value}:${opt.color}`;
            const isSelected = avatar === optValue;
            
            return (
              <div 
                key={i} 
                className={`card ${isSelected ? 'active' : ''}`}
                style={{
                  ...styles.avatarOpt,
                  borderColor: isSelected ? 'var(--primary-color)' : 'var(--border-color)',
                  opacity: saving ? 0.6 : 1,
                  pointerEvents: saving ? 'none' : 'auto',
                  backgroundColor: isSelected ? 'rgba(77, 244, 120, 0.05)' : 'var(--bg-surface)'
                }}
                onClick={() => handleAvatarSelect(opt)}
              >
                <UserAvatar avatar={optValue} size={48} />
                <span style={styles.optLabel}>{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Account</h2>
        <div style={styles.actionsList}>
          {!isPremium && (
            <button
              style={styles.actionBtn}
              onClick={() => navigate('/premium')}
            >
              <Diamond size={18} color="var(--primary-color)" />
              <span>Upgrade to Premium</span>
            </button>
          )}
          <button style={{ ...styles.actionBtn, color: '#ff4d4d' }} onClick={handleLogout}>
            <LogOut size={18} color="#ff4d4d" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '0 0 80px 0' },
  hero: {
    display: 'flex', alignItems: 'flex-end', gap: '32px', marginBottom: '40px',
    padding: '40px 0 32px', borderBottom: '1px solid var(--border-color)',
  },
  avatar: {
    width: '140px', height: '140px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a3a25, #0b1f13)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 60px rgba(0,0,0,0.5)', border: '2px solid rgba(77,244,120,0.2)',
    flexShrink: 0, position: 'relative',
  },
  initial: { fontSize: '56px', fontWeight: '800', color: '#fff' },
  premiumBadge: {
    position: 'absolute', bottom: '6px', right: '6px',
    width: '24px', height: '24px', borderRadius: '50%',
    backgroundColor: 'var(--primary-color)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  userInfo: { flex: 1, paddingBottom: '8px' },
  profileLabel: { fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.5px' },
  name: { fontSize: '56px', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-2px', lineHeight: 1 },
  email: { fontSize: '15px', color: 'var(--text-secondary)', margin: 0 },
  premiumTag: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(77,244,120,0.1)', border: '1px solid rgba(77,244,120,0.3)',
    borderRadius: '500px', padding: '4px 12px', marginTop: '12px',
    fontSize: '13px', fontWeight: '600', color: 'var(--primary-color)',
  },
  statsRow: {
    display: 'flex', gap: '1px', marginBottom: '40px',
    border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden',
  },
  statBox: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '24px', backgroundColor: 'var(--bg-surface)',
  },
  statNum: { fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' },
  statLabel: { fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '500' },
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '20px' },
  playlistGrid: { display: 'flex', flexDirection: 'column', gap: '4px' },
  playlistRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', borderRadius: '8px', transition: 'background 0.15s',
  },
  playlistInfo: {
    display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', flex: 1,
  },
  playlistIcon: {
    width: '44px', height: '44px', borderRadius: '8px',
    backgroundColor: 'rgba(77,244,120,0.1)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  playlistName: { fontWeight: '600', fontSize: '15px', margin: 0 },
  playlistDate: { fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' },
  deleteBtn: {
    padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
    color: 'rgba(255,77,77,0.6)', background: 'none', transition: 'all 0.15s',
  },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' },
  actionsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px',
    marginTop: '16px'
  },
  avatarOpt: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    cursor: 'pointer',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    transition: 'all 0.2s'
  },
  optLabel: { fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' },
  actionBtn: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '16px 20px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '15px',
    fontWeight: '600', transition: 'all 0.2s', color: 'var(--text-primary)', fontFamily: 'inherit',
  },
};

export default Profile;
