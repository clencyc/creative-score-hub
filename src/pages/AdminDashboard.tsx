import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Application, ApplicationStatus, UserProfile } from "@/types/database";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Download
} from "lucide-react";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [stats, setStats] = useState({
    totalApplications: 0,
    submittedApplications: 0,
    approvedFunding: 0,
    avgCreditScore: 0,
    pendingReviews: 0,
    rejectedApplications: 0
  });

  const { user } = useAuth();
  const { isAdmin, hasAdminAccess, adminEmail } = useAdmin();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      
      // First, test if we can connect to Supabase
      const { data: testConnection, error: connectionError } = await supabase
        .from('applications')
        .select('count', { count: 'exact', head: true });

      if (connectionError) {
        console.error('Database connection error:', connectionError);
        if (connectionError.message?.includes('relation "public.applications" does not exist')) {
          toast.error('Database tables not found. Please run the database migration first.');
          return;
        } else {
          toast.error(`Database error: ${connectionError.message}`);
          return;
        }
      }

      // Fetch ALL applications for admin review (simplified query for now)
      const { data, error } = await supabase
        .from('applications')
        .select(`*`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast.error(`Failed to load applications: ${error.message}`);
        return;
      }

      console.log(`Admin Dashboard: Loaded ${data?.length || 0} total applications`);
      setApplications(data || []);
      
      // Calculate comprehensive stats for admin oversight
      const total = data?.length || 0;
      const submitted = data?.filter(app => ['submitted', 'under_review', 'approved', 'rejected'].includes(app.status)) || [];
      const approved = data?.filter(app => app.status === 'approved') || [];
      const pending = data?.filter(app => ['submitted', 'under_review'].includes(app.status)) || [];
      const rejected = data?.filter(app => app.status === 'rejected') || [];
      
      const approvedAmount = approved.reduce((sum, app) => sum + (app.funding_amount_requested || 0), 0);
      const avgScore = submitted.length > 0 
        ? submitted.reduce((sum, app) => sum + (app.credit_score || 0), 0) / submitted.length 
        : 0;

      setStats({
        totalApplications: total,
        submittedApplications: submitted.length,
        approvedFunding: approvedAmount,
        avgCreditScore: Math.round(avgScore),
        pendingReviews: pending.length,
        rejectedApplications: rejected.length
      });

      // Log application activity for admin tracking
      if (data && data.length > 0) {
        const recentApplications = data.filter(app => {
          const created = new Date(app.created_at);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - created.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7; // Applications from last 7 days
        });
        
        console.log(`Admin Alert: ${recentApplications.length} new applications in the last 7 days`);
        
        if (recentApplications.length > 0) {
          toast.success(`${recentApplications.length} new applications need review`, {
            duration: 5000
          });
        }
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load applications. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasAdminAccess) {
      fetchApplications();
    }
  }, [hasAdminAccess, fetchApplications]);

  useEffect(() => {
    console.log('Dialog state changed:', showDetailsDialog);
  }, [showDetailsDialog]);

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "approved": return "bg-green-500 text-white";
      case "submitted": return "bg-blue-500 text-white";
      case "under_review": return "bg-yellow-500 text-white";
      case "rejected": return "bg-red-500 text-white";
      case "pending_documents": return "bg-orange-500 text-white";
      case "draft": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatSector = (sector: string) => {
    return sector.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleViewDetails = (application: Application) => {
    console.log('handleViewDetails called with application:', application.id);
    
    try {
      setSelectedApplication(application);
      setReviewNotes(application.review_notes || "");
      setShowDetailsDialog(true);
      console.log('Dialog state set to true');
    } catch (error) {
      console.error('Error in handleViewDetails:', error);
      toast.error('Failed to open application details');
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: newStatus,
          review_date: new Date().toISOString(),
          reviewed_by: user?.id,
          review_notes: reviewNotes
        })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update application status');
        return;
      }

      toast.success(`Application ${newStatus}`);
      setShowDetailsDialog(false);
      fetchApplications(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update application status');
    }
  };

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the admin dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Admin Dashboard 
                  {isAdmin && (
                    <Badge variant="default" className="ml-2 bg-purple-600">
                      System Administrator
                    </Badge>
                  )}
                </h1>
                <p className="text-muted-foreground">
                  Creative Industry Funding Management
                  {user?.email === adminEmail && (
                    <span className="text-xs text-purple-600 ml-2">
                      • Logged in as: {adminEmail}
                    </span>
                  )}
                </p>
              </div>
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={() => fetchApplications()}
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">All applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.submittedApplications}</div>
                <p className="text-xs text-muted-foreground">Ready for review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingReviews}</div>
                <p className="text-xs text-muted-foreground">Need admin action</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Funding</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.approvedFunding)}</div>
                <p className="text-xs text-muted-foreground">Total approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rejectedApplications}</div>
                <p className="text-xs text-muted-foreground">Applications denied</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">All Applications</TabsTrigger>
              <TabsTrigger value="sectors">Sectors</TabsTrigger>
              <TabsTrigger value="risk-analytics">Risk Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>Latest funding requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div className="flex-1">
                            <div className="font-medium">User {app.user_id?.slice(0, 8) || 'Unknown'}</div>
                            <div className="text-sm text-muted-foreground">{app.business_name}</div>
                            <div className="text-xs text-muted-foreground">{formatSector(app.creative_sector)}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">{formatCurrency(app.funding_amount_requested)}</div>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Types</CardTitle>
                    <CardDescription>Distribution by funding type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['grant', 'loan', 'investment'].map(type => {
                        const count = applications.filter(app => app.application_type === type).length;
                        const percentage = applications.length > 0 ? (count / applications.length) * 100 : 0;
                        return (
                          <div key={type} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{type}</span>
                              <span>{count} applications</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Applications - Admin Review Queue</CardTitle>
                  <CardDescription>
                    All applications submitted by users. Click the eye icon to review details and take action.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filter tabs for different statuses */}
                  <div className="mb-4">
                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline" className="bg-yellow-50">
                        {applications.filter(app => ['submitted', 'under_review'].includes(app.status)).length} Pending Review
                      </Badge>
                      <Badge variant="outline" className="bg-green-50">
                        {applications.filter(app => app.status === 'approved').length} Approved
                      </Badge>
                      <Badge variant="outline" className="bg-red-50">
                        {applications.filter(app => app.status === 'rejected').length} Rejected
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50">
                        {applications.filter(app => app.status === 'draft').length} Drafts
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium">User {app.user_id?.slice(0, 8) || 'Unknown'}</div>
                              <div className="text-sm text-muted-foreground">{app.business_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatSector(app.creative_sector)} • {app.application_type.toUpperCase()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Submitted: {new Date(app.created_at).toLocaleDateString()}
                                {app.submitted_at && app.submitted_at !== app.created_at && (
                                  <span> • Last submitted: {new Date(app.submitted_at).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold text-lg">{formatCurrency(app.funding_amount_requested)}</div>
                            <div className="text-xs text-muted-foreground">Requested</div>
                          </div>
                          
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.replace('_', ' ')}
                          </Badge>
                          
                          {/* Priority indicator for pending applications */}
                          {['submitted', 'under_review'].includes(app.status) && (
                            <div className="text-orange-500">
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleViewDetails(app);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {applications.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No applications found</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Applications will appear here once users start submitting them
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          All user applications are automatically logged here for admin review
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sectors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['visual_arts_crafts', 'performing_arts', 'music', 'film_tv_video', 'design_creative_services', 'digital_interactive_media'].map((sector) => {
                  const sectorApps = applications.filter(app => app.creative_sector === sector);
                  const avgFunding = sectorApps.length > 0 
                    ? sectorApps.reduce((sum, app) => sum + app.funding_amount_requested, 0) / sectorApps.length 
                    : 0;
                  
                  return (
                    <Card key={sector}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{formatSector(sector)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Applications</span>
                            <span className="font-medium">{sectorApps.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Avg Funding</span>
                            <span className="font-medium">{formatCurrency(avgFunding)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Approved</span>
                            <span className="font-medium text-green-600">
                              {sectorApps.filter(app => app.status === 'approved').length}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="risk-analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    AI Risk Assessment Model
                  </CardTitle>
                  <CardDescription>
                    Analyze applicant risk profiles using advanced AI modeling. This tool helps evaluate creditworthiness and application viability.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-blue-900">Risk Assessment Tool Active</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Live Model
                      </Badge>
                    </div>
                    
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <iframe
                        src="https://codequeens-ai-model-m4tpztmwu8trcegrmrtoka.streamlit.app/?embed=true"
                        width="100%"
                        height="800"
                        style={{
                          border: 'none',
                          borderRadius: '0.5rem'
                        }}
                        title="AI Risk Assessment Model"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-red-700">High Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            {applications.filter(app => 
                              // Simulated risk scoring - in real app this would come from the AI model
                              app.funding_amount_requested > 100000 || app.status === 'rejected'
                            ).length}
                          </div>
                          <p className="text-xs text-red-600">Applications flagged</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-yellow-700">Medium Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-600">
                            {applications.filter(app => 
                              app.funding_amount_requested >= 50000 && app.funding_amount_requested <= 100000
                            ).length}
                          </div>
                          <p className="text-xs text-yellow-600">Under review</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-green-700">Low Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {applications.filter(app => 
                              app.funding_amount_requested < 50000 && app.status === 'approved'
                            ).length}
                          </div>
                          <p className="text-xs text-green-600">Safe to approve</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">How to Use the Risk Assessment Tool:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Input applicant financial data and business information</li>
                        <li>• Review the AI-generated risk score and recommendations</li>
                        <li>• Use insights to inform your approval decisions</li>
                        <li>• Monitor patterns across different sectors and risk profiles</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>
                  Review and manage application from User {selectedApplication.user_id?.slice(0, 8) || 'Unknown'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Applicant</Label>
                    <p className="text-sm font-medium">User {selectedApplication.user_id?.slice(0, 8) || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">Contact info not available</p>
                  </div>
                  <div>
                    <Label>Application Type</Label>
                    <p className="text-sm font-medium capitalize">{selectedApplication.application_type}</p>
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <Label>Business Information</Label>
                  <div className="mt-2 p-3 border rounded-lg">
                    <h4 className="font-medium">{selectedApplication.business_name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedApplication.business_description}</p>
                    <p className="text-xs mt-2">
                      <strong>Sector:</strong> {formatSector(selectedApplication.creative_sector)} • 
                      <strong> Stage:</strong> {selectedApplication.business_stage} • 
                      <strong> Years:</strong> {selectedApplication.years_in_operation || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Project Info */}
                <div>
                  <Label>Project Information</Label>
                  <div className="mt-2 p-3 border rounded-lg">
                    <h4 className="font-medium">{selectedApplication.project_title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedApplication.project_description}</p>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong>Funding Requested:</strong> {formatCurrency(selectedApplication.funding_amount_requested)}
                      </div>
                      <div>
                        <strong>Purpose:</strong> {selectedApplication.funding_purpose}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                {(selectedApplication.monthly_income || selectedApplication.credit_score) && (
                  <div>
                    <Label>Financial Information</Label>
                    <div className="mt-2 p-3 border rounded-lg grid grid-cols-2 gap-4 text-sm">
                      {selectedApplication.monthly_income && (
                        <div>
                          <strong>Monthly Income:</strong> {formatCurrency(selectedApplication.monthly_income)}
                        </div>
                      )}
                      {selectedApplication.credit_score && (
                        <div>
                          <strong>Credit Score:</strong> {selectedApplication.credit_score}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                <div>
                  <Label htmlFor="review-notes">Review Notes</Label>
                  <Textarea
                    id="review-notes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your review notes here..."
                    className="mt-2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedApplication.status !== 'approved' && (
                    <Button 
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  
                  {selectedApplication.status !== 'rejected' && (
                    <Button 
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  )}
                  
                  {selectedApplication.status !== 'under_review' && (
                    <Button 
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'under_review')}
                      variant="outline"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark Under Review
                    </Button>
                  )}

                  <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
