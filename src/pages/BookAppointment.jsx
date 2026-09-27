import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import AppointmentForm from '../components/AppointmentForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Notification';
import * as api from '../services/api';

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map((p) => p[0]).slice(0, 2).join('');
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(null);
  const { user } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.getDoctorById(doctorId).then((d) => { setDoctor(d); setLoading(false); });
  }, [doctorId]);

  async function handleSubmit(values) {
    if (!user) {
      notify('Please log in as a patient to book an appointment.', 'info');
      navigate('/login');
      return;
    }
    if (user.role !== 'patient') {
      notify('Only patient accounts can book appointments.', 'error');
      return;
    }
    const appt = await api.createAppointment({
      patientId: user.patientId,
      doctorId: doctor.id,
      ...values,
      status: 'requested',
    });
    setConfirmed(appt);
    notify('Appointment request sent!', 'success');
  }

  if (loading) return <LoadingSpinner />;
  if (!doctor) {
    return (
      <div className="section container">
        <div className="empty-state"><h4>Doctor not found</h4></div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1>Book an appointment</h1>

        <div className="card mb-24">
          <div className="flex items-center gap-16">
            <div className="doctor-avatar">{initials(doctor.name)}</div>
            <div>
              <h4 style={{ margin: 0 }}>{doctor.name}</h4>
              <div className="doctor-spec">{doctor.specialization}</div>
              <div className="text-sm text-muted">₹{doctor.fee} per visit · {doctor.hospital}</div>
            </div>
          </div>
        </div>

        {confirmed ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <FiCheckCircle className="anim-check" size={40} color="var(--color-success)" />
            <h3 className="mt-16">Request sent to {doctor.name}</h3>
            <p>
              You're requesting {confirmed.date} at {confirmed.time} ({confirmed.type}). You'll get a notification
              once the doctor confirms.
            </p>
            <div className="flex gap-8" style={{ justifyContent: 'center' }}>
              <Link to="/patient/appointments" className="btn btn-primary">View my appointments</Link>
              <Link to="/doctors" className="btn btn-outline">Browse more doctors</Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <AppointmentForm doctor={doctor} onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </section>
  );
}
