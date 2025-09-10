import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const mockApplications = [
    {
      id: "APP001",
      name: "Sarah Kimani",
      business: "Afro Fusion Fashion",
      sector: "Design & Creative Services",
      score: 742,
      status: "pending",
      amount: "KES 250,000",
      submittedAt: "2024-01-15"
    },
    {
      id: "APP002", 
      name: "David Mwangi",
      business: "Nairobi Film Studio",
      sector: "Audio Visual & Interactive Media",
      score: 685,
      status: "approved",
      amount: "KES 500,000",
      submittedAt: "2024-01-14"
    },
    {
      id: "APP003",
      name: "Grace Achieng",
      business: "Heritage Crafts Co-op",
      sector: "Visual Arts & Crafts",
      score: 598,
      status: "review",
      amount: "KES 150,000", 
      submittedAt: "2024-01-13"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-heva-green";
      case "pending": return "bg-heva-orange";
      case "review": return "bg-heva-blue";
      case "rejected": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getScoreRating = (score: number) => {
    if (score >= 750) return { rating: "Excellent", color: "text-heva-green" };
    if (score >= 650) return { rating: "Good", color: "text-heva-blue" };
    if (score >= 550) return { rating: "Fair", color: "text-heva-orange" };
    return { rating: "Poor", color: "text-destructive" };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">HEVA Admin Dashboard</h1>
              <p className="text-muted-foreground">Credit Intelligence Platform</p>
            </div>
            <Button variant="default" className="bg-gradient-to-r from-heva-purple to-heva-blue">
              New Assessment
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Funding</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 45.2M</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Credit Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">672</div>
              <p className="text-xs text-muted-foreground">
                +5 points this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest credit assessment requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockApplications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex-1">
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-muted-foreground">{app.business}</div>
                          <div className="text-xs text-muted-foreground">{app.sector}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{app.score}</div>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sector Performance</CardTitle>
                  <CardDescription>Credit score distribution by creative sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Design & Creative Services</span>
                        <span>742 avg</span>
                      </div>
                      <Progress value={74} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Audio Visual & Media</span>
                        <span>685 avg</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Visual Arts & Crafts</span>
                        <span>598 avg</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>Manage credit assessment applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.map((app) => {
                    const scoreInfo = getScoreRating(app.score);
                    return (
                      <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium">{app.name}</div>
                              <div className="text-sm text-muted-foreground">{app.business}</div>
                              <div className="text-xs text-muted-foreground">{app.sector}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold text-lg">{app.score}</div>
                            <div className={`text-xs ${scoreInfo.color}`}>{scoreInfo.rating}</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-medium">{app.amount}</div>
                            <div className="text-xs text-muted-foreground">Requested</div>
                          </div>
                          
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                          
                          <div className="flex gap-2">
                            {app.status === "pending" && (
                              <>
                                <Button size="sm" variant="outline" className="h-8">
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-8">
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline" className="h-8">
                              <FileText className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sectors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Audio Visual & Interactive Media", count: 156, avgScore: 685, growth: "+12%" },
                { name: "Design & Creative Services", count: 243, avgScore: 742, growth: "+18%" },
                { name: "Visual Arts & Crafts", count: 189, avgScore: 598, growth: "+8%" },
                { name: "Performance & Celebration", count: 134, avgScore: 634, growth: "+15%" },
                { name: "Books and Press", count: 98, avgScore: 712, growth: "+22%" },
                { name: "Cultural Infrastructure", count: 67, avgScore: 578, growth: "+5%" }
              ].map((sector) => (
                <Card key={sector.name}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{sector.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Applications</span>
                        <span className="font-medium">{sector.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Score</span>
                        <span className="font-medium">{sector.avgScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Growth</span>
                        <span className="font-medium text-heva-green">{sector.growth}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>Deep insights into HEVA's creative industry portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Advanced analytics dashboard coming soon</p>
                  <p className="text-sm text-muted-foreground mt-2">Integration with Supabase backend in progress</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;