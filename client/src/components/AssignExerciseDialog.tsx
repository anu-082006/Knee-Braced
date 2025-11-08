import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getExercisesByCreator, assignExerciseToPatient } from "@/lib/firestore";
import { Plus } from "lucide-react";
import type { Exercise, InsertAssignedExercise } from "@shared/schema";

interface AssignExerciseDialogProps {
  physioId: string;
  patientId: string;
  patientName: string;
  onExerciseAssigned: () => void;
}

export function AssignExerciseDialog({
  physioId,
  patientId,
  patientName,
  onExerciseAssigned,
}: AssignExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadExercises();
    }
  }, [open, physioId]);

  const loadExercises = async () => {
    try {
      const exerciseList = await getExercisesByCreator(physioId);
      setExercises(exerciseList);
    } catch (error) {
      console.error("Error loading exercises:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedExerciseId) {
      toast({
        title: "Exercise required",
        description: "Please select an exercise to assign",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const exercise = exercises.find((e) => e.id === selectedExerciseId);
      if (!exercise) return;

      const assignmentData: InsertAssignedExercise = {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        patientId: patientId,
        assignedBy: physioId,
        targetAngleMin: exercise.targetAngleMin,
        targetAngleMax: exercise.targetAngleMax,
        targetReps: exercise.targetReps,
        targetDuration: exercise.targetDuration,
      };

      await assignExerciseToPatient(patientId, assignmentData);

      toast({
        title: "Exercise assigned",
        description: `${exercise.name} assigned to ${patientName}`,
      });

      setSelectedExerciseId("");
      setOpen(false);
      onExerciseAssigned();
    } catch (error: any) {
      toast({
        title: "Assignment failed",
        description: error.message || "Could not assign exercise",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" data-testid={`button-assign-${patientId}`}>
          <Plus className="w-4 h-4 mr-1" />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Exercise</DialogTitle>
          <DialogDescription>
            Select an exercise to assign to {patientName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {exercises.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No exercises available. Create an exercise template first.
            </p>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="exercise-select">Exercise</Label>
              <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
                <SelectTrigger id="exercise-select" data-testid="select-exercise">
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exercises.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.targetReps} reps, {exercise.targetAngleMin}°-
                      {exercise.targetAngleMax}°)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            data-testid="button-cancel-assign-exercise"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={loading || !selectedExerciseId}
            data-testid="button-confirm-assign-exercise"
          >
            {loading ? "Assigning..." : "Assign Exercise"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
