import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Film, 
  Palette, 
  BookOpen, 
  Building, 
  Camera, 
  Paintbrush, 
  Music, 
  Heart, 
  Sparkles 
} from "lucide-react";
import creativeIndustries from "@/assets/creative-industries.jpg";

const sectors = [
  {
    id: 1,
    name: "Audio Visual & Interactive Media",
    icon: Film,
    description: "Film production, digital content, and interactive experiences",
    weightFactors: [
      { name: "Project completion history", weight: 40 },
      { name: "Platform traction", weight: 25 },
      { name: "Technical capability", weight: 20 },
      { name: "Market demand", weight: 15 }
    ],
    avgScore: 685,
    businesses: 156,
    growth: "+12%"
  },
  {
    id: 2,
    name: "Design & Creative Services",
    icon: Palette,
    description: "Fashion, graphic design, and creative consultancy",
    weightFactors: [
      { name: "Client portfolio", weight: 30 },
      { name: "Delivery consistency", weight: 25 },
      { name: "Market positioning", weight: 25 },
      { name: "Scalability", weight: 20 }
    ],
    avgScore: 742,
    businesses: 243,
    growth: "+18%"
  },
  {
    id: 3,
    name: "Books and Press",
    icon: BookOpen,
    description: "Publishing, journalism, and content creation",
    weightFactors: [
      { name: "Distribution network", weight: 35 },
      { name: "Content consistency", weight: 30 },
      { name: "Audience engagement", weight: 20 },
      { name: "Market trends", weight: 15 }
    ],
    avgScore: 712,
    businesses: 98,
    growth: "+22%"
  },
  {
    id: 4,
    name: "Cultural Infrastructure",
    icon: Building,
    description: "Museums, galleries, and cultural spaces",
    weightFactors: [
      { name: "Utilization rates", weight: 40 },
      { name: "Maintenance capability", weight: 25 },
      { name: "Community impact", weight: 20 },
      { name: "Sustainability", weight: 15 }
    ],
    avgScore: 578,
    businesses: 67,
    growth: "+5%"
  },
  {
    id: 5,
    name: "Visual Arts & Crafts",
    icon: Paintbrush,
    description: "Traditional crafts, contemporary art, and artisan products",
    weightFactors: [
      { name: "Artistic recognition", weight: 30 },
      { name: "Market demand", weight: 25 },
      { name: "Production capability", weight: 25 },
      { name: "Distribution channels", weight: 20 }
    ],
    avgScore: 598,
    businesses: 189,
    growth: "+8%"
  },
  {
    id: 6,
    name: "Performance & Celebration",
    icon: Music,
    description: "Live events, festivals, and performance arts",
    weightFactors: [
      { name: "Event track record", weight: 35 },
      { name: "Audience loyalty", weight: 25 },
      { name: "Venue relationships", weight: 20 },
      { name: "Seasonal planning", weight: 20 }
    ],
    avgScore: 634,
    businesses: 134,
    growth: "+15%"
  }
];

const SectorShowcase = () => {
  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-heva-green";
    if (score >= 600) return "text-heva-blue";
    return "text-heva-orange";
  };

  const getProgressColor = (score: number) => {
    if (score >= 700) return "bg-heva-green";
    if (score >= 600) return "bg-heva-blue";
    return "bg-heva-orange";
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-heva-purple/20 text-heva-purple-light border-heva-purple/30">
            <Sparkles className="w-4 h-4 mr-2" />
            9 Sector-Specific Models
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Tailored for Every
            <span className="bg-gradient-to-r from-heva-purple to-heva-orange bg-clip-text text-transparent"> Creative Industry</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Each creative sector has unique business patterns, seasonal cycles, and success factors. 
            Our AI understands these nuances and adapts scoring accordingly.
          </p>
        </div>

        {/* Creative Industries Image */}
        <div className="mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={creativeIndustries} 
              alt="Creative Industries Across East Africa" 
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Supporting East Africa's Creative Economy
              </h3>
              <p className="text-muted-foreground">
                From fashion designers in Nairobi to filmmakers in Kampala, our platform understands the diverse creative landscape.
              </p>
            </div>
          </div>
        </div>

        {/* Sector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector) => {
            const IconComponent = sector.icon;
            return (
              <Card key={sector.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-heva-purple/50">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-heva-purple/20 group-hover:bg-heva-purple/30 transition-colors">
                        <IconComponent className="w-5 h-5 text-heva-purple" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{sector.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {sector.businesses} businesses
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3">
                    {sector.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Score and Growth */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-2xl font-bold ${getScoreColor(sector.avgScore)}`}>
                        {sector.avgScore}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Score</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-heva-green">{sector.growth}</div>
                      <div className="text-sm text-muted-foreground">Growth</div>
                    </div>
                  </div>

                  {/* Score Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Score Range</span>
                      <span>{Math.round(sector.avgScore / 10)}/10</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(sector.avgScore)}`}
                        style={{ width: `${(sector.avgScore / 1000) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Weight Factors */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Key Assessment Factors:</h4>
                    <div className="space-y-1">
                      {sector.weightFactors.slice(0, 2).map((factor, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{factor.name}</span>
                          <span className="font-medium">{factor.weight}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Ready to see how sector-specific scoring works for your creative business?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="px-6 py-3 text-sm bg-heva-purple/10 border-heva-purple/30 text-heva-purple">
              <Heart className="w-4 h-4 mr-2" />
              Designed for African Creatives
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-sm bg-heva-blue/10 border-heva-blue/30 text-heva-blue">
              <Camera className="w-4 h-4 mr-2" />
              Real-time Assessment
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectorShowcase;