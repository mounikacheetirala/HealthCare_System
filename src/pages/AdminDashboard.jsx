import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiHome, FiUserCheck, FiUsers, FiCalendar } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import * as api from '../services/api';

const sections = [
  {
    label: 'Admin',
    links: [
      { to: '/admin/dashboard', label: 'Overview', icon: <FiHome />, end: true },
      { to: '/admin/doctors', label: 'Doctors', icon: <FiUserCheck /> },
      { to: '/admin/patients', label: 'Patients', icon: <FiUsers /> },
      { to: '/admin/appointments', label: 'Appointments', icon: <FiCalendar /> },
    ],
  },
];

export function AdminDashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([api.getDoctors(), api.getPatients(), api.getAppointments()]).then(([doctors, patients, appointments]) => {
      setStats({
        doctors: doctors.length,
        pendingDoctors: doctors.filter((d) => d.status === 'pending').length,
        patients: patients.length,
        appointments: appointments.length,
        completed: appointments.filter((a) => a.status === 'completed').length,
        cancelled: appointments.filter((a) => a.status === 'cancelled').length,
        requested: appointments.filter((a) => a.status === 'requested').length,
        bySpecialization: doctors.reduce((acc, d) => {
          acc[d.specialization] = (acc[d.specialization] || 0) + 1;
          return acc;
        }, {}),
      });
    });
  }, []);

  if (!stats) return <LoadingSpinner />;

  const maxSpec = Math.max(1, ...Object.values(stats.bySpecialization));

  return (
    <div className="stagger">
      <div className="dash-header">
        <h1>System Overview</h1>
        <p className="text-muted">A snapshot of Meridian Health right now.</p>
      </div>

      <div className="grid grid-4 mb-24 stagger">
        <DashboardCard icon={<FiUsers />} label="Total patients" value={stats.patients} color="var(--color-primary)" />
        <DashboardCard icon={<FiUserCheck />} label="Total doctors" value={stats.doctors} color="var(--color-navy)" />
        <DashboardCard icon={<FiCalendar />} label="Total appointments" value={stats.appointments} color="var(--color-accent)" />
        <DashboardCard icon={<FiHome />} label="Pending doctor approvals" value={stats.pendingDoctors} color="var(--color-warning)" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Appointment status</h3>
          <div className="flex-col gap-12 mt-16">
            {[
              ['Completed', stats.completed, 'var(--color-success)'],
              ['Requested', stats.requested, 'var(--color-warning)'],
              ['Cancelled', stats.cancelled, 'var(--color-danger)'],
            ].map(([label, val, color], i) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-8"><span>{label}</span><span>{val}</span></div>
                <div style={{ height: 8, borderRadius: 999, background: 'var(--color-surface-sunken)' }}>
                  <div className="bar-fill" style={{ height: '100%', width: `${stats.appointments ? (val / stats.appointments) * 100 : 0}%`, background: color, borderRadius: 999, animationDelay: `${300 + i * 120}ms` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Doctors by specialization</h3>
          <div className="flex-col gap-12 mt-16">
            {Object.entries(stats.bySpecialization).map(([spec, count], i) => (
              <div key={spec}>
                <div className="flex justify-between text-sm mb-8"><span>{spec}</span><span>{count}</span></div>
                <div style={{ height: 8, borderRadius: 999, background: 'var(--color-surface-sunken)' }}>
                  <div className="bar-fill" style={{ height: '100%', width: `${(count / maxSpec) * 100}%`, background: 'var(--color-primary)', borderRadius: 999, animationDelay: `${300 + i * 90}ms` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="dash-layout">
      <Sidebar sections={sections} />
      <div className="dash-content">
        <PageTransition><Outlet /></PageTransition>
      </div>
    </div>
  );
}
