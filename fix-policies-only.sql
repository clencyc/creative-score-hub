-- EMERGENCY FIX FOR INFINITE RECURSION - RUN THIS FIRST
-- This script only fixes the problematic RLS policies

-- Drop ALL existing policies that could cause recursion
DROP POLICY IF EXISTS "Users can view and update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can view applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
DROP POLICY IF EXISTS "Admins can update applications" ON applications;

-- Create simple, non-recursive policies
CREATE POLICY "Allow all authenticated users - profiles" ON user_profiles
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users - applications" ON applications
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Refresh the schema
NOTIFY pgrst, 'reload schema';
