import { supabase } from './supabaseClient';

export const watchlistService = {
  async addToWatchlist(trackId, metadata) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('watchlist')
      .insert([{ user_id: user.id, track_id: trackId, metadata }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromWatchlist(trackId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .match({ user_id: user.id, track_id: trackId });

    if (error) throw error;
    return true;
  },

  async getWatchlist() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async checkInWatchlist(trackId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .match({ user_id: user.id, track_id: trackId })
      .maybeSingle();

    if (error) return false;
    return !!data;
  }
};
