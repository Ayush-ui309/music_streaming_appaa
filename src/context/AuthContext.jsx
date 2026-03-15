import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (userId) => {
    if (!userId) return;
    console.log("[AuthContext] Refreshing profile for:", userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        console.log("[AuthContext] Profile fetched:", data);
        setProfile(data);
      } else if (error && error.code === 'PGRST116') {
        console.log("[AuthContext] Profile missing from DB, creating default...");
        const { data: newData } = await supabase
          .from('profiles')
          .insert({ id: userId, avatar: 'icon:User:#4df478' })
          .select()
          .single();
        if (newData) setProfile(newData);
      } else if (error) {
        console.error("[AuthContext] Supabase error fetching profile:", error);
      }
    } catch (err) {
      console.error("[AuthContext] Unexpected error refreshing profile:", err);
    }
  };

  const updateProfileState = (updates) => {
    setProfile(prev => prev ? { ...prev, ...updates } : updates);
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session }, error } = await authService.getCurrentSession();
      if (!error && session) {
        setUser(session.user);
        refreshProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (log in, log out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          refreshProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !profile && !loading) {
      console.log("[AuthContext] User exists but no profile. Auto-fetching...");
      refreshProfile(user.id);
    }
  }, [user, profile, loading]);

  const value = {
    user,
    profile,
    refreshProfile,
    updateProfileState,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
