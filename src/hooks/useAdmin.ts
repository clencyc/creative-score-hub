import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database';
import { ADMIN_CREDENTIALS } from '@/lib/adminUtils';

// Use the same admin email from adminUtils
const ADMIN_EMAIL = ADMIN_CREDENTIALS.email;

export const useAdmin = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;

    try {
      // Temporarily bypass database for admin check during policy fix
      if (user.email === ADMIN_EMAIL) {
        setUserProfile({
          id: user.id,
          role: 'admin',
          full_name: 'System Administrator',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          phone: null,
          date_of_birth: null,
          gender: null,
          nationality: null,
          address: null,
          city: null,
          postal_code: null,
          linkedin_profile: null,
          website: null
        });
        setLoading(false);
        return;
      }

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
            .insert({ 
              id: user.id, 
              role: 'user',
              full_name: null
            })
            .select()
            .single();

          if (createError) throw createError;
          setUserProfile(newProfile);
        } else {
          // For now, create a basic user profile to avoid errors
          setUserProfile({
            id: user.id,
            role: 'user',
            full_name: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            phone: null,
            date_of_birth: null,
            gender: null,
            nationality: null,
            address: null,
            city: null,
            postal_code: null,
            linkedin_profile: null,
            website: null
          });
        }
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to basic profile
      setUserProfile({
        id: user.id,
        role: user.email === ADMIN_EMAIL ? 'admin' : 'user',
        full_name: user.email === ADMIN_EMAIL ? 'System Administrator' : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone: null,
        date_of_birth: null,
        gender: null,
        nationality: null,
        address: null,
        city: null,
        postal_code: null,
        linkedin_profile: null,
        website: null
      });
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

  // Check if user is admin based on email OR database role
  const isAdmin = user?.email === ADMIN_EMAIL || userProfile?.role === 'admin';
  const isReviewer = userProfile?.role === 'reviewer';
  const hasAdminAccess = isAdmin || isReviewer;

  return {
    userProfile,
    isAdmin,
    isReviewer,
    hasAdminAccess,
    loading,
    adminEmail: ADMIN_EMAIL
  };
};
