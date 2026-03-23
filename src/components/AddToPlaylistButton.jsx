import React, { useEffect, useState, useRef } from 'react';
import { ListPlus, Plus, Check, X, Loader } from 'lucide-react';
import { playlistService } from '../services/playlistService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { notificationService } from '../services/notificationService';

const AddToPlaylistButton = ({ track }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    setLoading(true);
    playlistService.getUserPlaylists()
      .then(setPlaylists)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, isAuthenticated]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setCreating(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return addToast('Please log in to add to a playlist', 'info');
    setOpen(prev => !prev);
  };

  const handleAdd = async (e, playlist) => {
    e.stopPropagation();
    if (addedIds.has(playlist.id)) return;

    try {
      await playlistService.addTrackToPlaylist(playlist.id, String(track.id), {
        title: track.title,
        artist: track.artist,
        image: track.image,
        audioUrl: track.audioUrl,
        duration: track.duration,
      });
      setAddedIds(prev => new Set([...prev, playlist.id]));
      addToast(`Added to "${playlist.name}"`, 'success');
      notificationService.addNotification(`Added "${track.title}" to "${playlist.name}"`, 'success');
    } catch (err) {
      if (err.code === '23505') {
        setAddedIds(prev => new Set([...prev, playlist.id]));
        addToast('Already in playlist', 'info');
      } else {
        addToast('Failed to add to playlist', 'error');
      }
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.stopPropagation();
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const newPlaylist = await playlistService.createPlaylist(newName.trim());
      await playlistService.addTrackToPlaylist(newPlaylist.id, String(track.id), {
        title: track.title,
        artist: track.artist,
        image: track.image,
        audioUrl: track.audioUrl,
        duration: track.duration,
      });
      setPlaylists(prev => [newPlaylist, ...prev]);
      setAddedIds(prev => new Set([...prev, newPlaylist.id]));
      setCreating(false);
      setNewName('');
      addToast(`Created playlist and added track!`, 'success');
      notificationService.addNotification(`Created playlist "${newPlaylist.name}" and added "${track.title}"`, 'success');
    } catch (err) {
      addToast('Error creating playlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper} ref={dropdownRef}>
      <button onClick={handleToggle} style={styles.trigger} title="Add to playlist">
        <ListPlus size={18} color={open ? 'var(--primary-color)' : 'var(--text-secondary)'} />
      </button>

      {open && (
        <div style={styles.dropdown} onClick={e => e.stopPropagation()}>
          <div style={styles.header}>
            <span style={styles.headerTitle}>Add to playlist</span>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}><X size={14} /></button>
          </div>

          {loading ? (
            <div style={styles.center}><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /></div>
          ) : (
            <div className="scrollbar-custom" style={styles.list}>
              {playlists.length === 0 && !creating && <p style={styles.empty}>No playlists yet</p>}
              {playlists.map(pl => {
                const added = addedIds.has(pl.id);
                return (
                  <button key={pl.id} style={{ ...styles.item, opacity: added ? 0.6 : 1 }} onClick={(e) => handleAdd(e, pl)}>
                    <span style={styles.itemName}>{pl.name}</span>
                    {added ? <Check size={16} color="var(--primary-color)" /> : <Plus size={16} color="var(--text-secondary)" />}
                  </button>
                );
              })}
            </div>
          )}

          <div style={styles.footer}>
            {creating ? (
              <div style={styles.createRow}>
                <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateAndAdd(e)} placeholder="Playlist name..." style={styles.createInput} onClick={e => e.stopPropagation()} />
                <button style={styles.createConfirm} onClick={handleCreateAndAdd}><Check size={16} /></button>
                <button style={styles.createCancel} onClick={() => setCreating(false)}><X size={16} /></button>
              </div>
            ) : (
              <button style={styles.newBtn} onClick={() => setCreating(true)}><Plus size={14} style={{ marginRight: '6px' }} /> New playlist</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { position: 'relative', display: 'inline-flex' },
  trigger: { padding: '4px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s', borderRadius: '4px' },
  dropdown: { position: 'absolute', bottom: '100%', right: 0, marginBottom: '8px', width: '220px', backgroundColor: '#141f1a', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', zIndex: 100, overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px 8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  headerTitle: { fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '0.3px' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px', display: 'flex' },
  list: { maxHeight: '160px', overflowY: 'auto', padding: '4px 0', display: 'flex', flexDirection: 'column' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' },
  empty: { color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '16px', margin: 0 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left' },
  itemName: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' },
  footer: { padding: '8px 12px 12px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  newBtn: { display: 'flex', alignItems: 'center', width: '100%', padding: '8px 8px', background: 'none', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--primary-color)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s' },
  createRow: { display: 'flex', gap: '6px', alignItems: 'center' },
  createInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', padding: '6px 10px', fontSize: '13px', outline: 'none' },
  createConfirm: { padding: '6px', backgroundColor: 'var(--primary-color)', border: 'none', borderRadius: '6px', color: '#000', cursor: 'pointer', display: 'flex' },
  createCancel: { padding: '6px', backgroundColor: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' },
};

export default AddToPlaylistButton;
