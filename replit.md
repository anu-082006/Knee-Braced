# PhysioTrack - Physiotherapy Monitoring Platform

## Overview
PhysioTrack is a comprehensive Firebase-based web application for physiotherapy tracking with real-time Arduino device integration. The platform enables physiotherapists to monitor patients remotely while patients track their exercises with connected Arduino devices that measure movement angles and orientation data.

## Current State
**Phase: MVP Complete - Full-Stack Firebase Application**
- ✅ Complete Firestore data schema designed for users, exercises, readings, and progress
- ✅ Firebase SDK integrated with email/password authentication
- ✅ Comprehensive React components built with exceptional visual quality
- ✅ Role-based dashboards for Physiotherapists and Patients
- ✅ Web Serial API integration for Arduino connectivity
- ✅ Real-time data visualization components
- ✅ Design system configured following Material Design 3 principles
- ✅ Firestore security rules with role-based access control
- ✅ Cloud Functions for n8n webhook integration and progress tracking
- ✅ Complete CRUD operations for all entities
- ✅ Patient-physiotherapist assignment workflow
- ✅ Exercise creation and assignment UI
- ✅ Real-time data synchronization with Firestore

**Ready for Deployment:**
- All core MVP features implemented and functional
- See DEPLOYMENT.md for Firebase deployment instructions

## Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Real-time**: Firestore real-time listeners
- **Device Integration**: Web Serial API for Arduino

### User Roles

1. **Physiotherapist**
   - View and manage patients
   - Create exercise templates
   - Assign exercises to patients
   - Monitor real-time readings from patient devices
   - Track patient progress and completion metrics

2. **Patient**
   - Connect Arduino device via Web Serial API
   - View assigned exercises
   - Start/stop recording sessions
   - Track personal progress
   - Data automatically syncs to Firestore

### Firestore Schema

```
users/{uid}
  - uid: string
  - email: string
  - displayName: string
  - role: "physiotherapist" | "patient"
  - createdAt: number
  - assignedPhysioId?: string (patients only)

exercises/{exerciseId}
  - id: string
  - name: string
  - description: string
  - targetAngleMin: number
  - targetAngleMax: number
  - targetReps: number
  - targetDuration: number
  - createdBy: string (physio uid)
  - createdAt: number

patients/{patientId}/assignedExercises/{assignedId}
  - id: string
  - exerciseId: string
  - exerciseName: string
  - patientId: string
  - assignedBy: string
  - assignedAt: number
  - targetAngleMin: number
  - targetAngleMax: number
  - targetReps: number
  - targetDuration: number
  - status: "assigned" | "in_progress" | "completed"
  - completedAt?: number

readings/{patientId}/events/{readingId}
  - id: string
  - patientId: string
  - timestamp: number
  - angle: number
  - roll: number
  - pitch: number
  - yaw: number
  - raw: string
  - device?: string
  - exerciseId?: string
  - sentToN8N: boolean
  - n8nResponse?: string
  - n8nStatusCode?: number

progress/{patientId}/exerciseProgress/{progressId}
  - id: string
  - patientId: string
  - exerciseId: string
  - assignedExerciseId: string
  - sessionStartTime: number
  - sessionEndTime?: number
  - repsCompleted: number
  - averageAngle?: number
  - minAngle?: number
  - maxAngle?: number
  - status: "active" | "completed" | "abandoned"
  - completedAt?: number
  - readingIds: string[]
```

### Arduino Integration

**Serial Data Format:**
```
Angle: 45.3 Roll: 1.2 Pitch: -0.8 Yaw: 0.1
```

**Web Serial API Flow:**
1. Patient clicks "Connect Device" button
2. Browser prompts for serial port selection
3. Connection established at 9600 baud rate
4. Data parsed in real-time using regex
5. Readings saved to Firestore when recording

### n8n Webhook Integration

**Cloud Function Trigger:**
- Firestore onCreate trigger on `readings/{patientId}/events/{readingId}`
- POST reading data to configured n8n webhook
- Update Firestore document with webhook response

