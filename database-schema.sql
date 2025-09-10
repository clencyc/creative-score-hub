-- Creative Industry Application Tables
-- Run this SQL in your Supabase SQL Editor

-- Create enum for application types
CREATE TYPE application_type AS ENUM ('grant', 'loan', 'investment');

-- Create enum for application status
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'pending_documents');

-- Create enum for creative sectors
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

-- Create enum for business stage
CREATE TYPE business_stage AS ENUM ('idea', 'startup', 'growth', 'established', 'expansion');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
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
  portfolio_documents TEXT[], -- Array of document URLs
  
  -- Review Information
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  review_date TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Application comments/feedback table
CREATE TABLE application_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE, -- For admin-only comments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table for the chatbot
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  response TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (you'll need to create an admin role)
-- For now, allowing all authenticated users to view all applications for demo purposes
CREATE POLICY "Authenticated users can view all applications for admin" ON applications
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for application_comments
CREATE POLICY "Users can view comments on their applications" ON application_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_comments.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add comments to their applications" ON application_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_comments.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- RLS Policies for chat_messages
CREATE POLICY "Users can view own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_type ON applications(application_type);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_application_comments_application_id ON application_comments(application_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at 
  BEFORE UPDATE ON applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
