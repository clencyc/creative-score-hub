import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import CreditScoreCard from "@/components/CreditScoreCard";
import ApplicationProgressCard from "@/components/ApplicationProgressCard";
import { 
  CreditCard, 
  TrendingUp, 
  FileText,
  CheckCircle,
  Eye
} from "lucide-react";
import { CreditScore, Application, ApplicationProgress } from "@/types/database";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user } = useAuth();

  // Mock credit score data
  const mockCreditScore: CreditScore = {
    score: 720,
    grade: 'Very Good',
    last_updated: new Date().toISOString(),
    factors: [
      {
        factor: "Payment History",
        impact: "positive",
        description: "You have consistently made payments on time for the past 12 months",
        weight: 9
      },
      {
        factor: "Credit Utilization", 
        impact: "positive",
        description: "Your credit utilization is at 25%, which is within the recommended range",
        weight: 7
      },
      {
        factor: "Credit History Length",
        impact: "neutral",
        description: "Your credit history is 3 years old, which is moderate",
        weight: 6
      },
      {
        factor: "Credit Mix",
        impact: "positive", 
        description: "You have a good mix of credit types including loans and credit cards",
        weight: 8
      },
      {
        factor: "New Credit",
        impact: "negative",
        description: "You've opened 2 new accounts in the past 6 months",
        weight: 4
      }
    ]
  };

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
      project_description: "Establishing a comprehensive arts program for local youth",
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
      project_title: "Film Production Equipment",
      project_description: "Purchase of professional-grade film equipment for expanded services",
      funding_amount_requested: 75000,
      funding_purpose: "Camera equipment, editing software, and studio setup",
      target_beneficiaries: 200,
      created_at: "2024-02-01T14:00:00Z",
      updated_at: "2024-02-10T11:45:00Z",
      submitted_at: "2024-02-02T16:30:00Z"
    }
  ];

  // Mock application progress data
  const mockApplicationProgress: ApplicationProgress[] = [
    {
      id: "progress-001",
      application_id: "app-001",
      stage: "document_review",
      status: "in_progress",
      started_at: "2024-01-16T09:00:00Z",
      estimated_completion: "2024-01-25T17:00:00Z",
      notes: "Awaiting financial statements verification"
    },
    {
      id: "progress-002", 
      application_id: "app-002",
      stage: "approved",
      status: "completed",
      started_at: "2024-02-02T16:30:00Z",
      completed_at: "2024-02-10T11:45:00Z",
      notes: "Application approved - funds to be disbursed"
    }
  ];

  // Stats for overview
  const stats = [
    {
      title: "Total Applications",
      value: mockApplications.length.toString(),
      description: "Applications submitted",
      icon: FileText,
      trend: "+12%"
    },
    {
      title: "Approved Funding",
      value: "KES 75,000",
      description: "Total approved amount",
      icon: CheckCircle,
      trend: "+8%"
    },
    {
      title: "Credit Score",
      value: mockCreditScore.score.toString(),
      description: mockCreditScore.grade,
      icon: CreditCard,
      trend: "+15 points"
    },
    {
      title: "Success Rate",
      value: "50%",
      description: "Application approval rate",
      icon: TrendingUp,
      trend: "+5%"
    }
  ];

  const handleViewApplication = (applicationId: string) => {
    toast({
      title: "Application View",
      description: `Viewing application ${applicationId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800'; 
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your applications</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <div className="text-xs text-green-600 mt-1">{stat.trend}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreditScoreCard creditScore={mockCreditScore} />
          <ApplicationProgressCard 
            applications={mockApplications}
            applicationProgress={{
              "app-001": mockApplicationProgress[0],
              "app-002": mockApplicationProgress[1]
            }}
            onViewApplication={handleViewApplication}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your latest funding applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{app.project_title}</h3>
                    <p className="text-sm text-gray-600">{app.business_name}</p>
                    <p className="text-xs text-gray-500">{app.sector}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace(/_/g, ' ')}
                    </Badge>
                    <div className="text-right">
                      <div className="font-medium">KES {app.funding_amount_requested.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(app.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewApplication(app.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