**Webhook Payload:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "arduino_data": {
    "knee_angle": 45.3,
    "roll": 1.2,
    "pitch": -0.8,
    "yaw": 0.1,
    "recording_status": "active"
  },
  "source": "arduino_knee_monitor",
  "patientId": "uid",
  "exerciseId": "exercise_id"
}
```

## Component Structure

### Pages
- `Login.tsx` - Email/password authentication
- `Signup.tsx` - Account creation with role selection
- `PhysiotherapistDashboard.tsx` - Professional monitoring interface
- `PatientDashboard.tsx` - Patient exercise tracking

### Components
- `TopNav.tsx` - Navigation bar with user menu
- `ArduinoConnectionPanel.tsx` - Device connection interface
- `ExerciseCard.tsx` - Exercise assignment display
- `LiveReadingCard.tsx` - Real-time metric visualization
- `StatusBadge.tsx` - Exercise/session status indicators
- `ConnectionStatus.tsx` - Device connection status
- `ProtectedRoute.tsx` - Role-based route protection

### Hooks
- `useAuth()` - Authentication context and user profile
- `useArduinoConnection()` - Web Serial API management

### Context
- `AuthContext` - Firebase authentication state management

## Design System

**Framework:** Material Design 3  
**Color Palette:** Professional medical blue with high contrast
**Typography:** Roboto (primary), Roboto Mono (data display)
**Spacing:** Consistent 4px grid system (2, 4, 6, 8, 12, 16)

**Key Design Principles:**
- Clinical Clarity: Health data takes visual priority
- Trust Through Consistency: Predictable patterns
- Data-First Interface: Metrics prominently displayed
- Professional Restraint: Minimal decoration, maximum function

## Environment Variables

Required Firebase secrets (already configured):
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_API_KEY`

## Development Workflow

```bash
# Start development server
npm run dev

# Backend runs on same port as frontend via Vite proxy
```

## Recent Changes (Latest Session)

**2024-10-31:**
- Created complete Firestore schema for all entities
- Built authentication system with role-based access
- Implemented PhysiotherapistDashboard with full patient management
- Implemented PatientDashboard with Arduino integration
- Created Web Serial API hook for device connectivity
- Built real-time data visualization components
- Configured design tokens in Tailwind
- Implemented Firestore security rules with role-based access
- Created Cloud Functions for n8n webhook and progress tracking
- Built patient assignment workflow with email lookup
- Implemented exercise template creation UI
- Created exercise assignment dialog for physiotherapists
- Connected all Firestore helper functions to UI components
- Updated security rules to allow controlled patient assignment

## Features Implemented

**Authentication & User Management:**
- ✅ Email/password signup with role selection
- ✅ Login with role-based routing
- ✅ Protected routes for each role
- ✅ Patient-physiotherapist assignment via email lookup

**Physiotherapist Features:**
- ✅ Patient dashboard with stats overview
- ✅ Add patients by email
- ✅ Create exercise templates
- ✅ Assign exercises to patients
- ✅ View patient list and metrics
- ✅ Real-time updates when patients complete exercises

**Patient Features:**
- ✅ Arduino device connection via Web Serial API
- ✅ View assigned exercises
- ✅ Start/stop recording sessions
- ✅ Live data visualization (angle, roll, pitch, yaw)
- ✅ Automatic data sync to Firestore
- ✅ Exercise progress tracking

**Backend & Data:**
- ✅ Complete Firestore schema implementation
- ✅ Role-based security rules
- ✅ Real-time data listeners
- ✅ Cloud Functions for n8n webhook integration
- ✅ Automated exercise progress calculation
- ✅ Rep counting based on target angle ranges

**Future Enhancements:**
- Exercise video/image attachments
- Progress charts and analytics
- Notification system
- PDF report generation
- Offline support with background sync
- Mobile PWA optimization

## User Preferences

- Medical-grade professional design
- Real-time data visualization critical
- Arduino integration via browser (no desktop software)
- n8n webhook for external automation
- Firebase deployment for easy scaling
