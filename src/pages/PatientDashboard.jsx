import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FiCalendar, FiClipboard, FiFileText, FiUser, FiPlusCircle, FiSearch } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import AppointmentCard from '../components/AppointmentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const sections = [
  {
    label: 'Patient',
    links: [
      { to: '/patient/dashboard', label: 'Overview', icon: <FiUser />, end: true },
      { to: '/patient/appointments', label: 'My Appointments', icon: <FiCalendar /> },
      { to: '/patient/medical-history', label: 'Medical History', icon: <FiClipboard /> },
      { to: '/patient/prescriptions', label: 'Prescriptions', icon: <FiFileText /> },
    ],
  },
];

export function PatientDashboardHome() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAppointmentsForPatient(user.patientId),
      api.getPrescriptionsForPatient(user.patientId),
      api.getDoctors(),
    ]).then(([a, p, d]) => {
      setAppointments(a);
      setPrescriptions(p);
      setDoctors(d);
      setLoading(false);
    });
  }, [user.patientId]);

  if (loading) return <LoadingSpinner />;

  const doctorName = (id) => doctors.find((d) => d.id === id)?.name || 'Doctor';
  const upcoming = appointments.filter((a) => a.status === 'upcoming' || a.status === 'requested');
  const nextAppt = [...upcoming].sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <div className="stagger">
      <div className="dash-header">
        <h1>Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-muted">Here's what's happening with your care.</p>
      </div>

      <div className="grid grid-4 mb-24 stagger">
        <DashboardCard icon={<FiCalendar />} label="Total appointments" value={appointments.length} color="var(--color-primary)" />
        <DashboardCard icon={<FiClipboard />} label="Upcoming" value={upcoming.length} color="var(--color-navy)" />
        <DashboardCard icon={<FiFileText />} label="Prescriptions" value={prescriptions.length} color="var(--color-accent)" />
        <DashboardCard icon={<FiUser />} label="Completed visits" value={appointments.filter((a) => a.status === 'completed').length} color="var(--color-success)" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="flex justify-between items-center mb-16">
            <h3 style={{ margin: 0 }}>Upcoming appointment</h3>
            <Link to="/patient/appointments" className="text-sm">View all</Link>
          </div>
          {nextAppt ? (
            <AppointmentCard appointment={nextAppt} counterpartName={doctorName(nextAppt.doctorId)} />
          ) : (
            <div className="empty-state">
              <div className="icon">📅</div>
              <p>No upcoming appointments yet.</p>
              <Link to="/doctors" className="btn btn-primary btn-sm">Find a doctor</Link>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="mt-0" style={{ marginTop: 0 }}>Quick actions</h3>
          <div className="flex-col gap-12">
            <Link to="/doctors" className="btn btn-outline btn-block"><FiSearch /> Find a doctor</Link>
            <Link to="/patient/appointments" className="btn btn-outline btn-block"><FiCalendar /> Manage appointments</Link>
            <Link to="/patient/prescriptions" className="btn btn-outline btn-block"><FiFileText /> View prescriptions</Link>
            <Link to="/patient/profile" className="btn btn-outline btn-block"><FiPlusCircle /> Update profile</Link>
          </div>
        </div>
      </div>

      <div className="card mt-24">
        <div className="flex justify-between items-center mb-16">
          <h3 style={{ margin: 0 }}>Recent prescriptions</h3>
          <Link to="/patient/prescriptions" className="text-sm">View all</Link>
        </div>
        {prescriptions.length === 0 ? (
          <p className="text-muted text-sm">No prescriptions on file yet.</p>
        ) : (
          <div className="table-wrap" style={{ border: 'none' }}>
            <table className="data-table">
              <thead><tr><th>Date</th><th>Doctor</th><th>Medicines</th></tr></thead>
              <tbody>
                {prescriptions.slice(0, 4).map((p) => (
                  <tr key={p.id}>
                    <td>{p.date}</td>
                    <td>{doctorName(p.doctorId)}</td>
                    <td>{p.medicines.map((m) => m.name).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  return (
    <div className="dash-layout">
      <Sidebar sections={sections} />
      <div className="dash-content">
        <PageTransition><Outlet /></PageTransition>
      </div>
    </div>
  );
}
