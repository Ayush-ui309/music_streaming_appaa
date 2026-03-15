import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileLoading, setProfileLoading] = useState(false);

  const refreshProfile = async (userId) => {
    if (!userId || profileLoading) return;
    console.log("[AuthContext] Refreshing profile for:", userId);
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        console.log("[AuthContext] Profile fetched:", data);
        setProfile(data);
      } else if (error && (error.code === 'PGRST116' || error.details?.includes('0 rows'))) {
        console.log("[AuthContext] Profile missing from DB, creating default...");
        const { data: newData, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, avatar: 'icon:User:#4df478' })
          .select()
          .single();
        
        if (insertError) {
          console.error("[AuthContext] Error creating default profile:", insertError);
        } else if (newData) {
          setProfile(newData);
        }
      } else if (error) {
        console.error("[AuthContext] Supabase error fetching profile:", error);
      }
    } catch (err) {
      console.error("[AuthContext] Unexpected error refreshing profile:", err);
    } finally {
      setProfileLoading(false);
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
    if (user && !profile && !loading && !profileLoading) {
      console.log("[AuthContext] User exists but no profile. Auto-fetching...");
      refreshProfile(user.id);
    }
  }, [user, profile, loading, profileLoading]);

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
