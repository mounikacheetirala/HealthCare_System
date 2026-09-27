# Meridian Health — Healthcare Management System

A responsive React.js healthcare management app: patients find doctors and book
appointments, doctors manage their schedule and patient records, and admins
oversee the whole system.

## Tech stack

React 18 (functional components + hooks), React Router DOM v6, Axios (available
for real API use), React Icons, Vite, plain CSS (custom design system — no
framework), and a **localStorage-backed mock backend** that stands in for a
JSON Server / REST API so the whole app works offline, with no server to run.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## Demo logins

The app seeds itself with demo data the first time it runs (stored in your
browser's localStorage under the key `meridian_health_db_v1`). Use the "Fill
demo credentials" button on the login page, or these directly:

| Role    | Email                              | Password    |
|---------|-------------------------------------|-------------|
| Patient | kiran.patel@example.com             | patient123  |
| Doctor  | priya.sharma@meridian.health        | doctor123   |
| Admin   | admin@meridian.health               | admin123    |

You can also register a brand new patient or doctor account from the
Register page.

## Project structure

```
src/
├── components/     Reusable UI: Navbar, Sidebar, Footer, DoctorCard,
│                   AppointmentCard, PatientCard, PrescriptionCard,
│                   SearchBar, Modal, LoadingSpinner, ProtectedRoute,
│                   DashboardCard, Notification (toasts), AppointmentForm,
│                   + animation helpers: Reveal, CountUp, PageTransition,
│                   HeartbeatLine
├── hooks/          useInView (scroll trigger), useReducedMotion
├── pages/          Home, Login, Register, ForgotPassword, Doctors,
│                   DoctorDetails, BookAppointment, PatientDashboard +
│                   MyAppointments/MedicalHistory/Prescriptions/Profile,
│                   DoctorDashboard + Appointments/Patients/Availability,
│                   AdminDashboard + Doctors/Patients/Appointments, NotFound
├── context/        AuthContext.jsx — role-based auth & session
├── data/           mockData.js — seed data for every resource
├── services/       api.js — the mock API (Promise-based, localStorage-backed)
├── App.jsx         Routes, including nested/protected dashboard routes
├── index.css       Design tokens + base styles
├── animations.css  All motion (keyframes, transitions, stagger rules)
└── main.jsx        Entry point (Router + providers)
```

## Animations

All motion lives in `src/animations.css` plus a few small React helpers — there are no extra
dependencies. To switch every animation off, delete the `import './animations.css'` line in `main.jsx`.

| Where | What you'll see |
|---|---|
| Home hero | Headline, search and stats rise in one after another; a heartbeat (ECG) line draws across the bottom and a coral pulse travels along it; the feature panel slides in row by row; stats count up |
| Every page | Short fade/lift when the route changes (dashboard tabs only animate the content area, so the sidebar stays put) |
| Home sections | Scroll-reveal via `<Reveal>` — cards and chips cascade in the first time they enter the viewport |
| Dashboards | Stat cards cascade in and count up (`<CountUp>`), admin progress bars grow, sidebar shows a sliding accent on the active link |
| Lists & tables | Doctor cards, appointment lists, prescriptions and table rows cascade in (`.stagger` class) |
| Login / Register | Card rises in, a pill slides between the Patient / Doctor / Admin tabs, the submit button shows a spinner, invalid fields shake and their messages drop in |
| Modals | Fade + scale in and out (`Modal` keeps its content on screen while it fades out) |
| Toasts | Slide in, show a countdown bar, slide out (same 3.5 s lifetime as before) |
| Booking confirmation | The check-mark draws itself |
| Buttons, cards, chips, nav | Hover lift, press feedback, animated underline, navbar shadow after scrolling |

**Reduced motion:** if the visitor's OS is set to "reduce motion", entrances are skipped, numbers show their
final value immediately and looping effects (heartbeat pulse, emergency ring) are hidden.

**Adding your own:** put `className="stagger"` on any container to cascade its children in, wrap a block in
`<Reveal>` (or `<Reveal stagger>`) to animate it on scroll, use `<CountUp end={42} />` for numbers, and
add `is-loading` to a `.btn` to show its spinner. Tune stagger speed with `style={{ '--step': '40ms' }}`.

## How the mock backend works

`src/services/api.js` exposes async functions (`getDoctors`, `createAppointment`,
`updateDoctor`, etc.) that read/write a single JSON blob in `localStorage`,
seeded from `src/data/mockData.js` on first load. Every function returns a
Promise with a short artificial delay, and the shapes mirror what you'd get
back from a JSON Server serving `/doctors`, `/patients`, `/appointments`,
`/prescriptions`, `/medicalHistory`, `/notifications`, and `/specializations`.

**To swap in a real backend later:** replace the bodies of the functions in
`api.js` with real `axios` calls (e.g. `axios.get('/api/doctors')`) — every
page already calls these functions the same way, so no other code needs to
change.

To wipe all demo data and reseed, open your browser console on the app and run:
```js
localStorage.removeItem('meridian_health_db_v1');
localStorage.removeItem('meridian_health_session');
```
then refresh.

## Feature checklist

- Role-based auth (patient / doctor / admin) with protected routes and
  redirect-after-login
- Doctor search, specialty filtering, sorting, and pagination
- Doctor profile pages with available time slots
- Appointment booking, rescheduling, and cancellation
- Doctor-side accept/reject of requests, marking visits complete with
  diagnosis + prescription entry (which writes to the patient's medical
  history and prescriptions automatically)
- Patient dashboard: upcoming appointment, stats, recent prescriptions,
  quick actions
- Medical history and prescription views for patients
- Admin dashboard with system-wide stats and simple bar visualizations
- Full CRUD for doctors and patients from the admin panel, plus doctor
  approval/deactivation workflow
- Responsive layout down to mobile (collapsible nav, responsive sidebar,
  responsive grids/tables)
- Loading states and empty states throughout

## Notes

This is a frontend demo: authentication is simplified (plaintext demo
passwords in seed data, session stored in localStorage) and is **not**
suitable for production use as-is. Swap in a real backend and proper auth
(hashed passwords, JWT/session tokens, HTTPS) before handling real patient
data.
