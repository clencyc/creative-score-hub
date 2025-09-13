import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import CreditScoreCard from "@/components/CreditScoreCard";
import FinancialConnections from "@/components/FinancialConnections";
import ApplicationProgressCard from "@/components/ApplicationProgressCard";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Smartphone,
  Building2,
  Target
} from "lucide-react";
import { CreditScore, FinancialConnection, Application, ApplicationProgress } from "@/types/database";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [financialConnections, setFinancialConnections] = useState<FinancialConnection[]>([]);
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

  const handleConnectAccount = (connection: Omit<FinancialConnection, 'id' | 'user_id' | 'created_at' | 'last_sync'>) => {
    toast({
      title: "Account Connection",
      description: `Connecting to ${connection.provider_name}...`,
    });
  };

  const handleDisconnectAccount = (connectionId: string) => {
    toast({
      title: "Account Disconnection",
      description: `Disconnecting account ${connectionId}...`,
    });
  };

  const handleSyncAccount = (connectionId: string) => {
    toast({
      title: "Account Sync",
      description: `Syncing account ${connectionId}...`,
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-heva-purple data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="credit-score" className="data-[state=active]:bg-heva-purple data-[state=active]:text-white">Credit Score</TabsTrigger>
          <TabsTrigger value="connections" className="data-[state=active]:bg-heva-purple data-[state=active]:text-white">Connections</TabsTrigger>
          <TabsTrigger value="applications" className="data-[state=active]:bg-heva-purple data-[state=active]:text-white">Applications</TabsTrigger>
          <TabsTrigger value="sectors" className="data-[state=active]:bg-heva-purple data-[state=active]:text-white">Sectors</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-heva-purple data-[state=active]:text-white">Analytics</TabsTrigger>
        </TabsList>

            <TabsContent value="overview" className="space-y-6">
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
                            {app.status.replace('_', ' ')}
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
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credit-score">
              <CreditScoreCard creditScore={mockCreditScore} />
            </TabsContent>

            <TabsContent value="connections">
              <FinancialConnections 
                connections={financialConnections}
                onConnect={handleConnectAccount}
                onDisconnect={handleDisconnectAccount}
                onSync={handleSyncAccount}
              />
            </TabsContent>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>All Applications</CardTitle>
                  <CardDescription>Manage and track all your funding applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockApplications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold">{app.project_title}</h3>
                              <Badge className={getStatusColor(app.status)}>
                                {app.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{app.business_name}</p>
                            <p className="text-sm text-gray-500 mb-4">{app.project_description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Type:</span>
                                <div className="font-medium">{app.application_type}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Sector:</span>
                                <div className="font-medium">{app.sector}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Amount:</span>
                                <div className="font-medium">KES {app.funding_amount_requested.toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Beneficiaries:</span>
                                <div className="font-medium">{app.target_beneficiaries}</div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button 
                              size="sm" 
                              onClick={() => handleViewApplication(app.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sectors">
              <Card>
                <CardHeader>
                  <CardTitle>Creative Sectors</CardTitle>
                  <CardDescription>Explore funding opportunities across different creative industries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: "Arts & Culture", applications: 45, funding: "KES 2.3M", icon: Target },
                      { name: "Media & Entertainment", applications: 32, funding: "KES 1.8M", icon: Smartphone },
                      { name: "Design & Fashion", applications: 28, funding: "KES 1.5M", icon: Building2 },
                      { name: "Digital Content", applications: 38, funding: "KES 2.1M", icon: FileText },
                      { name: "Music & Audio", applications: 25, funding: "KES 1.2M", icon: Users },
                      { name: "Film & Video", applications: 30, funding: "KES 1.9M", icon: CreditCard }
                    ].map((sector, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                          <sector.icon className="h-8 w-8 text-purple-600" />
                          <div className="ml-4">
                            <CardTitle className="text-base">{sector.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Applications:</span>
                              <span className="font-medium">{sector.applications}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Total Funding:</span>
                              <span className="font-medium">{sector.funding}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Trends</CardTitle>
                    <CardDescription>Your application performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Success Rate</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={50} className="w-20" />
                          <span className="text-sm font-medium">50%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Response Time</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={75} className="w-20" />
                          <span className="text-sm font-medium">15 days avg</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Completion Rate</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={90} className="w-20" />
                          <span className="text-sm font-medium">90%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Credit Health</CardTitle>
                    <CardDescription>Monitor your creditworthiness progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{mockCreditScore.score}</div>
                        <div className="text-sm text-gray-600">{mockCreditScore.grade}</div>
                      </div>
                      <div className="space-y-2">
                        {mockCreditScore.factors.map((factor, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{factor.factor}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={factor.weight * 10} className="w-16" />
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                factor.impact === 'positive' ? 'bg-green-100 text-green-800' :
                                factor.impact === 'negative' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {factor.impact}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
    </div>
  );
};

export default Dashboard;
