import { useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import type { User } from "@shared/schema";

interface AssignPatientDialogProps {
  physioId: string;
  onPatientAssigned: () => void;
}

export function AssignPatientDialog({ physioId, onPatientAssigned }: AssignPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAssign = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter the patient's email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Find patient by email
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", email.trim().toLowerCase()),
        where("role", "==", "patient")
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast({
          title: "Patient not found",
          description: "No patient found with that email address",
          variant: "destructive",
        });
        return;
      }

      const patientDoc = snapshot.docs[0];
      const patient = patientDoc.data() as User;

      // Check if already assigned
      if (patient.assignedPhysioId === physioId) {
        toast({
          title: "Already assigned",
          description: "This patient is already assigned to you",
        });
        return;
      }

      // Assign patient to physiotherapist
      await updateDoc(doc(db, "users", patientDoc.id), {
        assignedPhysioId: physioId,
      });

      toast({
        title: "Patient assigned",
        description: `${patient.displayName} is now assigned to you`,
      });

      setEmail("");
      setOpen(false);
      onPatientAssigned();
    } catch (error: any) {
      toast({
        title: "Assignment failed",
        description: error.message || "Could not assign patient",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-patient">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's email address to add them to your care
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient-email">Patient Email</Label>
            <Input
              id="patient-email"
              type="email"
              placeholder="patient@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-patient-email"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            data-testid="button-cancel-assign"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={loading}
            data-testid="button-confirm-assign"
          >
            {loading ? "Assigning..." : "Assign Patient"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
