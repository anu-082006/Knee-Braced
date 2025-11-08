# Design Guidelines: Physiotherapy Tracking Platform

## Design Approach

**Selected Framework:** Material Design 3  
**Rationale:** Healthcare applications demand clarity, accessibility, and robust data presentation. Material Design 3 provides excellent patterns for information-dense interfaces, real-time data visualization, and role-based experiences while maintaining professional credibility essential for medical contexts.

**Key Design Principles:**
- Clinical Clarity: Information hierarchy prioritizes critical health data
- Trust Through Consistency: Predictable patterns reduce cognitive load for medical professionals
- Data-First Interface: Metrics, readings, and progress take visual priority
- Professional Restraint: Minimal decorative elements; functionality drives design

---

## Typography System

**Font Family:** Roboto (via Google Fonts CDN)
- Primary: Roboto (400, 500, 700)
- Monospace (for data/readings): Roboto Mono (400, 500)

**Hierarchy:**
- Page Headers: text-3xl font-bold (Physio/Patient Dashboard titles)
- Section Headers: text-2xl font-semibold (Patient List, Assigned Exercises)
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Data Labels: text-sm font-medium uppercase tracking-wide
- Metric Values: text-4xl font-bold (large readings display)
- Timestamps/Meta: text-xs font-normal

---

## Layout System

**Spacing Primitives:** Tailwind units of **2, 4, 6, 8, 12, 16**
- Tight spacing: p-2, gap-2 (within cards, button groups)
- Standard spacing: p-4, gap-4, m-4 (card padding, form fields)
- Section spacing: p-6, py-8 (dashboard sections)
- Large breathing room: p-12, py-16 (between major sections)

**Grid Structure:**
- Dashboard Container: max-w-7xl mx-auto px-4
- Two-Column Split: grid grid-cols-1 lg:grid-cols-3 gap-6
  - Sidebar: lg:col-span-1 (patient list, navigation)
  - Main Content: lg:col-span-2 (data, charts, forms)
- Card Grids: grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4

---

## Component Library

### Authentication Pages
**Login/Signup:**
- Centered card layout: max-w-md mx-auto mt-16
- Form container: p-8 rounded-lg shadow-xl
- Input spacing: space-y-4
- Logo/Header area: mb-8 text-center
- Role selection: Radio buttons with clear labels, p-4 border rounded-lg

### Navigation
**Top Navigation Bar:**
- Height: h-16
- Layout: flex items-center justify-between px-6
- User menu: Dropdown (top-right) with avatar, name, role badge
- Quick actions: Icon buttons for notifications, settings

**Sidebar (Physiotherapist Dashboard):**
- Width: w-64 on desktop, collapsible on mobile
- Navigation items: p-3 rounded-lg with icon + label
- Active state: slightly elevated appearance
- Patient quick-access list at bottom

### Dashboard Cards
**Standard Card Pattern:**
- Padding: p-6
- Border radius: rounded-lg
- Elevation: shadow-md, hover:shadow-lg transition
- Header: flex justify-between items-center mb-4
- Content area: space-y-4

**Patient Card (Physio View):**
- Layout: p-4 border rounded-lg
- Header: Name (text-lg font-semibold) + Status badge
- Metrics row: grid grid-cols-3 gap-2 text-center
- Action buttons: mt-4 flex gap-2

**Exercise Card (Patient View):**
- Layout: p-6 rounded-lg shadow-md
- Exercise name: text-xl font-semibold mb-2
- Target metrics: grid grid-cols-2 gap-4 (angle range, reps, duration)
- Progress indicator: h-2 rounded-full (progress bar)
- Start/Complete button: w-full mt-4

### Data Visualization Components

**Live Reading Display:**
- Large metric cards: grid grid-cols-2 lg:grid-cols-4 gap-4
- Each metric: p-6 rounded-lg text-center
- Value: text-5xl font-bold
- Label: text-sm uppercase tracking-wide mt-2
- Trend indicator: Small arrow icon with change percentage

**Arduino Connection Panel:**
- Prominent placement: sticky top-16 p-6 rounded-lg shadow-lg
- Connection status: Large icon + text (Connected/Disconnected)
- Device info: text-sm space-y-1
- Action button: Connect/Disconnect (w-full)
- Live data preview: Small streaming values below

**Exercise Progress View:**
- Timeline layout: space-y-4
- Each session: p-4 border-l-4 rounded-r-lg
- Session header: Date/time + duration
- Metrics grid: grid grid-cols-3 gap-4
- Completion badge: Absolute positioned top-right

### Forms

**Exercise Assignment Form:**
- Layout: max-w-2xl space-y-6
- Section groups: p-4 border rounded-lg
- Input fields: w-full p-3 rounded-lg border
- Number inputs (reps, angles): max-w-xs
- Submit area: flex justify-end gap-3 mt-8

**Patient Profile Form:**
- Two-column layout: grid grid-cols-1 md:grid-cols-2 gap-4
- Full-width fields: col-span-full (email, notes)
- Physiotherapist assignment: Searchable dropdown
- Action buttons: Sticky bottom with shadow

### Data Tables

**Patient List (Physio Dashboard):**
- Responsive table with card fallback on mobile
- Headers: p-4 text-left text-sm font-semibold uppercase
- Rows: p-4 border-b hover:bg-opacity-50 transition
- Columns: Name, Last Activity, Progress, Assigned Exercises, Actions
- Action buttons: Icon buttons (View, Edit, Assign)

