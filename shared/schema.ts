import { z } from "zod";

// User roles
export type UserRole = "physiotherapist" | "patient";

// User profile stored in Firestore users/{uid}
export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  role: z.enum(["physiotherapist", "patient"]),
  createdAt: z.number(),
  assignedPhysioId: z.string().optional(), // For patients only
});

export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ uid: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

// Exercise templates created by physiotherapists
// Stored in exercises/{exerciseId}
export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  targetAngleMin: z.number(),
  targetAngleMax: z.number(),
  targetReps: z.number(),
  targetDuration: z.number(), // in seconds
  createdBy: z.string(), // physiotherapist uid
  createdAt: z.number(),
});

export type Exercise = z.infer<typeof exerciseSchema>;

export const insertExerciseSchema = exerciseSchema.omit({ id: true, createdAt: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

// Exercises assigned to patients
// Stored in patients/{patientId}/assignedExercises/{assignedId}
export const assignedExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  patientId: z.string(),
  assignedBy: z.string(), // physiotherapist uid
  assignedAt: z.number(),
  targetAngleMin: z.number(),
  targetAngleMax: z.number(),
  targetReps: z.number(),
  targetDuration: z.number(),
  status: z.enum(["assigned", "in_progress", "completed"]),
  completedAt: z.number().optional(),
});

export type AssignedExercise = z.infer<typeof assignedExerciseSchema>;

export const insertAssignedExerciseSchema = assignedExerciseSchema.omit({ id: true, assignedAt: true, status: true });
export type InsertAssignedExercise = z.infer<typeof insertAssignedExerciseSchema>;

// Arduino readings from patients
// Stored in readings/{patientId}/events/{readingId}
export const readingSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  timestamp: z.number(),
  angle: z.number(),
  roll: z.number(),
  pitch: z.number(),
  yaw: z.number(),
  raw: z.string(), // raw serial line
  device: z.string().optional(),
  exerciseId: z.string().optional(), // if during exercise session
  sentToN8N: z.boolean().default(false),
  n8nResponse: z.string().optional(),
  n8nStatusCode: z.number().optional(),
});

export type Reading = z.infer<typeof readingSchema>;

export const insertReadingSchema = readingSchema.omit({ id: true });
export type InsertReading = z.infer<typeof insertReadingSchema>;

// Exercise progress tracking
// Stored in progress/{patientId}/exerciseProgress/{progressId}
export const exerciseProgressSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  exerciseId: z.string(),
  assignedExerciseId: z.string(),
  sessionStartTime: z.number(),
  sessionEndTime: z.number().optional(),
  repsCompleted: z.number().default(0),
  averageAngle: z.number().optional(),
  minAngle: z.number().optional(),
  maxAngle: z.number().optional(),
  status: z.enum(["active", "completed", "abandoned"]),
  completedAt: z.number().optional(),
  readingIds: z.array(z.string()).default([]),
});

export type ExerciseProgress = z.infer<typeof exerciseProgressSchema>;

export const insertExerciseProgressSchema = exerciseProgressSchema.omit({ 
  id: true, 
  repsCompleted: true, 
  status: true,
  readingIds: true 
});
export type InsertExerciseProgress = z.infer<typeof insertExerciseProgressSchema>;
