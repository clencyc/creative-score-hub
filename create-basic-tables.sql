-- CREATE BASIC TABLES FIRST - Run this before the full schema
-- This ensures the tables exist and have proper relationships

-- 1. Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  email TEXT, -- Add email column for easier querying
  city TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'reviewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create enum for application status
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'pending_documents');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create enum for application type
DO $$ BEGIN
    CREATE TYPE application_type AS ENUM ('grant', 'loan', 'investment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Create basic applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  application_type application_type NOT NULL DEFAULT 'grant',
  status application_status DEFAULT 'draft',
  
  -- Basic required fields
  business_name TEXT NOT NULL DEFAULT 'Sample Business',
  project_title TEXT NOT NULL DEFAULT 'Sample Project',
  project_description TEXT NOT NULL DEFAULT 'Sample project description',
  funding_amount_requested DECIMAL NOT NULL DEFAULT 10000,
  funding_purpose TEXT NOT NULL DEFAULT 'Business development',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- 5. Disable RLS temporarily to avoid policy issues
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- 6. Add email column to user_profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'email') THEN
        ALTER TABLE user_profiles ADD COLUMN email TEXT;
    END IF;
END $$;

-- 7. Create admin user profile
INSERT INTO user_profiles (id, role, full_name, email)
SELECT id, 'admin', 'System Administrator', email
FROM auth.users 
WHERE email = 'admin@creative-score-hub.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin', 
    full_name = 'System Administrator',
    email = EXCLUDED.email,
    updated_at = NOW();

-- 8. Create a few sample applications for testing
INSERT INTO applications (user_id, business_name, project_title, project_description, funding_amount_requested, funding_purpose, status) 
SELECT 
    au.id,
    'Creative Studio ' || (random()*100)::int,
    'Art Project ' || (random()*100)::int,
    'A creative project that will benefit the community and showcase artistic talent.',
    (random()*50000 + 10000)::int,
    'Equipment purchase and studio rental',
    CASE 
        WHEN random() < 0.3 THEN 'submitted'::application_status
        WHEN random() < 0.6 THEN 'under_review'::application_status
        ELSE 'approved'::application_status
    END
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM applications WHERE user_id = au.id
)
LIMIT 5;

-- 9. Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify tables exist
SELECT 'user_profiles' as table_name, count(*) as row_count FROM user_profiles
UNION ALL
SELECT 'applications' as table_name, count(*) as row_count FROM applications;
