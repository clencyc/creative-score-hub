import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Target, 
  Shield, 
  TrendingUp, 
  Users, 
  BarChart3,
  AlertTriangle,
  FileText,
  CheckCircle,
  Lightbulb
} from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Behavioral Analytics",
    description: "Advanced pattern recognition analyzes reporting discipline, financial transparency, and growth trajectories specific to creative businesses.",
    benefits: ["Reporting discipline scoring", "Financial transparency index", "Growth trajectory prediction"],
    color: "heva-purple"
  },
  {
    icon: Target,
    title: "Sector-Adaptive Scoring",
    description: "Dynamic algorithms adjust scoring criteria based on industry-specific patterns, from fashion's monthly cycles to film's annual projects.",
    benefits: ["9 specialized sector models", "Seasonal adjustment factors", "Peer benchmarking"],
    color: "heva-blue"
  },
  {
    icon: Shield,
    title: "Transparent Credit Rationale",
    description: "Clear, plain-English explanations help entrepreneurs understand their scores and provide actionable improvement steps.",
    benefits: ["Score breakdown explanation", "Improvement roadmap", "Cultural context awareness"],
    color: "heva-green"
  },
  {
    icon: TrendingUp,
    title: "Early Warning System",
    description: "Proactive risk detection identifies potential issues before they become problems, with HEVA-specific monitoring protocols.",
    benefits: ["Risk flag timeline", "Quarterly report alerts", "Sector headwind warnings"],
    color: "heva-orange"
  }
];

const platformFeatures = [
  {
    icon: Users,
    title: "Investment Committee Interface",
    description: "Side-by-side comparison tools and portfolio health overviews for informed decision-making."
  },
  {
    icon: BarChart3,
    title: "Real-time Dashboard",
    description: "Live monitoring of funded businesses with comprehensive analytics and trend visualization."
  },
  {
    icon: AlertTriangle,
    title: "Risk Management",
    description: "Automated early warning system with customizable alerts and monitoring frequency."
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    description: "Smart processing of financial documents, photos, and field reports for comprehensive assessment."
  }
];

const FeaturesSection = () => {
  const getIconColor = (color: string) => {
    switch (color) {
      case "heva-purple": return "text-heva-purple";
      case "heva-blue": return "text-heva-blue";
      case "heva-green": return "text-heva-green";
      case "heva-orange": return "text-heva-orange";
      default: return "text-heva-purple";
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case "heva-purple": return "bg-heva-purple/20";
      case "heva-blue": return "bg-heva-blue/20";
      case "heva-green": return "bg-heva-green/20";
      case "heva-orange": return "bg-heva-orange/20";
      default: return "bg-heva-purple/20";
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-heva-blue/20 text-heva-blue border-heva-blue/30">
            <Lightbulb className="w-4 h-4 mr-2" />
            Intelligent Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Beyond Traditional
            <span className="bg-gradient-to-r from-heva-blue to-heva-green bg-clip-text text-transparent"> Credit Scoring</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our platform combines financial metrics with behavioral intelligence, cultural context, 
            and sector-specific knowledge to provide fair and accurate credit assessments.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${getBgColor(feature.color)} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-6 h-6 ${getIconColor(feature.color)}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Key Benefits:</h4>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3">
                          <CheckCircle className={`w-4 h-4 ${getIconColor(feature.color)}`} />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Preview */}
        <div className="mb-20">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={dashboardPreview} 
              alt="HEVA Dashboard Preview" 
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="p-8 md:p-12 max-w-2xl">
                <Badge variant="secondary" className="mb-4 bg-heva-green/20 text-heva-green border-heva-green/30">
                  Live Dashboard
                </Badge>
                <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                  Real-time Portfolio Intelligence
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Monitor your entire creative industry portfolio with sector-specific insights, 
                  early warning systems, and comprehensive analytics.
                </p>
                <Button className="bg-gradient-to-r from-heva-green to-heva-blue hover:from-heva-green/90 hover:to-heva-blue/90">
                  Explore Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader className="pb-3">
                  <div className="mx-auto p-3 rounded-xl bg-heva-purple/20 w-fit">
                    <IconComponent className="w-6 h-6 text-heva-purple" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technical Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-heva-purple mb-2">35%</div>
            <div className="text-sm text-muted-foreground">Better Risk Assessment</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-heva-blue mb-2">60%</div>
            <div className="text-sm text-muted-foreground">Faster Decisions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-heva-green mb-2">87%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-heva-orange mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;