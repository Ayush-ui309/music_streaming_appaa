import { supabase } from './supabaseClient';

// ─── PLAYLIST CRUD ────────────────────────────────────────────────

export const playlistService = {

  /**
   * Create a new playlist for the logged-in user.
   * @param {string} name        - Playlist name
   * @param {string} description - Optional description
   */
  async createPlaylist(name, description = '') {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('playlists')
      .insert([{ user_id: user.id, name, description }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch all playlists for the logged-in user, newest first.
   */
  async getUserPlaylists() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch a single playlist by ID, including all its tracks.
   * @param {string} id - Playlist UUID
   */
  async getPlaylist(id) {
    const { data, error } = await supabase
      .from('playlists')
      .select('*, playlist_tracks(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a playlist. Tracks are CASCADE-deleted automatically.
   * @param {string} playlistId - Playlist UUID
   */
  async deletePlaylist(playlistId) {
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', playlistId);

    if (error) throw error;
    return true;
  },

  // ─── PLAYLIST TRACKS ──────────────────────────────────────────

  /**
   * Add a Jamendo track to a playlist.
   * Stores full metadata as JSON to avoid extra API calls when rendering.
   * @param {string} playlistId - Playlist UUID
   * @param {string} trackId    - Jamendo track ID (string)
   * @param {object} metadata   - { title, artist, image, audioUrl, duration }
   */
  async addTrackToPlaylist(playlistId, trackId, metadata) {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .insert([{ playlist_id: playlistId, track_id: trackId, metadata }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Remove a track from a playlist.
   */
  async removeTrackFromPlaylist(playlistId, trackId) {
    const { error } = await supabase
      .from('playlist_tracks')
      .delete()
      .match({ playlist_id: playlistId, track_id: trackId });

    if (error) throw error;
    return true;
  },

  /**
   * Check if a track is already in a playlist (to prevent duplicates).
   */
  async isTrackInPlaylist(playlistId, trackId) {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select('id')
      .match({ playlist_id: playlistId, track_id: trackId })
      .maybeSingle();

    if (error) return false;
    return !!data;
  }
};
