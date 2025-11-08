import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Activity } from "lucide-react";
import type { User } from "@shared/schema";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already signed-in users based on their role
  useEffect(() => {
    const redirectBasedOnRole = async () => {
      if (!authLoading && currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            if (userData.role === "physiotherapist") {
              setLocation("/physio");
            } else if (userData.role === "patient") {
              setLocation("/patient");
            }
          } else {
            console.warn("No user document found for UID:", currentUser.uid);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    redirectBasedOnRole();
  }, [currentUser, authLoading, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;

        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.displayName}!`,
        });

        // Redirect based on role
        if (userData.role === "physiotherapist") {
          setLocation("/physio");
        } else {
          setLocation("/patient");
        }
      } else {
        toast({
          title: "Profile missing",
          description: "No profile found for this user. Contact support.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      let message = "An error occurred while signing in.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            message = "Invalid email address.";
            break;
          case "auth/user-not-found":
          case "auth/wrong-password":
            message = "Incorrect email or password.";
            break;
          case "auth/user-disabled":
            message = "Your account has been disabled.";
            break;
          default:
            message = error.message;
        }
      }

      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">PhysioTrack</CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-testid="button-login"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Button
              variant="link"
              onClick={() => setLocation("/signup")}
              data-testid="link-signup"
            >
              Don’t have an account? Sign up
            </Button>
            <br />
            <Button
              variant="link"
              onClick={() => setLocation("/forgot-password")}
            >
              Forgot password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
