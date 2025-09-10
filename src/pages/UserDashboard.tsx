import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Application, ApplicationType, getApplicationTypeLabel, getApplicationStatusLabel } from "@/types/database";
import { Plus, FileText, Clock, CheckCircle, XCircle, DollarSign, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    totalRequested: 0
  });

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
      
      // Calculate stats
      const totalRequested = data?.reduce((sum, app) => sum + (app.funding_amount_requested || 0), 0) || 0;
      const approved = data?.filter(app => app.status === 'approved').length || 0;
      const pending = data?.filter(app => ['submitted', 'under_review', 'pending_documents'].includes(app.status)).length || 0;
      
      setStats({
        total: data?.length || 0,
        approved,
        pending,
        totalRequested
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'submitted':
      case 'under_review':
      case 'pending_documents':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'submitted':
      case 'under_review':
        return 'secondary';
      case 'pending_documents':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {user?.email?.split('@')[0]}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your creative funding applications
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild className="bg-gradient-to-r from-heva-purple to-heva-blue">
                  <Link to="/apply">
                    <Plus className="w-4 h-4 mr-2" />
                    New Application
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All your applications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully approved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Under review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requested</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES {stats.totalRequested.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Funding requested
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
              <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Your Applications</CardTitle>
                  <CardDescription>
                    Track and manage your funding applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start your creative funding journey by submitting your first application
                      </p>
                      <Button asChild className="bg-gradient-to-r from-heva-purple to-heva-blue">
                        <Link to="/apply">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Application
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div
                          key={application.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {getStatusIcon(application.status)}
                            <div>
                              <h3 className="font-medium">{application.project_title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {getApplicationTypeLabel(application.application_type)} • 
                                KES {application.funding_amount_requested.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {application.business_name}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge variant={getStatusBadgeVariant(application.status)}>
                              {getApplicationStatusLabel(application.status)}
                            </Badge>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/application/${application.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle>Creative Industry AI Assistant</CardTitle>
                  <CardDescription>
                    Get instant answers to your creative industry and funding questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">AI Assistant Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Chat with our AI assistant to get help with your applications and creative industry questions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
