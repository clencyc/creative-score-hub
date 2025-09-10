// Database types for our Creative Industry Application System

export type ApplicationType = 'grant' | 'loan' | 'investment';

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'pending_documents';

export type CreativeSector = 
  | 'visual_arts_crafts'
  | 'performing_arts'
  | 'music'
  | 'film_tv_video'
  | 'publishing_literature'
  | 'design_creative_services'
  | 'digital_interactive_media'
  | 'fashion_textiles'
  | 'photography'
  | 'architecture'
  | 'cultural_heritage'
  | 'gaming_esports';

export type BusinessStage = 'idea' | 'startup' | 'growth' | 'established' | 'expansion';

export interface UserProfile {
  id: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  linkedin_profile?: string;
  website?: string;
  role?: 'user' | 'admin' | 'reviewer';
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  application_type: ApplicationType;
  status: ApplicationStatus;
  
  // Business Information
  business_name: string;
  business_registration_number?: string;
  business_description: string;
  creative_sector: CreativeSector;
  business_stage: BusinessStage;
  years_in_operation?: number;
  number_of_employees?: number;
  annual_revenue?: number;
  
  // Project/Purpose Information
  project_title: string;
  project_description: string;
  funding_amount_requested: number;
  funding_purpose: string;
  project_timeline?: string;
  expected_outcomes?: string;
  
  // Financial Information
  monthly_income?: number;
  monthly_expenses?: number;
  existing_debts?: number;
  credit_score?: number;
  bank_statements_provided?: boolean;
  
  // Creative Portfolio
  portfolio_url?: string;
  previous_projects?: string;
  awards_recognition?: string;
  media_coverage?: string;
  
  // Social Impact
  social_impact_description?: string;
  community_benefit?: string;
  sustainability_measures?: string;
  
  // Documents
  business_plan_url?: string;
  financial_statements_url?: string;
  identity_document_url?: string;
  portfolio_documents?: string[];
  
  // Review Information
  reviewed_by?: string;
  review_notes?: string;
  review_date?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

export interface ApplicationComment {
  id: string;
  application_id: string;
  user_id: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id?: string;
  message: string;
  response?: string;
  session_id?: string;
  created_at: string;
}

// Form data types
export interface ApplicationFormData {
  application_type: ApplicationType;
  business_name: string;
  business_registration_number?: string;
  business_description: string;
  creative_sector: CreativeSector;
  business_stage: BusinessStage;
  years_in_operation?: number;
  number_of_employees?: number;
  annual_revenue?: number;
  project_title: string;
  project_description: string;
  funding_amount_requested: number;
  funding_purpose: string;
  project_timeline?: string;
  expected_outcomes?: string;
  monthly_income?: number;
  monthly_expenses?: number;
  existing_debts?: number;
  credit_score?: number;
  portfolio_url?: string;
  previous_projects?: string;
  awards_recognition?: string;
  media_coverage?: string;
  social_impact_description?: string;
  community_benefit?: string;
  sustainability_measures?: string;
}

// Helper functions for display
export const getApplicationTypeLabel = (type: ApplicationType): string => {
  switch (type) {
    case 'grant':
      return 'Grant';
    case 'loan':
      return 'Loan';
    case 'investment':
      return 'Investment';
    default:
      return type;
  }
};

export const getApplicationStatusLabel = (status: ApplicationStatus): string => {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'submitted':
      return 'Submitted';
    case 'under_review':
      return 'Under Review';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'pending_documents':
      return 'Pending Documents';
    default:
      return status;
  }
};

export const getCreativeSectorLabel = (sector: CreativeSector): string => {
  switch (sector) {
    case 'visual_arts_crafts':
      return 'Visual Arts & Crafts';
    case 'performing_arts':
      return 'Performing Arts';
    case 'music':
      return 'Music';
    case 'film_tv_video':
      return 'Film, TV & Video';
    case 'publishing_literature':
      return 'Publishing & Literature';
    case 'design_creative_services':
      return 'Design & Creative Services';
    case 'digital_interactive_media':
      return 'Digital & Interactive Media';
    case 'fashion_textiles':
      return 'Fashion & Textiles';
    case 'photography':
      return 'Photography';
    case 'architecture':
      return 'Architecture';
    case 'cultural_heritage':
      return 'Cultural Heritage';
    case 'gaming_esports':
      return 'Gaming & Esports';
    default:
      return sector;
  }
};

export const getBusinessStageLabel = (stage: BusinessStage): string => {
  switch (stage) {
    case 'idea':
      return 'Idea Stage';
    case 'startup':
      return 'Startup';
    case 'growth':
      return 'Growth';
    case 'established':
      return 'Established';
    case 'expansion':
      return 'Expansion';
    default:
      return stage;
  }
};
