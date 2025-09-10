-- Add role column to user_profiles table
ALTER TABLE user_profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'reviewer'));

-- Create an admin user (replace with your email)
-- You'll need to sign up first, then run this to make yourself admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'
);

-- Update RLS policies to respect roles
DROP POLICY IF EXISTS "Authenticated users can view all applications for admin" ON applications;

-- New policy: Only admins can view all applications
CREATE POLICY "Admins can view all applications" ON applications
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'reviewer')
    )
  );

-- Policy for admins to update applications
CREATE POLICY "Admins can update applications" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'reviewer')
    )
  );

-- Policy for admin comments
CREATE POLICY "Admins can add internal comments" ON application_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'reviewer')
    ) OR 
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_comments.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- Allow admins to view all comments
CREATE POLICY "Admins can view all comments" ON application_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'reviewer')
    ) OR
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_comments.application_id 
      AND applications.user_id = auth.uid()
    )
  );
