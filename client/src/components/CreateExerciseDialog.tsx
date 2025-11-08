import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createExercise } from "@/lib/firestore";
import { Plus } from "lucide-react";
import type { InsertExercise } from "@shared/schema";

interface CreateExerciseDialogProps {
  physioId: string;
  onExerciseCreated: () => void;
}

export function CreateExerciseDialog({ physioId, onExerciseCreated }: CreateExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAngleMin: 45,
    targetAngleMax: 90,
    targetReps: 10,
    targetDuration: 300, // 5 minutes
  });

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter an exercise name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const exerciseData: InsertExercise = {
        ...formData,
        createdBy: physioId,
      };

      await createExercise(exerciseData);

      toast({
        title: "Exercise created",
        description: `${formData.name} has been added to your library`,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        targetAngleMin: 45,
        targetAngleMax: 90,
        targetReps: 10,
        targetDuration: 300,
      });

      setOpen(false);
      onExerciseCreated();
    } catch (error: any) {
      toast({
        title: "Creation failed",
        description: error.message || "Could not create exercise",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-create-exercise">
          <Plus className="w-4 h-4 mr-2" />
          Create Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Exercise Template</DialogTitle>
          <DialogDescription>
            Define a new exercise with target metrics for patients
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              placeholder="Knee Flexion"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-exercise-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the exercise and how to perform it..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              data-testid="input-exercise-description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="angleMin">Min Angle (°)</Label>
              <Input
                id="angleMin"
                type="number"
                value={formData.targetAngleMin}
                onChange={(e) =>
                  setFormData({ ...formData, targetAngleMin: Number(e.target.value) })
                }
                data-testid="input-angle-min"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="angleMax">Max Angle (°)</Label>
              <Input
                id="angleMax"
                type="number"
                value={formData.targetAngleMax}
                onChange={(e) =>
                  setFormData({ ...formData, targetAngleMax: Number(e.target.value) })
                }
                data-testid="input-angle-max"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reps">Target Reps</Label>
              <Input
                id="reps"
                type="number"
                value={formData.targetReps}
                onChange={(e) =>
                  setFormData({ ...formData, targetReps: Number(e.target.value) })
                }
                data-testid="input-target-reps"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.targetDuration}
                onChange={(e) =>
                  setFormData({ ...formData, targetDuration: Number(e.target.value) })
                }
                data-testid="input-target-duration"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            data-testid="button-cancel-create"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading}
            data-testid="button-confirm-create"
          >
            {loading ? "Creating..." : "Create Exercise"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
