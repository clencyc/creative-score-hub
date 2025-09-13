import { supabase } from './supabase';
import { ADMIN_CREDENTIALS } from './adminUtils';

/**
 * One-click admin setup function
 * This will create and confirm the admin user
 */
export const setupAdminUser = async () => {
  try {
    console.log('🚀 Setting up admin user...');

    // Step 1: Try to create the admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password,
    });

    if (signUpError && !signUpError.message.includes('User already registered')) {
      console.error('❌ Error creating admin user:', signUpError);
      return { 
        success: false, 
        error: signUpError,
        step: 'signup'
      };
    }

    console.log('✅ Admin user created or already exists');

    // Step 2: Provide the SQL command to confirm the user
    const sqlCommand = `UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = '${ADMIN_CREDENTIALS.email}';`;
    
    console.log('📋 Copy and run this SQL command in Supabase SQL Editor:');
    console.log(sqlCommand);

    // Step 3: Return success with the SQL command (don't test login yet)
    return {
      success: true,
      needsConfirmation: true,
      sqlCommand,
      message: 'Admin user created! Please run the SQL command to confirm email, then try logging in.',
      step: 'created'
    };

  } catch (error) {
    console.error('❌ Setup failed:', error);
    return {
      success: false,
      error,
      step: 'unknown'
    };
  }
};
