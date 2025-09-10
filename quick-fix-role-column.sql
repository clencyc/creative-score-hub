-- QUICK FIX: Add missing role column to user_profiles table
-- Run this SQL in your Supabase SQL Editor to fix the immediate error

-- 1. Add the role column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'role') THEN
        ALTER TABLE user_profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'reviewer'));
    END IF;
END $$;

-- 2. Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  nationality TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  linkedin_profile TEXT,
  website TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'reviewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policy for user_profiles
DROP POLICY IF EXISTS "Users can view and update their own profile" ON user_profiles;
CREATE POLICY "Users can view and update their own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- 5. Create policy for admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'reviewer')
    )
  );

-- 6. Set the admin user (update this with your actual admin email)
-- First, you need to sign up with admin@creative-score-hub.com, then uncomment and run this:
-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'admin@creative-score-hub.com'
-- );

-- 7. Refresh the schema cache
NOTIFY pgrst, 'reload schema';
