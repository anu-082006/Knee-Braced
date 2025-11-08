import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import PhysiotherapistDashboard from "@/pages/PhysiotherapistDashboard";
import PatientDashboard from "@/pages/PatientDashboard";
import NotFound from "@/pages/not-found";

function RootRedirect() {
  const { userProfile, loading } = useAuth();

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

  if (!userProfile) {
    return <Redirect to="/login" />;
  }

  if (userProfile.role === "physiotherapist") {
    return <Redirect to="/physio" />;
  }

  return <Redirect to="/patient" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      <Route path="/physio">
        <ProtectedRoute allowedRoles={["physiotherapist"]}>
          <PhysiotherapistDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/patient">
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
