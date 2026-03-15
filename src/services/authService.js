import { supabase } from './supabaseClient';

export const authService = {
  async signUp(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        }
      }
    });
    return { data, error };
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },
  
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }
};
