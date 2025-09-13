import { supabase } from './supabase';

// Hardcoded admin credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@creative-score-hub.com',
  password: 'adminuser'
};

/**
 * Ensures the admin user exists in Supabase Auth
 * If the user doesn't exist, it creates them and auto-confirms them
 */
export const ensureAdminUserExists = async () => {
  try {
    // First, try to sign in to check if user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password
    });

    // If sign in succeeds, user exists - sign out and return
    if (signInData.user && !signInError) {
      await supabase.auth.signOut();
      console.log('Admin user already exists and is confirmed');
      return { success: true, created: false };
    }

    // Handle different error cases
    if (signInError) {
      console.log('Sign in error:', signInError.message);
      
      // If invalid credentials, try to create user
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('Creating admin user...');
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password,
        });

        if (signUpError) {
          console.error('Error creating admin user:', signUpError);
          return { success: false, error: signUpError };
        }

        // Auto-confirm the admin user since it's a fake email
        if (signUpData.user && !signUpData.session) {
          console.log('Auto-confirming admin user...');
          
          // Try to confirm the user using admin API
          try {
            // Since we can't use admin API without service role, 
            // let's try to sign them up with a different approach
            const { error: confirmError } = await supabase.auth.updateUser({
              email: ADMIN_CREDENTIALS.email
            });
            
            if (confirmError) {
              console.log('Direct confirmation failed, user needs manual confirmation');
              return { 
                success: true, 
                created: true, 
                needsManualConfirmation: true,
                message: 'Admin user created but requires manual confirmation in database'
              };
            }
          } catch (err) {
            console.log('Auto-confirmation not available, needs manual database update');
            return { 
              success: true, 
              created: true, 
              needsManualConfirmation: true,
              message: 'Admin user created but requires manual confirmation in database'
            };
          }
        }

        // Sign out after creation
        await supabase.auth.signOut();
        console.log('Admin user created successfully');
        return { success: true, created: true };
      }

      // If email not confirmed, user exists but needs confirmation
      if (signInError.message.includes('Email not confirmed')) {
        console.log('Admin user exists but email not confirmed');
        return { 
          success: true, 
          created: false, 
          needsManualConfirmation: true,
          message: 'Admin user exists but requires manual confirmation in database'
        };
      }
    }

    return { success: false, error: signInError };
  } catch (error) {
    console.error('Error in ensureAdminUserExists:', error);
    return { success: false, error };
  }
};

/**
 * Special admin sign-in that ensures the user exists first
 */
export const signInAsAdmin = async () => {
  try {
    console.log('Attempting admin sign-in...');
    
    // Try to sign in directly first (skip existence check if user is confirmed)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password
    });

    // If sign in succeeds, return success
    if (data.user && !error) {
      console.log('Admin sign-in successful');
      return { data, error: null };
    }

    // If sign in fails, check the error type
    if (error) {
      console.log('Direct sign-in failed:', error.message);
      
      // If invalid credentials, user might not exist - try to ensure user exists
      if (error.message.includes('Invalid login credentials')) {
        console.log('Attempting to ensure admin user exists...');
        const ensureResult = await ensureAdminUserExists();
        
        if (!ensureResult.success) {
          return { error: ensureResult.error };
        }

        // If user needs manual confirmation, return instruction
        if (ensureResult.needsManualConfirmation) {
          return { 
            error: { 
              message: `${ensureResult.message}\n\nRun this SQL in Supabase:\nUPDATE auth.users SET email_confirmed_at = NOW() WHERE email = '${ADMIN_CREDENTIALS.email}';` 
            } 
          };
        }

        // Try signing in again after ensuring user exists
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password
        });

        return { data: retryData, error: retryError };
      }

      // For other errors (like email not confirmed), return the error directly
      return { data: null, error };
    }

    return { data, error };
  } catch (error) {
    console.error('Error in signInAsAdmin:', error);
    return { error };
  }
};
