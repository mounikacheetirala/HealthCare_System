import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import NotFound from './pages/NotFound';

import PatientDashboard, { PatientDashboardHome } from './pages/PatientDashboard';
import MyAppointments from './pages/MyAppointments';
import MedicalHistory from './pages/MedicalHistory';
import Prescriptions from './pages/Prescriptions';
import PatientProfile from './pages/PatientProfile';

import DoctorDashboard, { DoctorDashboardHome } from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorPatients from './pages/DoctorPatients';
import DoctorAvailability from './pages/DoctorAvailability';

import AdminDashboard, { AdminDashboardHome } from './pages/AdminDashboard';
import AdminDoctors from './pages/AdminDoctors';
import AdminPatients from './pages/AdminPatients';
import AdminAppointments from './pages/AdminAppointments';

// Dashboards (/patient/*, /doctor/*, /admin/*) animate their own content area,
// so for those we only re-trigger the page transition when the *section* changes.
const DASHBOARD_SECTIONS = ['patient', 'doctor', 'admin'];
function pageKey(pathname) {
  const section = pathname.split('/')[1];
  return DASHBOARD_SECTIONS.includes(section) ? section : pathname;
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <PageTransition routeKey={pageKey}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/book/:doctorId" element={<BookAppointment />} />

            {/* Patient */}
            <Route
              path="/patient"
              element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>}
            >
              <Route path="dashboard" element={<PatientDashboardHome />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="medical-history" element={<MedicalHistory />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="profile" element={<PatientProfile />} />
            </Route>

            {/* Doctor */}
            <Route
              path="/doctor"
              element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>}
            >
              <Route path="dashboard" element={<DoctorDashboardHome />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="availability" element={<DoctorAvailability />} />
            </Route>

            {/* Admin */}
            <Route
              path="/admin"
              element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}
            >
              <Route path="dashboard" element={<AdminDashboardHome />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="appointments" element={<AdminAppointments />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
