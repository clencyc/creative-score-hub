import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { 
  ApplicationType, 
  CreativeSector, 
  BusinessStage, 
  ApplicationFormData,
  getCreativeSectorLabel,
  getBusinessStageLabel 
} from "@/types/database";
import { ArrowLeft, ArrowRight, Save, Send, FileText, Lightbulb, DollarSign, Users } from "lucide-react";
import toast from "react-hot-toast";

const ApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    application_type: 'grant',
    business_name: '',
    business_description: '',
    creative_sector: 'visual_arts_crafts',
    business_stage: 'idea',
    project_title: '',
    project_description: '',
    funding_amount_requested: 0,
    funding_purpose: ''
  });

  const steps = [
    { id: 'type', title: 'Application Type', icon: FileText },
    { id: 'business', title: 'Business Info', icon: Users },
    { id: 'project', title: 'Project Details', icon: Lightbulb },
    { id: 'financial', title: 'Financial Info', icon: DollarSign }
  ];

  const creativeSectors: CreativeSector[] = [
    'visual_arts_crafts', 'performing_arts', 'music', 'film_tv_video',
    'publishing_literature', 'design_creative_services', 'digital_interactive_media',
    'fashion_textiles', 'photography', 'architecture', 'cultural_heritage', 'gaming_esports'
  ];

  const businessStages: BusinessStage[] = ['idea', 'startup', 'growth', 'established', 'expansion'];

  const updateFormData = (field: keyof ApplicationFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!formData.application_type;
      case 1:
        return !!(formData.business_name && formData.business_description && formData.creative_sector && formData.business_stage);
      case 2:
        return !!(formData.project_title && formData.project_description && formData.funding_purpose);
      case 3:
        return formData.funding_amount_requested > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const saveDraft = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          ...formData,
          user_id: user.id,
          status: 'draft'
        });

      if (error) throw error;
      
      toast.success('Draft saved successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async () => {
    if (!user) return;
    
    // Validate all steps
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        toast.error(`Please complete step ${i + 1}: ${steps[i].title}`);
        setCurrentStep(i);
        return;
      }
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          ...formData,
          user_id: user.id,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Application submitted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const getApplicationTypeDescription = (type: ApplicationType) => {
    switch (type) {
      case 'grant':
        return 'Non-repayable funding for creative projects with social or cultural impact';
      case 'loan':
        return 'Repayable funding with competitive interest rates for business growth';
      case 'investment':
        return 'Equity-based funding from investors looking for creative ventures';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">New Application</h1>
                <p className="text-muted-foreground">Apply for creative industry funding</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Step {currentStep + 1} of {steps.length}</h2>
              <Badge variant="outline">{Math.round(calculateProgress())}% Complete</Badge>
            </div>
            <Progress value={calculateProgress()} className="mb-4" />
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                      ${index <= currentStep 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'border-muted-foreground text-muted-foreground'
                      }
                    `}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className={`ml-2 text-sm ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              {/* Step 0: Application Type */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Choose Your Application Type</h3>
                    <p className="text-muted-foreground mb-6">
                      Select the type of funding that best suits your creative project
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['grant', 'loan', 'investment'] as ApplicationType[]).map((type) => (
                      <Card 
                        key={type}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.application_type === type ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => updateFormData('application_type', type)}
                      >
                        <CardHeader>
                          <CardTitle className="capitalize">{type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {getApplicationTypeDescription(type)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Business Information</h3>
                    <p className="text-muted-foreground mb-6">
                      Tell us about your creative business or project
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Business/Project Name *</Label>
                      <Input
                        id="business_name"
                        value={formData.business_name}
                        onChange={(e) => updateFormData('business_name', e.target.value)}
                        placeholder="e.g., Afro Fusion Design Studio"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_registration">Business Registration Number</Label>
                      <Input
                        id="business_registration"
                        value={formData.business_registration_number || ''}
                        onChange={(e) => updateFormData('business_registration_number', e.target.value)}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="creative_sector">Creative Sector *</Label>
                      <Select value={formData.creative_sector} onValueChange={(value) => updateFormData('creative_sector', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {creativeSectors.map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {getCreativeSectorLabel(sector)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_stage">Business Stage *</Label>
                      <Select value={formData.business_stage} onValueChange={(value) => updateFormData('business_stage', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {businessStages.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {getBusinessStageLabel(stage)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="years_in_operation">Years in Operation</Label>
                      <Input
                        id="years_in_operation"
                        type="number"
                        min="0"
                        value={formData.years_in_operation || ''}
                        onChange={(e) => updateFormData('years_in_operation', parseInt(e.target.value) || undefined)}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number_of_employees">Number of Employees</Label>
                      <Input
                        id="number_of_employees"
                        type="number"
                        min="0"
                        value={formData.number_of_employees || ''}
                        onChange={(e) => updateFormData('number_of_employees', parseInt(e.target.value) || undefined)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_description">Business Description *</Label>
                    <Textarea
                      id="business_description"
                      value={formData.business_description}
                      onChange={(e) => updateFormData('business_description', e.target.value)}
                      placeholder="Describe your business, what you do, your target audience, and your unique value proposition..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Project Details</h3>
                    <p className="text-muted-foreground mb-6">
                      Provide details about the specific project you're seeking funding for
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="project_title">Project Title *</Label>
                      <Input
                        id="project_title"
                        value={formData.project_title}
                        onChange={(e) => updateFormData('project_title', e.target.value)}
                        placeholder="e.g., Digital Art Exhibition Platform"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project_description">Project Description *</Label>
                      <Textarea
                        id="project_description"
                        value={formData.project_description}
                        onChange={(e) => updateFormData('project_description', e.target.value)}
                        placeholder="Provide a detailed description of your project, including objectives, methodology, timeline, and expected impact..."
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="funding_purpose">Funding Purpose *</Label>
                      <Textarea
                        id="funding_purpose"
                        value={formData.funding_purpose}
                        onChange={(e) => updateFormData('funding_purpose', e.target.value)}
                        placeholder="Explain specifically how you will use the funding (equipment, materials, marketing, staff, etc.)..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="project_timeline">Project Timeline</Label>
                        <Textarea
                          id="project_timeline"
                          value={formData.project_timeline || ''}
                          onChange={(e) => updateFormData('project_timeline', e.target.value)}
                          placeholder="Outline key milestones and timeline for your project..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expected_outcomes">Expected Outcomes</Label>
                        <Textarea
                          id="expected_outcomes"
                          value={formData.expected_outcomes || ''}
                          onChange={(e) => updateFormData('expected_outcomes', e.target.value)}
                          placeholder="What results do you expect from this project?..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="social_impact">Social Impact</Label>
                        <Textarea
                          id="social_impact"
                          value={formData.social_impact_description || ''}
                          onChange={(e) => updateFormData('social_impact_description', e.target.value)}
                          placeholder="How will your project benefit society or your community?..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sustainability">Sustainability Measures</Label>
                        <Textarea
                          id="sustainability"
                          value={formData.sustainability_measures || ''}
                          onChange={(e) => updateFormData('sustainability_measures', e.target.value)}
                          placeholder="How will you ensure the long-term sustainability of your project?..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Financial Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Financial Information</h3>
                    <p className="text-muted-foreground mb-6">
                      Provide financial details for your application
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="funding_amount">Funding Amount Requested (KES) *</Label>
                      <Input
                        id="funding_amount"
                        type="number"
                        min="0"
                        value={formData.funding_amount_requested}
                        onChange={(e) => updateFormData('funding_amount_requested', parseFloat(e.target.value) || 0)}
                        placeholder="250000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annual_revenue">Annual Revenue (KES)</Label>
                      <Input
                        id="annual_revenue"
                        type="number"
                        min="0"
                        value={formData.annual_revenue || ''}
                        onChange={(e) => updateFormData('annual_revenue', parseFloat(e.target.value) || undefined)}
                        placeholder="1000000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthly_income">Monthly Income (KES)</Label>
                      <Input
                        id="monthly_income"
                        type="number"
                        min="0"
                        value={formData.monthly_income || ''}
                        onChange={(e) => updateFormData('monthly_income', parseFloat(e.target.value) || undefined)}
                        placeholder="50000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthly_expenses">Monthly Expenses (KES)</Label>
                      <Input
                        id="monthly_expenses"
                        type="number"
                        min="0"
                        value={formData.monthly_expenses || ''}
                        onChange={(e) => updateFormData('monthly_expenses', parseFloat(e.target.value) || undefined)}
                        placeholder="30000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="existing_debts">Existing Debts (KES)</Label>
                      <Input
                        id="existing_debts"
                        type="number"
                        min="0"
                        value={formData.existing_debts || ''}
                        onChange={(e) => updateFormData('existing_debts', parseFloat(e.target.value) || undefined)}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="credit_score">Credit Score (if known)</Label>
                      <Input
                        id="credit_score"
                        type="number"
                        min="300"
                        max="850"
                        value={formData.credit_score || ''}
                        onChange={(e) => updateFormData('credit_score', parseInt(e.target.value) || undefined)}
                        placeholder="700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="portfolio_url">Portfolio/Website URL</Label>
                      <Input
                        id="portfolio_url"
                        type="url"
                        value={formData.portfolio_url || ''}
                        onChange={(e) => updateFormData('portfolio_url', e.target.value)}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="awards">Awards & Recognition</Label>
                      <Input
                        id="awards"
                        value={formData.awards_recognition || ''}
                        onChange={(e) => updateFormData('awards_recognition', e.target.value)}
                        placeholder="List any awards or recognition received"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previous_projects">Previous Projects</Label>
                    <Textarea
                      id="previous_projects"
                      value={formData.previous_projects || ''}
                      onChange={(e) => updateFormData('previous_projects', e.target.value)}
                      placeholder="Describe your previous relevant projects and their outcomes..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={saveDraft}
                    disabled={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button
                      onClick={submitApplication}
                      disabled={loading}
                      className="bg-gradient-to-r from-heva-purple to-heva-blue"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!validateStep(currentStep)}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
