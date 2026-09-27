import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiUsers, FiClock } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import AppointmentCard from '../components/AppointmentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Notification';
import * as api from '../services/api';

const sections = [
  {
    label: 'Doctor',
    links: [
      { to: '/doctor/dashboard', label: 'Overview', icon: <FiHome />, end: true },
      { to: '/doctor/appointments', label: 'Appointments', icon: <FiCalendar /> },
      { to: '/doctor/patients', label: 'Patients', icon: <FiUsers /> },
      { to: '/doctor/availability', label: 'Availability', icon: <FiClock /> },
    ],
  },
];

const todayStr = new Date().toISOString().split('T')[0];

export function DoctorDashboardHome() {
  const { user } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [a, p] = await Promise.all([api.getAppointmentsForDoctor(user.doctorId), api.getPatients()]);
    setAppointments(a);
    setPatients(p);
    setLoading(false);
  }

  useEffect(() => { load(); }, [user.doctorId]);

  if (loading) return <LoadingSpinner />;

  const patientName = (id) => patients.find((p) => p.id === id)?.name || 'Patient';
  const today = appointments.filter((a) => a.date === todayStr && a.status !== 'cancelled');
  const requests = appointments.filter((a) => a.status === 'requested');
  const upcoming = appointments.filter((a) => a.status === 'upcoming');

  async function accept(appt) {
    await api.updateAppointment(appt.id, { status: 'upcoming' });
    notify('Appointment confirmed.', 'success');
    load();
  }
  async function reject(appt) {
    await api.updateAppointment(appt.id, { status: 'cancelled' });
    notify('Appointment declined.', 'info');
    load();
  }

  return (
    <div className="stagger">
      <div className="dash-header">
        <h1>Good to see you, {user.name}</h1>
        <p className="text-muted">Here's your schedule at a glance.</p>
      </div>

      <div className="grid grid-4 mb-24 stagger">
        <DashboardCard icon={<FiCalendar />} label="Today's appointments" value={today.length} color="var(--color-primary)" />
        <DashboardCard icon={<FiClock />} label="Pending requests" value={requests.length} color="var(--color-warning)" />
        <DashboardCard icon={<FiUsers />} label="Upcoming" value={upcoming.length} color="var(--color-navy)" />
        <DashboardCard icon={<FiHome />} label="Total appointments" value={appointments.length} color="var(--color-success)" />
      </div>

      <div className="card mb-24">
        <div className="flex justify-between items-center mb-16">
          <h3 style={{ margin: 0 }}>Appointment requests</h3>
          <button className="text-sm" style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => navigate('/doctor/appointments')}>View all</button>
        </div>
        {requests.length === 0 ? (
          <p className="text-muted text-sm">No pending requests.</p>
        ) : (
          <div className="flex-col gap-16">
            {requests.map((a) => (
              <AppointmentCard key={a.id} appointment={a} counterpartName={patientName(a.patientId)} onAccept={accept} onReject={reject} />
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Today's appointments</h3>
        {today.length === 0 ? (
          <p className="text-muted text-sm">Nothing scheduled for today.</p>
        ) : (
          <div className="flex-col gap-16">
            {today.map((a) => (
              <AppointmentCard key={a.id} appointment={a} counterpartName={patientName(a.patientId)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  return (
    <div className="dash-layout">
      <Sidebar sections={sections} />
      <div className="dash-content">
        <PageTransition><Outlet /></PageTransition>
      </div>
    </div>
  );
}
