// Firestore helper functions for CRUD operations
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  User,
  InsertUser,
  Exercise,
  InsertExercise,
  AssignedExercise,
  InsertAssignedExercise,
  Reading,
  InsertReading,
  ExerciseProgress,
  InsertExerciseProgress,
} from "@shared/schema";

// User operations
export const createUser = async (uid: string, userData: Omit<InsertUser, "uid">) => {
  const userDoc = {
    uid,
    ...userData,
    createdAt: Date.now(),
  };
  await setDoc(doc(db, "users", uid), userDoc);
  return userDoc as User;
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? (userDoc.data() as User) : null;
};

export const updateUser = async (uid: string, updates: Partial<User>) => {
  await updateDoc(doc(db, "users", uid), updates);
};

export const getPatientsByPhysioId = async (physioId: string): Promise<User[]> => {
  const q = query(
    collection(db, "users"),
    where("role", "==", "patient"),
    where("assignedPhysioId", "==", physioId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as User);
};

// Exercise template operations
export const createExercise = async (exerciseData: InsertExercise) => {
  const docRef = await addDoc(collection(db, "exercises"), {
    ...exerciseData,
    createdAt: Date.now(),
  });
  return { id: docRef.id, ...exerciseData, createdAt: Date.now() } as Exercise;
};

export const getExercise = async (exerciseId: string): Promise<Exercise | null> => {
  const exerciseDoc = await getDoc(doc(db, "exercises", exerciseId));
  return exerciseDoc.exists() ? (exerciseDoc.data() as Exercise) : null;
};

export const getExercisesByCreator = async (creatorId: string): Promise<Exercise[]> => {
  const q = query(
    collection(db, "exercises"),
    where("createdBy", "==", creatorId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Exercise));
};

export const updateExercise = async (exerciseId: string, updates: Partial<Exercise>) => {
  await updateDoc(doc(db, "exercises", exerciseId), updates);
};

export const deleteExercise = async (exerciseId: string) => {
  await deleteDoc(doc(db, "exercises", exerciseId));
};

// Assigned exercise operations
export const assignExerciseToPatient = async (
  patientId: string,
  exerciseData: InsertAssignedExercise
) => {
  const docRef = await addDoc(
    collection(db, "patients", patientId, "assignedExercises"),
    {
      ...exerciseData,
      assignedAt: Date.now(),
      status: "assigned",
    }
  );
  return {
    id: docRef.id,
    ...exerciseData,
    assignedAt: Date.now(),
    status: "assigned" as const,
  } as AssignedExercise;
};

export const getAssignedExercises = async (patientId: string): Promise<AssignedExercise[]> => {
  const snapshot = await getDocs(
    collection(db, "patients", patientId, "assignedExercises")
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AssignedExercise));
};

export const updateAssignedExercise = async (
  patientId: string,
  assignedId: string,
  updates: Partial<AssignedExercise>
) => {
  await updateDoc(
    doc(db, "patients", patientId, "assignedExercises", assignedId),
    updates
  );
};

export const subscribeToAssignedExercises = (
  patientId: string,
  callback: (exercises: AssignedExercise[]) => void
) => {
  return onSnapshot(
    collection(db, "patients", patientId, "assignedExercises"),
    (snapshot) => {
      const exercises = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AssignedExercise[];
      callback(exercises);
    }
  );
};

// Reading operations
export const saveReading = async (patientId: string, readingData: InsertReading) => {
  const docRef = await addDoc(collection(db, "readings", patientId, "events"), {
    ...readingData,
    sentToN8N: false,
  });
  return { id: docRef.id, ...readingData, sentToN8N: false } as Reading;
};

export const getReadings = async (
  patientId: string,
  limitCount?: number
): Promise<Reading[]> => {
  const q = limitCount
    ? query(
        collection(db, "readings", patientId, "events"),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      )
    : query(collection(db, "readings", patientId, "events"), orderBy("timestamp", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Reading));
};

export const getReadingsByExercise = async (
  patientId: string,
  exerciseId: string
): Promise<Reading[]> => {
  const q = query(
    collection(db, "readings", patientId, "events"),
    where("exerciseId", "==", exerciseId),
    orderBy("timestamp", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Reading));
};

export const updateReading = async (
  patientId: string,
  readingId: string,
  updates: Partial<Reading>
) => {
  await updateDoc(doc(db, "readings", patientId, "events", readingId), updates);
};

export const subscribeToReadings = (
  patientId: string,
  callback: (readings: Reading[]) => void
) => {
  return onSnapshot(
    query(
      collection(db, "readings", patientId, "events"),
      orderBy("timestamp", "desc"),
      limit(50)
    ),
    (snapshot) => {
      const readings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reading[];
      callback(readings);
    }
  );
};

// Exercise progress operations
export const createExerciseProgress = async (
  patientId: string,
  progressData: InsertExerciseProgress
) => {
  const docRef = await addDoc(
    collection(db, "progress", patientId, "exerciseProgress"),
    {
      ...progressData,
      repsCompleted: 0,
      status: "active",
      readingIds: [],
    }
  );
  return {
    id: docRef.id,
    ...progressData,
    repsCompleted: 0,
    status: "active" as const,
    readingIds: [],
  } as ExerciseProgress;
};

export const getExerciseProgress = async (
  patientId: string,
  progressId: string
): Promise<ExerciseProgress | null> => {
  const progressDoc = await getDoc(
    doc(db, "progress", patientId, "exerciseProgress", progressId)
  );
  return progressDoc.exists() ? (progressDoc.data() as ExerciseProgress) : null;
};

export const getProgressByExercise = async (
  patientId: string,
  exerciseId: string
): Promise<ExerciseProgress[]> => {
  const q = query(
    collection(db, "progress", patientId, "exerciseProgress"),
    where("exerciseId", "==", exerciseId),
    orderBy("sessionStartTime", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ExerciseProgress));
};

export const updateExerciseProgress = async (
  patientId: string,
  progressId: string,
  updates: Partial<ExerciseProgress>
) => {
  await updateDoc(
    doc(db, "progress", patientId, "exerciseProgress", progressId),
    updates
  );
};

export const subscribeToExerciseProgress = (
  patientId: string,
  callback: (progress: ExerciseProgress[]) => void
) => {
  return onSnapshot(
    collection(db, "progress", patientId, "exerciseProgress"),
    (snapshot) => {
      const progress = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ExerciseProgress[];
      callback(progress);
    }
  );
};
