import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database';

export const useAdmin = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({ id: user.id, role: 'user' })
            .select()
            .single();

          if (createError) throw createError;
          setUserProfile(newProfile);
        } else {
          throw error;
        }
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  }, [user, fetchUserProfile]);

  const isAdmin = userProfile?.role === 'admin';
  const isReviewer = userProfile?.role === 'reviewer';
  const hasAdminAccess = isAdmin || isReviewer;

  return {
    userProfile,
    isAdmin,
    isReviewer,
    hasAdminAccess,
    loading
  };
};
