import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, user } = useAuth();
  const { isAdmin, hasAdminAccess, adminEmail } = useAdmin();

  // If already logged in as admin, redirect to admin dashboard
  if (user && hasAdminAccess) {
    return <Navigate to="/admin" replace />;
  }

  // If logged in but not admin, show access denied
  if (user && !hasAdminAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
            <CardDescription>
              You are logged in as a regular user. Only the system administrator can access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Current user: <strong>{user.email}</strong>
                <br />
                Required: <strong>{adminEmail}</strong>
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/dashboard">Go to User Dashboard</Link>
              </Button>
              <Button 
                onClick={() => {
                  // Sign out current user
                  window.location.href = '/auth/login';
                }}
                variant="default"
                className="flex-1"
              >
                Switch Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if trying to login with admin credentials
      if (email !== adminEmail) {
        toast.error('Invalid admin credentials. Please use the correct admin email.');
        setLoading(false);
        return;
      }

      await signIn(email, password);
      toast.success('Welcome, Administrator!');
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Administrator Login</CardTitle>
          <CardDescription>
            Access the Creative Score Hub admin panel
          </CardDescription>
          <Badge variant="secondary" className="mt-2">
            Admin Access Only
          </Badge>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Admin Email:</strong> {adminEmail}
              <br />
              Only this specific email address has administrator privileges.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              {email && email !== adminEmail && (
                <p className="text-sm text-red-600">
                  ⚠️ This is not the admin email address
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600" 
              disabled={loading || email !== adminEmail}
            >
              {loading ? "Signing in..." : "Sign In as Administrator"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Not an administrator?
            </p>
            <Button asChild variant="link" className="mt-1">
              <Link to="/auth/login">Regular User Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
