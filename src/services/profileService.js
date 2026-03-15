import { supabase } from './supabaseClient';

export const profileService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  async ensureProfile(userId) {
    const { data, error } = await this.getProfile(userId);
    if (!data && !error) {
      // Create if missing
      return await supabase
        .from('profiles')
        .insert({ id: userId, avatar: 'icon:User:#4df478' })
        .select()
        .single();
    }
    return { data, error };
  }
};
