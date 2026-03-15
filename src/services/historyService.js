import { supabase } from './supabaseClient';

export const historyService = {
  // Add a track to recently played in Supabase
  async addToHistory(trackId, metadata) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check if song was recently played (e.g. within last 5 mins) to avoid spamming? 
    // Or just insert every play. Modern apps usually insert every play.
    const { data, error } = await supabase
      .from('recently_played')
      .insert({
        user_id: user.id,
        track_id: String(trackId),
        metadata: metadata,
        played_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to history:', error);
      throw error;
    }
    return data;
  },

  // Get recently played tracks for the current user
  async getHistory(limit = 20) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('recently_played')
      .select('*')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching history:', error);
      return [];
    }

    // Return unique tracks by ID to avoid duplicates in the UI
    const uniqueTracks = [];
    const seenIds = new Set();
    
    for (const item of data) {
      if (!seenIds.has(item.track_id)) {
        uniqueTracks.push({
          ...item.metadata,
          id: item.track_id,
          played_at: item.played_at
        });
        seenIds.add(item.track_id);
      }
    }

    return uniqueTracks;
  }
};
