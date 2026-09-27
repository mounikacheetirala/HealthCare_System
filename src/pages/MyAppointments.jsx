import { useEffect, useState } from 'react';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentForm from '../components/AppointmentForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Notification';
import * as api from '../services/api';

const TABS = [
  { key: 'upcoming', label: 'Upcoming', statuses: ['upcoming', 'requested'] },
  { key: 'completed', label: 'Completed', statuses: ['completed'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['cancelled'] },
];

export default function MyAppointments() {
  const { user } = useAuth();
  const notify = useToast();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [rescheduling, setRescheduling] = useState(null);

  async function load() {
    setLoading(true);
    const [a, d] = await Promise.all([api.getAppointmentsForPatient(user.patientId), api.getDoctors()]);
    setAppointments(a);
    setDoctors(d);
    setLoading(false);
  }

  useEffect(() => { load(); }, [user.patientId]);

  const doctorName = (id) => doctors.find((d) => d.id === id)?.name || 'Doctor';
  const doctor = (id) => doctors.find((d) => d.id === id);

  async function handleCancel(appt) {
    await api.updateAppointment(appt.id, { status: 'cancelled' });
    notify('Appointment cancelled.', 'info');
    load();
  }

  async function handleRescheduleSubmit(values) {
    await api.updateAppointment(rescheduling.id, { ...values, status: 'requested' });
    notify('Appointment rescheduled — awaiting confirmation.', 'success');
    setRescheduling(null);
    load();
  }

  const activeStatuses = TABS.find((t) => t.key === tab).statuses;
  const list = appointments.filter((a) => activeStatuses.includes(a.status));

  return (
    <div>
      <div className="dash-header">
        <h1>My Appointments</h1>
        <p className="text-muted">Track, reschedule, or cancel your visits.</p>
      </div>

      <div className="tab-row">
        {TABS.map((t) => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label} ({appointments.filter((a) => t.statuses.includes(a.status)).length})
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        list.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🗓️</div>
            <p>No {tab} appointments.</p>
          </div>
        ) : (
          <div className="flex-col gap-16 stagger">
            {list.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                counterpartName={doctorName(a.doctorId)}
                onCancel={tab === 'upcoming' ? handleCancel : undefined}
                onReschedule={tab === 'upcoming' ? () => setRescheduling(a) : undefined}
              />
            ))}
          </div>
        )
      )}

      <Modal open={!!rescheduling} title="Reschedule appointment" onClose={() => setRescheduling(null)}>
        {rescheduling && (
          <AppointmentForm
            doctor={doctor(rescheduling.doctorId)}
            initialValues={rescheduling}
            onSubmit={handleRescheduleSubmit}
            submitLabel="Save new time"
          />
        )}
      </Modal>
    </div>
  );
}
