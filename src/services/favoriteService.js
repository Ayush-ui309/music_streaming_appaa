import { supabase } from './supabaseClient';

// ─── FAVORITES SERVICE ────────────────────────────────────────────

export const favoriteService = {

  /**
   * Like a track — adds it to the user's favorites.
   * @param {string} trackId  - Jamendo track ID (string)
   * @param {object} metadata - { title, artist, image, audioUrl, duration }
   */
  async addFavorite(trackId, metadata) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: user.id, track_id: trackId, metadata }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Unlike a track — removes it from favorites.
   * @param {string} trackId - Jamendo track ID
   */
  async removeFavorite(trackId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: user.id, track_id: trackId });

    if (error) throw error;
    return true;
  },

  /**
   * Fetch all favorited tracks for the logged-in user, newest first.
   * Each row includes the full `metadata` JSON column.
   */
  async getFavorites() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('liked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Check if a specific track is already liked by the user.
   * @param {string} trackId
   * @returns {boolean}
   */
  async checkIsFavorite(trackId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .match({ user_id: user.id, track_id: trackId })
      .maybeSingle();

    if (error) return false;
    return !!data;
  }
};
