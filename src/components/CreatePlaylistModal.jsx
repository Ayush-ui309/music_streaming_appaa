import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePlaylists } from '../context/PlaylistContext';
import { useNavigate } from 'react-router-dom';

const CreatePlaylistModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPlaylist } = usePlaylists();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const newPlaylist = await createPlaylist(name, description);
      onClose();
      navigate(`/playlist/${newPlaylist.id}`);
    } catch (err) {
      console.error("Failed to create playlist:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Playlist</h2>
          <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Playlist #1"
              style={styles.input}
              autoFocus
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a description"
              style={{ ...styles.input, height: '100px', resize: 'none' }}
            />
          </div>
          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={isSubmitting || !name.trim()} style={styles.createBtn}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: '#282828',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '480px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: { fontSize: '24px', fontWeight: '800', margin: 0, color: '#fff' },
  closeBtn: { background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', padding: '4px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '700', color: '#fff' },
  input: {
    backgroundColor: '#3e3e3e',
    border: '1px solid transparent',
    borderRadius: '4px',
    padding: '12px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' },
  cancelBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '12px 24px',
  },
  createBtn: {
    backgroundColor: '#1ed760',
    color: '#000',
    borderRadius: '32px',
    border: 'none',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '12px 32px',
    transition: 'transform 0.1s',
  },
};

export default CreatePlaylistModal;
