import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, DollarSign, Users } from "lucide-react";
import { Application } from "@/types/database";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

const MyApplications = () => {
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
      social_impact_description: "Empowering 500+ youth and emerging artists through comprehensive creative education",
      created_at: "2024-01-15T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z"
    },
    {
      id: "app-002",
      user_id: user?.id || "user-1",
      application_type: "loan",
      status: "approved",
      business_name: "Digital Creative Hub",
      business_description: "Co-working space for digital creatives and startups",
      creative_sector: "digital_interactive_media",
      business_stage: "startup",
      sector: "Technology & Media",
      project_title: "Creative Co-working Expansion",
      project_description: "Expanding our digital creative co-working space to accommodate 50 more professionals.",
      funding_amount_requested: 75000,
      funding_purpose: "Facility expansion and equipment purchase",
      target_beneficiaries: 200,
      social_impact_description: "Supporting 200+ digital creatives with affordable workspace and networking opportunities",
      created_at: "2024-02-01T00:00:00Z",
      updated_at: "2024-02-01T00:00:00Z"
    },
    {
      id: "app-003",
      user_id: user?.id || "user-1",
      application_type: "grant",
      status: "draft",
      business_name: "Music Academy Kenya",
      business_description: "Professional music education and recording studio",
      creative_sector: "music",
      business_stage: "established",
      sector: "Music & Entertainment",
      project_title: "Youth Music Mentorship Program",
      project_description: "Creating a mentorship program that connects established musicians with young aspiring artists.",
      funding_amount_requested: 100000,
      funding_purpose: "Program development, mentor stipends, and recording equipment",
      target_beneficiaries: 300,
      social_impact_description: "Mentoring 300+ young musicians and providing pathway to music industry careers",
      created_at: "2024-02-10T00:00:00Z",
      updated_at: "2024-02-10T00:00:00Z"
    }
  ];

  const handleViewApplication = (applicationId: string) => {
    toast({
      title: "Application Details",
      description: `Viewing application ${applicationId}`,
    });
  };

  const handleEditApplication = (applicationId: string) => {
    toast({
      title: "Edit Application",
      description: `Editing application ${applicationId}`,
    });
  };

  const handleDownloadApplication = (applicationId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading application ${applicationId} as PDF`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'under_review': return 'Under Review';
      case 'draft': return 'Draft';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">Track and manage all your funding applications</p>
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
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockApplications.filter(app => app.status === 'under_review').length}
            </div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockApplications.reduce((sum, app) => sum + app.funding_amount_requested, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Funding amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockApplications.reduce((sum, app) => sum + app.target_beneficiaries, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">People impacted</p>
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Sector</span>
                    <p className="text-gray-900">{app.sector}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Funding Requested</span>
                    <p className="text-gray-900">${app.funding_amount_requested.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Target Beneficiaries</span>
                    <p className="text-gray-900">{app.target_beneficiaries.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleViewApplication(app.id)}>
                    View Details
                  </Button>
                  {app.status === 'draft' && (
                    <Button variant="outline" size="sm" onClick={() => handleEditApplication(app.id)}>
                      Edit Application
                    </Button>
                  )}
                  {(app.status === 'under_review' || app.status === 'approved') && (
                    <Button variant="outline" size="sm" onClick={() => handleDownloadApplication(app.id)}>
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {mockApplications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500 mb-4">Start your creative journey by submitting your first application</p>
              <Button>Create New Application</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
