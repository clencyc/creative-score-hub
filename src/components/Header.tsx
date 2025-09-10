import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles, BarChart3, Users, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Platform", href: "/", icon: BarChart3 },
    { name: "Dashboard", href: "/dashboard", icon: Users },
    { name: "Sectors", href: "#sectors", icon: Sparkles },
    { name: "Features", href: "#features", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-heva-purple to-heva-blue">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-foreground">HEVA CCI</div>
              <div className="text-xs text-muted-foreground -mt-1">Credit Intelligence</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-heva-purple/20 text-heva-purple"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Badge variant="outline" className="bg-heva-green/20 text-heva-green border-heva-green/30">
              Live Beta
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border/50"
            >
              Login
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-heva-purple to-heva-blue hover:from-heva-purple-dark hover:to-heva-blue"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-heva-purple/20 text-heva-purple"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile CTA */}
                <div className="flex flex-col gap-3 pt-6 border-t border-border">
                  <Badge variant="outline" className="bg-heva-green/20 text-heva-green border-heva-green/30 w-fit">
                    Live Beta
                  </Badge>
                  <Button 
                    variant="outline" 
                    className="w-full border-border/50"
                  >
                    Login
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-heva-purple to-heva-blue hover:from-heva-purple-dark hover:to-heva-blue"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;