**Reading History Table:**
- Compact rows: p-2 text-sm
- Alternating row treatment for readability
- Monospace font for numerical data
- Timestamp column: Relative time (2 mins ago)
- Expandable rows for full data details

### Modals & Overlays

**Exercise Assignment Modal:**
- Size: max-w-3xl
- Layout: Fixed positioning with backdrop blur
- Header: p-6 border-b (Title + Close button)
- Body: p-6 max-h-[70vh] overflow-y-auto
- Footer: p-6 border-t flex justify-end gap-3

**Confirmation Dialogs:**
- Size: max-w-md
- Layout: p-6 text-center
- Icon: Large warning/success icon mb-4
- Actions: flex justify-center gap-3 mt-6

### Status Indicators

**Connection Status:**
- Pill shape: px-3 py-1 rounded-full text-xs font-medium
- With pulse animation for "connected" state
- Placement: Top-right of relevant sections

**Exercise Status Badges:**
- Sizes: Small (px-2 py-1 text-xs), Medium (px-3 py-1 text-sm)
- States: Assigned, In Progress, Completed, Overdue
- With appropriate iconography

**n8n Webhook Status:**
- Small indicator dot (w-2 h-2 rounded-full)
- Label: text-xs
- Placement: Next to timestamp in reading entries

---

## Physiotherapist Dashboard Layout

**Structure:**
```
Top Nav (h-16)
├── Logo/Title
├── Dashboard indicator
└── User menu

Main Container (flex)
├── Sidebar (w-64)
│   ├── Navigation links
│   └── Recent patients list
└── Content Area (flex-1)
    ├── Stats Overview (grid grid-cols-4 gap-4 mb-8)
    │   └── Metric cards (Total Patients, Active Today, etc.)
    ├── Patient Management Section
    │   ├── Section header with "Add Patient" button
    │   └── Patient cards grid (grid-cols-3 gap-4)
    └── Recent Activity Feed (mt-8)
        └── Timeline of patient updates
```

**Patient Detail View (when selected):**
- Full-width layout with back button
- Patient header: Name, status, last active (p-6)
- Three-column content:
  1. Assigned exercises list
  2. Live readings panel (if device connected)
  3. Progress charts and history

---

## Patient Dashboard Layout

**Structure:**
```
Top Nav (h-16)
├── Logo
├── Physiotherapist info chip
└── User menu

Hero Section (py-12)
├── Arduino Connection Card (max-w-md mx-auto)
│   ├── Device status display
│   ├── Connect button
│   └── Live readings preview

Main Content (max-w-6xl mx-auto px-4)
├── Assigned Exercises Section (mb-12)
│   ├── Section header
│   └── Exercise cards grid (grid-cols-2 gap-6)
└── Progress History (mb-12)
    ├── Filter controls
    └── Sessions timeline
```

**Active Exercise View (during session):**
- Full-screen overlay with semi-transparent backdrop
- Central focus: Large live angle display (text-8xl)
- Bottom panel: Roll, Pitch, Yaw values
- Progress indicators: Rep counter, target ranges
- Prominent Stop/Pause button

---

## Responsive Breakpoints

**Mobile (default):**
- Single column layouts
- Collapsible navigation
- Stacked form fields
- Full-width cards

**Tablet (md: 768px):**
- Two-column grids where appropriate
- Side-by-side form fields
- Expanded navigation

**Desktop (lg: 1024px):**
- Three-column content grids
- Persistent sidebar
- Multi-column data tables
- Split-view layouts

---

## Animations

**Minimal, Purposeful Motion:**
- Transition duration: 200ms for interactions, 300ms for state changes
- Page transitions: Fade in (opacity 0 to 1)
- Card hover: shadow-md to shadow-lg, transform scale-[1.01]
- Live data updates: Subtle pulse on value change
- Connection status: Breathing animation for "connecting" state
- No scroll-triggered animations
- No decorative motion

---

## Images

**Hero Section (Patient Dashboard):**
- **Large hero image**: Physical therapy session showing patient using monitoring device
- Dimensions: Full-width, h-64 md:h-80
- Treatment: Subtle gradient overlay (bottom to top) for text readability
- Content overlay: Centered text with blurred button backgrounds

**Empty States:**
- Illustration or icon for "No exercises assigned yet"
- Illustration for "No device connected"
- Dimensions: max-w-sm mx-auto
- Placement: Centered in empty sections with text-center message below

**Patient Profile:**
- Avatar placeholder or uploaded image
- Dimensions: w-16 h-16 rounded-full (list view), w-32 h-32 (detail view)
- Default: Initials on solid background

---

## Accessibility Implementation

- Semantic HTML throughout (nav, main, section, article)
- ARIA labels on all interactive elements
- Focus indicators: ring-2 ring-offset-2 on all focusable elements
- Keyboard navigation: Tab order follows visual hierarchy
- Form labels: Always visible, never placeholder-only
- Error states: Icon + text + aria-live announcements
- Skip navigation link for keyboard users
- Minimum touch target: 44x44px for all interactive elements
- Alt text for all images and icons
- Consistent heading hierarchy (h1 → h2 → h3)