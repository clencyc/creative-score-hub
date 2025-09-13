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

  // Handle URL parameters for tab switching
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['overview', 'applications', 'risk', 'sectors', 'ai-assistant'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-border bg-card rounded-lg p-6">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">
                Applications 
                {stats.pendingReviews > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">
                    {stats.pendingReviews}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="risk">Risk Analytics</TabsTrigger>
              <TabsTrigger value="sectors">Sectors</TabsTrigger>
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
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

            <TabsContent value="risk" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Risk Level Summary Cards */}
                <Card className="border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      High Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {applications.filter(app => (app.credit_score || 0) < 600).length}
                    </div>
                    <p className="text-sm text-red-600 mb-3">Credit Score &lt; 600</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Avg Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            applications.filter(app => (app.credit_score || 0) < 600)
                              .reduce((sum, app) => sum + app.funding_amount_requested, 0) / 
                            Math.max(applications.filter(app => (app.credit_score || 0) < 600).length, 1)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approval Rate:</span>
                        <span className="font-medium text-red-600">15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
                      <Clock className="h-5 w-5" />
                      Medium Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {applications.filter(app => (app.credit_score || 0) >= 600 && (app.credit_score || 0) < 700).length}
                    </div>
                    <p className="text-sm text-yellow-600 mb-3">Credit Score 600-699</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Avg Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            applications.filter(app => (app.credit_score || 0) >= 600 && (app.credit_score || 0) < 700)
                              .reduce((sum, app) => sum + app.funding_amount_requested, 0) / 
                            Math.max(applications.filter(app => (app.credit_score || 0) >= 600 && (app.credit_score || 0) < 700).length, 1)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approval Rate:</span>
                        <span className="font-medium text-yellow-600">65%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Low Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {applications.filter(app => (app.credit_score || 0) >= 700).length}
                    </div>
                    <p className="text-sm text-green-600 mb-3">Credit Score ≥ 700</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Avg Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            applications.filter(app => (app.credit_score || 0) >= 700)
                              .reduce((sum, app) => sum + app.funding_amount_requested, 0) / 
                            Math.max(applications.filter(app => (app.credit_score || 0) >= 700).length, 1)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approval Rate:</span>
                        <span className="font-medium text-green-600">85%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Analysis Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-700">High Risk Applications</CardTitle>
                    <CardDescription>Applications requiring careful review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {applications
                        .filter(app => (app.credit_score || 0) < 600)
                        .slice(0, 5)
                        .map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                            <div className="flex-1">
                              <div className="font-medium text-sm">User {app.user_id?.slice(0, 8)}</div>
                              <div className="text-xs text-red-600">
                                Credit: {app.credit_score || 'N/A'} • {formatSector(app.creative_sector)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm text-red-700">
                                {formatCurrency(app.funding_amount_requested)}
                              </div>
                              <Badge className="bg-red-500 text-white text-xs">
                                {app.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="ml-2 h-8 border-red-300"
                              onClick={() => handleViewDetails(app)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      {applications.filter(app => (app.credit_score || 0) < 600).length === 0 && (
                        <p className="text-center text-gray-500 py-4">No high-risk applications</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">Low Risk Applications</CardTitle>
                    <CardDescription>Pre-approved candidates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {applications
                        .filter(app => (app.credit_score || 0) >= 700)
                        .slice(0, 5)
                        .map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                            <div className="flex-1">
                              <div className="font-medium text-sm">User {app.user_id?.slice(0, 8)}</div>
                              <div className="text-xs text-green-600">
                                Credit: {app.credit_score || 'N/A'} • {formatSector(app.creative_sector)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm text-green-700">
                                {formatCurrency(app.funding_amount_requested)}
                              </div>
                              <Badge className="bg-green-500 text-white text-xs">
                                {app.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="ml-2 h-8 border-green-300"
                              onClick={() => handleViewDetails(app)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      {applications.filter(app => (app.credit_score || 0) >= 700).length === 0 && (
                        <p className="text-center text-gray-500 py-4">No low-risk applications</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Analytics Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Risk Analytics Dashboard
                  </CardTitle>
                  <CardDescription>
                    Comprehensive risk assessment and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-700">
                        {applications.length > 0 ? 
                          Math.round((applications.filter(app => (app.credit_score || 0) >= 700).length / applications.length) * 100) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Low Risk Ratio</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-700">
                        {applications.length > 0 ? 
                          Math.round(applications.reduce((sum, app) => sum + (app.credit_score || 0), 0) / applications.length) : 0}
                      </div>
                      <div className="text-sm text-gray-600">Avg Credit Score</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-700">
                        {formatCurrency(
                          applications.filter(app => (app.credit_score || 0) >= 700)
                            .reduce((sum, app) => sum + app.funding_amount_requested, 0)
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Low Risk Volume</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-700">2.1 days</div>
                      <div className="text-sm text-gray-600">Avg Review Time</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Risk Recommendations</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>Auto-approve applications with 750+ credit score and &lt;KES 200,000 funding</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-700">
                        <Clock className="h-4 w-4" />
                        <span>Medium risk applications (600-699) require business plan verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="h-4 w-4" />
                        <span>High risk applications (&lt;600) need collateral and detailed review</span>
                      </div>
                    </div>
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

            <TabsContent value="ai-assistant" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      AI Review Assistant
                    </CardTitle>
                    <CardDescription>
                      Get AI-powered insights for application reviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Smart Review Suggestions</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Automated risk assessment based on financial data</li>
                        <li>• Industry benchmark comparisons</li>
                        <li>• Funding amount recommendations</li>
                        <li>• Red flag detection for applications</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">Approval Insights</h4>
                      <div className="text-sm text-green-800">
                        <p>Applications with 750+ credit scores have 85% approval rate</p>
                        <p className="mt-1">Visual arts sector showing highest success rate</p>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Open AI Chat Assistant
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Application Analytics
                    </CardTitle>
                    <CardDescription>
                      AI-driven insights and trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">Avg Review Time</span>
                        <span className="font-medium">2.3 days</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">Approval Rate</span>
                        <span className="font-medium text-green-600">68%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">Risk Score Avg</span>
                        <span className="font-medium text-yellow-600">Medium</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Recent AI Recommendations</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          • Consider reducing funding for applicants with &lt;600 credit score
                        </p>
                        <p className="text-muted-foreground">
                          • Music sector applications need additional verification
                        </p>
                        <p className="text-muted-foreground">
                          • Increase approval rate for returning applicants
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Chat Interface */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant Chat</CardTitle>
                  <CardDescription>
                    Ask questions about applications, get recommendations, or request analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-64 p-4 border rounded-lg bg-gray-50 overflow-y-auto">
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                            AI
                          </div>
                          <div className="flex-1 p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-sm">
                              Hello! I'm your AI assistant for application reviews. I can help you:
                            </p>
                            <ul className="text-sm mt-2 space-y-1">
                              <li>• Analyze application risk factors</li>
                              <li>• Compare applications to industry benchmarks</li>
                              <li>• Suggest approval/rejection reasons</li>
                              <li>• Generate review summaries</li>
                            </ul>
                            <p className="text-sm mt-2 text-blue-600">
                              Try asking: "What's the risk level for application #12345?" or "Show me today's pending applications"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Ask AI assistant about applications..." 
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                      <Button>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

      {/* Application Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Application Review</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {selectedApplication.status.replace('_', ' ')}
                    </Badge>
                    {selectedApplication.credit_score && (
                      <Badge variant="outline" className={selectedApplication.credit_score >= 700 ? 'border-green-500 text-green-700' : selectedApplication.credit_score >= 600 ? 'border-yellow-500 text-yellow-700' : 'border-red-500 text-red-700'}>
                        Credit: {selectedApplication.credit_score}
                      </Badge>
                    )}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Review and manage application from User {selectedApplication.user_id?.slice(0, 8) || 'Unknown'} • 
                  Submitted {new Date(selectedApplication.created_at).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* AI Risk Assessment */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    AI Risk Assessment
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${selectedApplication.credit_score >= 700 ? 'text-green-600' : selectedApplication.credit_score >= 600 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {selectedApplication.credit_score >= 700 ? 'LOW' : selectedApplication.credit_score >= 600 ? 'MEDIUM' : 'HIGH'}
                      </div>
                      <div className="text-blue-700">Risk Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedApplication.funding_amount_requested <= 100000 ? '85%' : selectedApplication.funding_amount_requested <= 500000 ? '65%' : '45%'}
                      </div>
                      <div className="text-blue-700">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedApplication.credit_score >= 700 ? 'APPROVE' : selectedApplication.credit_score >= 600 ? 'REVIEW' : 'CAUTION'}
                      </div>
                      <div className="text-blue-700">AI Recommendation</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-blue-800">
                    <strong>AI Notes:</strong> 
                    {selectedApplication.credit_score >= 700 
                      ? " Excellent credit profile. Low risk candidate for approval."
                      : selectedApplication.credit_score >= 600 
                      ? " Moderate credit profile. Consider funding amount and business viability."
                      : " Below average credit score. Requires detailed review of business plan and collateral."
                    }
                  </div>
                </div>
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
                  <Label htmlFor="review-notes">Admin Review Notes</Label>
                  <Textarea
                    id="review-notes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your detailed review notes, conditions, or feedback..."
                    className="mt-2 min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    These notes will be saved with the application and can be referenced in future reviews.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 text-green-700">Approval Actions</h4>
                    <div className="space-y-2">
                      {selectedApplication.status !== 'approved' && (
                        <>
                          <Button 
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                            className="w-full bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Application
                          </Button>
                          <Button 
                            onClick={() => {
                              setReviewNotes(`Conditionally approved. Requires additional documentation before fund disbursement. ${reviewNotes}`);
                              handleStatusUpdate(selectedApplication.id, 'under_review');
                            }}
                            variant="outline"
                            className="w-full border-green-300 text-green-700"
                            size="sm"
                          >
                            Conditional Approval
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 text-red-700">Review/Rejection Actions</h4>
                    <div className="space-y-2">
                      {selectedApplication.status !== 'rejected' && (
                        <Button 
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                          variant="destructive"
                          className="w-full"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Application
                        </Button>
                      )}
                      
                      {selectedApplication.status !== 'under_review' && (
                        <Button 
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'under_review')}
                          variant="outline"
                          className="w-full border-yellow-300 text-yellow-700"
                          size="sm"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Mark Under Review
                        </Button>
                      )}

                      <Button 
                        onClick={() => {
                          setReviewNotes(`Requires additional information: ${reviewNotes}`);
                          handleStatusUpdate(selectedApplication.id, 'pending_documents');
                        }}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Request More Info
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Admin Actions Footer */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      AI Analysis
                    </Button>
                  </div>
                  
                  <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                    Close Review
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
