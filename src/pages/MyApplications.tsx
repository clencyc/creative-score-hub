import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, DollarSign, Users, Plus } from "lucide-react";
import { Application } from "@/types/database";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock applications data
  const mockApplications: Application[] = [
    {
      id: "app-001",
      user_id: user?.id || "user-1",
      application_type: "grant",
      status: "under_review",
      business_name: "Creative Arts Studio",
      business_description: "A community-focused arts studio providing creative services and education",
      creative_sector: "visual_arts_crafts",
      business_stage: "growth",
      sector: "Arts & Culture",
      project_title: "Community Arts Program",
      project_description: "Establishing a comprehensive arts program for local youth and emerging artists in the community.",
      funding_amount_requested: 150000,
      funding_purpose: "Equipment, training, and operational costs",
      target_beneficiaries: 500,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-20T15:30:00Z",
      submitted_at: "2024-01-16T09:00:00Z"
    },
    {
      id: "app-002", 
      user_id: user?.id || "user-1",
      application_type: "loan",
      status: "approved",
      business_name: "Digital Media House",
      business_description: "Professional video production and digital marketing services",
      creative_sector: "film_tv_video",
      business_stage: "established",
      sector: "Media & Entertainment",
      project_title: "Film Production Equipment Upgrade",
      project_description: "Purchase of professional-grade film equipment to expand our service offerings and improve production quality.",
      funding_amount_requested: 75000,
      funding_purpose: "Camera equipment, editing software, and studio setup",
      target_beneficiaries: 200,
      created_at: "2024-02-01T14:00:00Z",
      updated_at: "2024-02-10T11:45:00Z",
      submitted_at: "2024-02-02T16:30:00Z"
    },
    {
      id: "app-003",
      user_id: user?.id || "user-1",
      application_type: "investment",
      status: "pending_documents",
      business_name: "Creative Fashion Hub",
      business_description: "Sustainable fashion design and manufacturing collective",
      creative_sector: "fashion_textiles",
      business_stage: "startup",
      sector: "Fashion & Design",
      project_title: "Sustainable Fashion Initiative",
      project_description: "Building a sustainable fashion design and manufacturing hub for local designers.",
      funding_amount_requested: 200000,
      funding_purpose: "Equipment, workspace setup, and initial inventory",
      target_beneficiaries: 300,
      created_at: "2024-02-15T09:00:00Z",
      updated_at: "2024-02-20T14:30:00Z",
      submitted_at: "2024-02-16T10:15:00Z"
    }
  ];

  const handleViewApplication = (applicationId: string) => {
    toast({
      title: "Application Details",
      description: `Opening application ${applicationId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800'; 
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'pending_documents': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track and manage all your funding applications</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-heva-purple to-heva-blue hover:from-heva-purple-dark hover:to-heva-blue text-white"
          onClick={() => {
            navigate('/apply');
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockApplications.length}</div>
                <p className="text-xs text-muted-foreground">Applications submitted</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requested</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KES {mockApplications.reduce((sum, app) => sum + app.funding_amount_requested, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Funding amount requested</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <Badge className="bg-green-100 text-green-800">
                  {mockApplications.filter(app => app.status === 'approved').length}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KES {mockApplications.filter(app => app.status === 'approved').reduce((sum, app) => sum + app.funding_amount_requested, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Approved funding</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((mockApplications.filter(app => app.status === 'approved').length / mockApplications.length) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Application success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            {mockApplications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{app.project_title}</CardTitle>
                      <CardDescription className="text-base">{app.business_name}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusText(app.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">{app.project_description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Type</p>
                        <p className="text-sm capitalize">{app.application_type}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Sector</p>
                        <p className="text-sm">{app.sector}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Amount Requested</p>
                        <p className="text-sm font-semibold">KES {app.funding_amount_requested.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Beneficiaries</p>
                        <p className="text-sm">{app.target_beneficiaries} people</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Submitted: {new Date(app.submitted_at!).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Last updated: {new Date(app.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => handleViewApplication(app.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {mockApplications.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-4">Start your creative journey by submitting your first application</p>
                <Button 
                  className="bg-gradient-to-r from-heva-purple to-heva-blue hover:from-heva-purple-dark hover:to-heva-blue text-white"
                  onClick={() => {
                    navigate('/apply');
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Application
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
  );
};

export default MyApplications;
