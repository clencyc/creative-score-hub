import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingUp, Shield } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="HEVA Credit Intelligence Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-heva-purple/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-heva-orange/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-heva-blue/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-heva-purple/20 text-heva-purple-light border-heva-purple/30">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Credit Intelligence
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            <span className="bg-gradient-to-r from-heva-purple via-heva-blue to-heva-orange bg-clip-text text-transparent">
              HEVA CCI
            </span>
            <br />
            Credit Intelligence
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Sector-Adaptive Credit Scoring for Creative and Cultural Industries across East Africa
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <TrendingUp className="w-5 h-5 text-heva-green" />
              <span className="text-sm font-medium">9 Sector Models</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <Shield className="w-5 h-5 text-heva-blue" />
              <span className="text-sm font-medium">Behavioral Analytics</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <Sparkles className="w-5 h-5 text-heva-orange" />
              <span className="text-sm font-medium">Transparent Scoring</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-heva-purple to-heva-blue hover:from-heva-purple-dark hover:to-heva-blue text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-border/50 bg-background/20 backdrop-blur-sm hover:bg-accent/20 px-8 py-4 text-lg"
            >
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">1,247</div>
              <div className="text-sm text-muted-foreground">Businesses Assessed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">KES 45M</div>
              <div className="text-sm text-muted-foreground">Funding Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">9</div>
              <div className="text-sm text-muted-foreground">Creative Sectors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">87%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;