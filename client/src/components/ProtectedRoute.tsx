import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "wouter";
import type { UserRole } from "@shared/schema";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Redirect to={userProfile.role === "physiotherapist" ? "/physio" : "/patient"} />;
  }

  return <>{children}</>;
}
