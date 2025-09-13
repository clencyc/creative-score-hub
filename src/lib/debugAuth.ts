import { supabase } from './supabase';

/**
 * Debug function to check user status in Supabase
 */
export const debugUserStatus = async (email: string) => {
  try {
    console.log('🔍 Debugging user status for:', email);
    
    // Try to get user from auth.users (this requires service role key)
    // Since we don't have that, let's try a different approach
    
    // Check if we can sign in to see what error we get
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'dummy-password-for-testing'
    });

    if (error) {
      console.log('❌ Sign-in test error:', {
        message: error.message,
        status: error.status,
        name: error.name
      });

      // Analyze the error message
      if (error.message.includes('Invalid login credentials')) {
        console.log('💡 Diagnosis: User exists but wrong password OR user doesn\'t exist');
      } else if (error.message.includes('Email not confirmed')) {
        console.log('💡 Diagnosis: User exists but email not confirmed');
      } else if (error.message.includes('Too many requests')) {
        console.log('💡 Diagnosis: Rate limited - try again later');
      } else {
        console.log('💡 Diagnosis: Unknown error - check Supabase settings');
      }
    } else {
      console.log('✅ User exists and is confirmed (dummy password worked somehow)');
      // Sign out immediately
      await supabase.auth.signOut();
    }

    return { error };
  } catch (err) {
    console.error('Debug function error:', err);
    return { error: err };
  }
};

/**
 * Function to test admin login specifically
 */
export const testAdminLogin = async () => {
  try {
    console.log('🔍 Testing admin login...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@creative-score-hub.com',
      password: 'adminuser'
    });

    if (error) {
      console.log('❌ Admin login error:', error.message);
      return { success: false, error };
    } else {
      console.log('✅ Admin login successful!');
      await supabase.auth.signOut(); // Sign out immediately
      return { success: true, data };
    }
  } catch (err) {
    console.error('Admin test error:', err);
    return { success: false, error: err };
  }
};
