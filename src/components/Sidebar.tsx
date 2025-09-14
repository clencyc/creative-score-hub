import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Menu, 
  Sparkles, 
  Users, 
  LogOut, 
  User, 
  Shield, 
  FileText, 
  CreditCard, 
  Link as LinkIcon,
  Home,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasAdminAccess, isAdmin } = useAdmin();

  const navigation = [
    { 
      name: "Overview", 
      href: "/dashboard", 
      icon: Home,
      description: "Dashboard overview"
    },
    { 
      name: "My Applications", 
      href: "/my-applications", 
      icon: FileText,
      description: "Manage your applications"
    },
    { 
      name: "Credit Score", 
      href: "/credit-score", 
      icon: CreditCard,
      description: "Credit analysis & insights"
    },
    { 
      name: "Financial Connections", 
      href: "/financial-connections", 
      icon: LinkIcon,
      description: "Connect your accounts"
    },
    { 
      name: "AI Assistant", 
      href: "/ai-assistant", 
      icon: Sparkles,
      description: "AI-powered guidance"
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
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
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-200/80 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-heva-purple to-heva-blue">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">Credit Intelligence</div>
              <div className="text-xs text-gray-500 -mt-1">Credit Intelligence</div>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="p-2 rounded-lg bg-gradient-to-r from-heva-purple to-heva-blue mx-auto">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-b border-gray-200/80">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("w-full justify-start p-0 h-auto", collapsed && "justify-center")}>
                <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-heva-purple/20 text-heva-purple">
                      {getInitials(user.email || '')}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {user.email?.split('@')[0]}
                      </div>
                      <div className="text-xs text-gray-500">Professional</div>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align={collapsed ? "start" : "end"} side={collapsed ? "right" : "bottom"}>
              <div className="flex items-center justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-heva-purple/20 text-heva-purple">
                    {getInitials(user.email || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{user.email}</p>
                  <p className="text-xs text-gray-500">Professional Account</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/notifications" className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
              {hasAdminAccess && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  active 
                    ? "bg-heva-purple/10 text-heva-purple border-r-2 border-heva-purple" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.name : undefined}
              >
                <IconComponent className={cn("h-5 w-5", active && "text-heva-purple")} />
                {!collapsed && (
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {!active && (
                      <span className="text-xs text-gray-400 group-hover:text-gray-500">
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Status Badge */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200/80">
          <Badge variant="outline" className="w-full bg-green-50 text-green-700 border-green-200 justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Beta
          </Badge>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
