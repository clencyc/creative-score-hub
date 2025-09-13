import React, { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthContext, AuthContextType } from './auth-context'
import { ensureAdminUserExists, signInAsAdmin, ADMIN_CREDENTIALS } from '@/lib/adminUtils'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Ensure admin user exists
    ensureAdminUserExists().catch(console.error);

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    // Check if this is an admin login attempt
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      console.log('🔐 Admin login attempt detected');
      console.log('🔍 Credentials check:', {
        inputEmail: email,
        expectedEmail: ADMIN_CREDENTIALS.email,
        inputPassword: password,
        expectedPassword: ADMIN_CREDENTIALS.password,
        emailMatch: email === ADMIN_CREDENTIALS.email,
        passwordMatch: password === ADMIN_CREDENTIALS.password
      });
      
      // Simple direct sign-in for admin (bypass complex logic)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password
      });

      if (error) {
        console.error('❌ Admin login error details:', {
          message: error.message,
          status: error.status,
          code: error.status
        });
        
        // Provide specific guidance based on error
        if (error.message.includes('Email not confirmed')) {
          console.log('❌ Admin email not confirmed - providing SQL solution');
          // Return the original error but log the solution
          console.log(`📋 SQL Solution:\nUPDATE auth.users SET email_confirmed_at = NOW() WHERE email = '${ADMIN_CREDENTIALS.email}';`);
          return { error };
        }
        
        if (error.message.includes('Invalid login credentials')) {
          console.log('❌ Invalid credentials - might be password encryption issue');
          console.log(`📋 SQL Solution:\nUPDATE auth.users SET encrypted_password = crypt('${ADMIN_CREDENTIALS.password}', gen_salt('bf')) WHERE email = '${ADMIN_CREDENTIALS.email}';`);
          return { error };
        }
      } else {
        console.log('✅ Admin login successful!', {
          userId: data.user?.id,
          email: data.user?.email
        });
      }

      return { error };
    }

    // Regular user sign in
    console.log('Regular login attempt for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
    } else {
      console.log('Login successful for:', email);
    }

    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
