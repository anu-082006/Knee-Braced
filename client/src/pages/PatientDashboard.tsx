import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useArduinoConnection } from "@/hooks/useArduinoConnection";
import { TopNav } from "@/components/TopNav";
import { ArduinoConnectionPanel } from "@/components/ArduinoConnectionPanel";
import { ExerciseCard } from "@/components/ExerciseCard";
import { LiveReadingCard } from "@/components/LiveReadingCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Activity as ActivityIcon, Sparkles } from "lucide-react";
import type { AssignedExercise } from "@shared/schema";

interface N8nRecommendation {
  feedback: string;
  recommendedExercise: string;
  rationale: string;
  additionalAdvice: string;
  confidence: number;
}

export default function PatientDashboard() {
  const { userProfile } = useAuth();
  const [assignedExercises, setAssignedExercises] = useState<AssignedExercise[]>([]);
  const [recommendations, setRecommendations] = useState<N8nRecommendation[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const {
    connected,
    deviceName,
    currentReading,
    isRecording,
    connect,
    disconnect,
    startRecording,
    stopRecording,
  } = useArduinoConnection(userProfile?.uid || "");

  // 🟢 Fetch Assigned Exercises
  useEffect(() => {
    if (!userProfile) return;

    const exercisesQuery = query(
      collection(db, "patients", userProfile.uid, "assignedExercises")
    );

    const unsubscribe = onSnapshot(exercisesQuery, (snapshot) => {
      const exercises = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AssignedExercise[];

      setAssignedExercises(exercises);
      setLoadingExercises(false);
    });

    return () => unsubscribe();
  }, [userProfile]);

  // 🟢 Fetch N8n Recommendations from Firestore
  useEffect(() => {
    if (!userProfile) return;

    const recommendationsQuery = query(
      collection(db, "patients", userProfile.uid, "n8nResponses")
    );

    const unsubscribe = onSnapshot(recommendationsQuery, (snapshot) => {
      const recs: N8nRecommendation[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.recommendations && Array.isArray(data.recommendations)) {
          data.recommendations.forEach((rec: N8nRecommendation) => {
            recs.push(rec);
          });
        }
      });
      setRecommendations(recs);
      setLoadingRecommendations(false);
    });

    return () => unsubscribe();
  }, [userProfile]);

  const handleStartExercise = (exerciseId: string) => {
    if (connected) startRecording(exerciseId);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Patient Dashboard</h1>
          <p className="text-muted-foreground">
            Track your exercises and view personalized recommendations
          </p>
          {userProfile?.assignedPhysioId && (
            <Badge variant="outline" className="mt-2">
              <ActivityIcon className="w-3 h-3 mr-1" />
              Supervised by physiotherapist
            </Badge>
          )}
        </div>

        {/* 🔹 Arduino + Live Readings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <ArduinoConnectionPanel
              connected={connected}
              deviceName={deviceName}
              currentReading={currentReading}
              isRecording={isRecording}
              onConnect={connect}
              onDisconnect={disconnect}
              onStartRecording={() => startRecording()}
              onStopRecording={stopRecording}
            />
          </div>

          <div className="lg:col-span-2">
            {connected && currentReading && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Live Readings</CardTitle>
                  <CardDescription>Real-time data from your device</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <LiveReadingCard label="Angle" value={currentReading.angle} />
                    <LiveReadingCard label="Roll" value={currentReading.roll} />
                    <LiveReadingCard label="Pitch" value={currentReading.pitch} />
                    <LiveReadingCard label="Yaw" value={currentReading.yaw} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 🔹 Assigned Exercises Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Assigned Exercises</CardTitle>
            <CardDescription>Your personalized exercise program</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingExercises ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : assignedExercises.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No exercises assigned yet
                </h3>
                <p className="text-muted-foreground">
                  Your physiotherapist will assign exercises soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignedExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onStart={() => handleStartExercise(exercise.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 🔹 Recommended Exercises Section (from n8n) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              Recommended Exercises (AI Suggestions)
            </CardTitle>
            <CardDescription>
              Based on your recent exercise data and device readings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRecommendations ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recommendations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No AI recommendations yet. They’ll appear once new n8n responses are received.
              </p>
            ) : (
              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-6 border rounded-lg bg-muted/40 hover:bg-muted/60 transition"
                  >
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {rec.recommendedExercise}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Feedback:</strong> {rec.feedback}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Rationale:</strong> {rec.rationale}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Additional Advice:</strong> {rec.additionalAdvice}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Confidence: {(rec.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
