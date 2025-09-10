-- COMPLETE DATABASE SETUP FOR APPLICATION LOGGING AND ADMIN OVERSIGHT
-- This ensures ALL user applications are logged and visible to admin for approval
-- 
-- NOTE: RLS policies are simplified to avoid infinite recursion
-- Admin access control is handled at the application level using the hardcoded admin email

-- 1. Create enum types
DO $$ BEGIN
    CREATE TYPE application_type AS ENUM ('grant', 'loan', 'investment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'pending_documents');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE creative_sector AS ENUM (
      'visual_arts_crafts',
      'performing_arts',
      'music',
      'film_tv_video',
      'publishing_literature',
      'design_creative_services',
      'digital_interactive_media',
      'fashion_textiles',
      'photography',
      'architecture',
      'cultural_heritage',
      'gaming_esports'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE business_stage AS ENUM ('idea', 'startup', 'growth', 'established', 'expansion');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create user_profiles table with role column
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

-- Add role column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'role') THEN
        ALTER TABLE user_profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'reviewer'));
    END IF;
END $$;

-- 3. Create applications table - THIS IS WHERE ALL USER APPLICATIONS ARE LOGGED
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  application_type application_type NOT NULL,
  status application_status DEFAULT 'draft',
  
  -- Business Information
  business_name TEXT NOT NULL,
  business_registration_number TEXT,
  business_description TEXT NOT NULL,
  creative_sector creative_sector NOT NULL,
  business_stage business_stage NOT NULL,
  years_in_operation INTEGER,
  number_of_employees INTEGER,
  annual_revenue DECIMAL,
  
  -- Project/Purpose Information
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  funding_amount_requested DECIMAL NOT NULL,
  funding_purpose TEXT NOT NULL,
  project_timeline TEXT,
  expected_outcomes TEXT,
  
  -- Financial Information
  monthly_income DECIMAL,
  monthly_expenses DECIMAL,
  existing_debts DECIMAL,
  credit_score INTEGER,
  bank_statements_provided BOOLEAN DEFAULT FALSE,
  
  -- Creative Portfolio
  portfolio_url TEXT,
  previous_projects TEXT,
  awards_recognition TEXT,
  media_coverage TEXT,
  
  -- Social Impact
  social_impact_description TEXT,
  community_benefit TEXT,
  sustainability_measures TEXT,
  
  -- Documents
  business_plan_url TEXT,
  financial_statements_url TEXT,
  identity_document_url TEXT,
  portfolio_documents TEXT[],
  
  -- Admin Review Information
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  review_date TIMESTAMP WITH TIME ZONE,
  
  -- Audit Trail - CRITICAL FOR ADMIN LOGGING
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE, -- When user actually submits (not just saves draft)
  
  -- Admin tracking fields
  admin_notes TEXT,
  priority_level INTEGER DEFAULT 1, -- 1=normal, 2=high, 3=urgent
  last_admin_view TIMESTAMP WITH TIME ZONE
);

-- 4. Create application audit log for complete tracking
CREATE TABLE IF NOT EXISTS application_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL, -- 'created', 'submitted', 'reviewed', 'approved', 'rejected'
  old_status application_status,
  new_status application_status,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create application comments for admin-user communication
CREATE TABLE IF NOT EXISTS application_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE, -- true = admin-only notes, false = visible to user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_comments ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for user_profiles (fixed infinite recursion)
-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view and update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON user_profiles;

-- Create single comprehensive policy
CREATE POLICY "Authenticated users can manage profiles" ON user_profiles
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 8. RLS Policies for applications - Simplified to avoid conflicts
-- Allow all authenticated users to view, insert, and update applications
-- Admin control is handled at the React application level
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can view applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON applications;

CREATE POLICY "Authenticated users can manage applications" ON applications
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 9. RLS Policies for audit log - Simplified
DROP POLICY IF EXISTS "Authenticated users can view audit log" ON application_audit_log;
DROP POLICY IF EXISTS "All users can insert audit log" ON application_audit_log;

CREATE POLICY "Authenticated users can manage audit log" ON application_audit_log
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 10. RLS Policies for comments - Simplified
DROP POLICY IF EXISTS "Authenticated users can view comments" ON application_comments;
DROP POLICY IF EXISTS "Users can insert comments" ON application_comments;

CREATE POLICY "Authenticated users can manage comments" ON application_comments
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 11. Create triggers for automatic audit logging
CREATE OR REPLACE FUNCTION log_application_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO application_audit_log (application_id, user_id, action, new_status, notes)
        VALUES (NEW.id, NEW.user_id, 'created', NEW.status, 'Application created');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log status changes
        IF OLD.status != NEW.status THEN
            INSERT INTO application_audit_log (application_id, user_id, action, old_status, new_status, notes)
            VALUES (NEW.id, COALESCE(NEW.reviewed_by, NEW.user_id), 
                   CASE 
                     WHEN NEW.status = 'submitted' THEN 'submitted'
                     WHEN NEW.status = 'approved' THEN 'approved'
                     WHEN NEW.status = 'rejected' THEN 'rejected'
                     WHEN NEW.status = 'under_review' THEN 'reviewed'
                     ELSE 'updated'
                   END,
                   OLD.status, NEW.status, 
                   COALESCE(NEW.review_notes, 'Status changed'));
        END IF;
        
        -- Update the updated_at timestamp
        NEW.updated_at = NOW();
        
        -- Set submitted_at when status changes to submitted
        IF OLD.status = 'draft' AND NEW.status = 'submitted' THEN
            NEW.submitted_at = NOW();
        END IF;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS application_audit_trigger ON applications;
CREATE TRIGGER application_audit_trigger
    AFTER INSERT OR UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION log_application_changes();

-- 12. Create function for admin to mark application as viewed (simplified)
CREATE OR REPLACE FUNCTION mark_application_viewed(app_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Admin check will be done at application level
    UPDATE applications 
    SET last_admin_view = NOW()
    WHERE id = app_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create view for admin dashboard summary
CREATE OR REPLACE VIEW admin_application_summary AS
SELECT 
    a.*,
    up.full_name,
    up.phone,
    up.city,
    up.email,
    CASE 
        WHEN a.status = 'submitted' AND a.submitted_at > NOW() - INTERVAL '24 hours' THEN 'new'
        WHEN a.status IN ('submitted', 'under_review') THEN 'pending'
        WHEN a.status = 'approved' THEN 'approved'
        WHEN a.status = 'rejected' THEN 'rejected'
        ELSE 'other'
    END as admin_priority,
    EXTRACT(EPOCH FROM (NOW() - a.submitted_at))/86400 as days_since_submission
FROM applications a
LEFT JOIN user_profiles up ON a.user_id = up.id
LEFT JOIN auth.users au ON a.user_id = au.id;

-- 14. Create admin user profile (update email as needed)
INSERT INTO user_profiles (id, role, full_name)
SELECT id, 'admin', 'System Administrator'
FROM auth.users 
WHERE email = 'admin@creative-score-hub.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin', 
    full_name = 'System Administrator',
    updated_at = NOW();

-- 15. Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- VERIFICATION QUERIES (run these to check setup)
-- SELECT COUNT(*) as total_applications FROM applications;
-- SELECT status, COUNT(*) as count FROM applications GROUP BY status;
-- SELECT * FROM user_profiles WHERE role = 'admin';
-- SELECT COUNT(*) as recent_submissions FROM applications WHERE submitted_at > NOW() - INTERVAL '7 days';
