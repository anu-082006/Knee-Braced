import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Play, CheckCircle } from "lucide-react";
import type { AssignedExercise } from "@shared/schema";

interface ExerciseCardProps {
  exercise: AssignedExercise;
  onStart?: () => void;
  onComplete?: () => void;
  progress?: number;
}

export function ExerciseCard({ exercise, onStart, onComplete, progress = 0 }: ExerciseCardProps) {
  const canStart = exercise.status === "assigned" || exercise.status === "in_progress";
  const isCompleted = exercise.status === "completed";

  return (
    <Card className="shadow-md hover-elevate" data-testid={`card-exercise-${exercise.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold mb-1">
              {exercise.exerciseName}
            </CardTitle>
            <CardDescription className="text-sm">
              Assigned {new Date(exercise.assignedAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <StatusBadge status={exercise.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Target Angle Range
            </p>
            <p className="text-lg font-bold font-mono">
              {exercise.targetAngleMin}° - {exercise.targetAngleMax}°
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Target Reps
            </p>
            <p className="text-lg font-bold font-mono">
              {exercise.targetReps}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Duration
            </p>
            <p className="text-lg font-bold font-mono">
              {Math.floor(exercise.targetDuration / 60)}m {exercise.targetDuration % 60}s
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Progress
            </p>
            <p className="text-lg font-bold font-mono">
              {progress}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
        </div>

        {!isCompleted && (
          <Button
            className="w-full"
            onClick={onStart}
            disabled={!canStart}
            data-testid={`button-start-${exercise.id}`}
          >
            <Play className="w-4 h-4 mr-2" />
            Start Exercise
          </Button>
        )}

        {isCompleted && exercise.completedAt && (
          <div className="flex items-center justify-center gap-2 py-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              Completed {new Date(exercise.completedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
