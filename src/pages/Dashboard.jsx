import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlaylists } from '../context/PlaylistContext';
import PlaylistCard from '../components/PlaylistCard';
import Loader from '../components/Loader';
import { Music2, Plus, Search, Trash2, X, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { notificationService } from '../services/notificationService';

const Dashboard = () => {
  const { user } = useAuth();
  const { playlists, loading, createPlaylist, deletePlaylist } = usePlaylists();
  const { addToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const newPlaylist = await createPlaylist(newName.trim(), newDesc.trim() || "My custom playlist");
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
      addToast('Playlist created successfully!', 'success');
      notificationService.addNotification(`Created playlist "${newPlaylist.name}"`, 'success');
    } catch (error) {
      addToast('Failed to create playlist', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deletePlaylist(id);
      addToast('Playlist deleted', 'info');
    } catch (err) {
      addToast('Delete failed', 'error');
    }
  };

  if (loading) return <Loader text="Unlocking your library..." />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 className="title-lg">Your Library</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            {playlists.length} custom {playlists.length === 1 ? 'playlist' : 'playlists'}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={20} style={{ marginRight: '8px' }} /> Create New
        </button>
      </div>

      {showCreate && (
        <div style={styles.modalOverlay} onClick={() => setShowCreate(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>New Playlist</h3>
              <button onClick={() => setShowCreate(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input 
                  autoFocus
                  placeholder="My awesome mix" 
                  className="input-field" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description (Optional)</label>
                <textarea 
                  placeholder="Tell us about this playlist..." 
                  className="input-field" 
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                />
              </div>
              <div style={styles.modalFooter}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={!newName.trim()}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {playlists.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}><Music2 size={48} color="var(--primary-color)" /></div>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Create your first playlist</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto 24px auto', color: 'var(--text-secondary)' }}>
            Organize your favorite Jamendo tracks into custom collections for any mood or activity.
          </p>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>Get Started</button>
        </div>
      ) : (
        <div className="grid-system">
          {playlists.map(playlist => (
            <div key={playlist.id} style={{ position: 'relative' }}>
              <PlaylistCard playlist={playlist} />
              <button 
                style={styles.absDelete}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(playlist.id, playlist.name);
                }}
                title="Delete Playlist"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', textAlign: 'center' },
  emptyIcon: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(77, 244, 120, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(77, 244, 120, 0.1)' },
  absDelete: { position: 'absolute', top: '12px', right: '12px', zIndex: 5, backgroundColor: 'rgba(255,77,77,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.2)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.8, transition: 'all 0.2s' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { width: '450px', backgroundColor: '#141f1a', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.5px' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' },
};

export default Dashboard;
