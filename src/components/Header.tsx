import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Sparkles, BarChart3, Users, Settings, LogOut, User, Shield, FileText, CreditCard, Link as LinkIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasAdminAccess, isAdmin } = useAdmin();

  const navigation = [
    { name: "Platform", href: "/", icon: BarChart3 },
    { name: "Dashboard", href: "/dashboard", icon: Users },
    { name: "My Applications", href: "/my-applications", icon: FileText },
    { name: "Credit Score", href: "/credit-score", icon: CreditCard },
    { name: "Financial Connections", href: "/financial-connections", icon: LinkIcon },
    { name: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
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
              <div className="font-bold text-lg text-foreground">Credit Intelligence</div>
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.email || '')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {hasAdminAccess && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-border/50"
                  asChild
                >
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs"
                  asChild
                >
                  <Link to="/admin/login">
                    <Shield className="mr-1 h-3 w-3" />
                    Admin
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-heva-purple to-heva-blue hover:from-heva-purple-dark hover:to-heva-blue"
                  asChild
                >
                  <Link to="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
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
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <div className="text-sm text-muted-foreground">
                        Signed in as {user.email}
                        {isAdmin && <Badge variant="secondary" className="ml-2">Admin</Badge>}
                      </div>
                      {hasAdminAccess && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          asChild
                        >
                          <Link to="/admin" onClick={() => setIsOpen(false)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full border-border/50"
                        asChild
                      >
                        <Link to="/auth/login" onClick={() => setIsOpen(false)}>Login</Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full text-sm"
                        asChild
                      >
                        <Link to="/admin/login" onClick={() => setIsOpen(false)}>
                          <Shield className="mr-2 h-4 w-4" />
                          Administrator Login
                        </Link>
                      </Button>
                      <Button 
                        className="w-full bg-gradient-to-r from-heva-purple to-heva-blue hover:from-heva-purple-dark hover:to-heva-blue"
                        asChild
                      >
                        <Link to="/auth/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
                      </Button>
                    </>
                  )}
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