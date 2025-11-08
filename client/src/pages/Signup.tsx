import { useState } from "react";
import { useLocation } from "wouter";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Activity } from "lucide-react";
import type { UserRole } from "@shared/schema";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        role,
        createdAt: Date.now(),
      });

      toast({
        title: "Account created",
        description: "Welcome to PhysioTrack!",
      });
      // Redirect will be handled by AuthContext
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription className="text-base">
            Join PhysioTrack to start tracking your therapy progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                data-testid="input-displayname"
              />
            </div>
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
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                data-testid="input-password"
              />
            </div>
            <div className="space-y-3">
              <Label>I am a...</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate" data-testid="radio-patient">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient" className="cursor-pointer flex-1">
                    <div className="font-medium">Patient</div>
                    <div className="text-sm text-muted-foreground">Track my exercises and progress</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate" data-testid="radio-physiotherapist">
                  <RadioGroupItem value="physiotherapist" id="physiotherapist" />
                  <Label htmlFor="physiotherapist" className="cursor-pointer flex-1">
                    <div className="font-medium">Physiotherapist</div>
                    <div className="text-sm text-muted-foreground">Monitor patients and assign exercises</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-testid="button-signup"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setLocation("/login")}
              data-testid="link-login"
            >
              Already have an account? Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
