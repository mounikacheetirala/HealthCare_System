import { useEffect, useState } from 'react';
import PatientCard from '../components/PatientCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function DoctorPatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    Promise.all([api.getPatients(), api.getAppointmentsForDoctor(user.doctorId)]).then(([p, a]) => {
      setAppointments(a);
      const seenIds = new Set(a.map((appt) => appt.patientId));
      setPatients(p.filter((pt) => seenIds.has(pt.id)));
      setLoading(false);
    });
  }, [user.doctorId]);

  async function openPatient(patient) {
    setViewing(patient);
    const h = await api.getMedicalHistoryForPatient(patient.id);
    setHistory(h);
  }

  const visitCount = (patientId) => appointments.filter((a) => a.patientId === patientId).length;

  return (
    <div>
      <div className="dash-header">
        <h1>My Patients</h1>
        <p className="text-muted">Everyone who has booked an appointment with you.</p>
      </div>

      {loading ? <LoadingSpinner /> : patients.length === 0 ? (
        <div className="empty-state"><div className="icon">🧑‍⚕️</div><p>No patients yet.</p></div>
      ) : (
        <div className="flex-col gap-16 stagger">
          {patients.map((p) => (
            <PatientCard
              key={p.id}
              patient={p}
              actions={(
                <>
                  <span className="badge badge-neutral">{visitCount(p.id)} visit{visitCount(p.id) !== 1 ? 's' : ''}</span>
                  <button className="btn btn-outline btn-sm" onClick={() => openPatient(p)}>View history</button>
                </>
              )}
            />
          ))}
        </div>
      )}

      <Modal open={!!viewing} title={`Medical history — ${viewing?.name || ''}`} onClose={() => setViewing(null)}>
        {viewing && (
          <div className="flex-col gap-16">
            <div className="grid grid-2">
              <div><span className="text-muted text-sm">Age</span><div>{viewing.age || '—'}</div></div>
              <div><span className="text-muted text-sm">Gender</span><div>{viewing.gender || '—'}</div></div>
              <div><span className="text-muted text-sm">Blood group</span><div>{viewing.bloodGroup || '—'}</div></div>
              <div><span className="text-muted text-sm">Phone</span><div>{viewing.phone || '—'}</div></div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
            {history.length === 0 ? (
              <p className="text-muted text-sm">No history recorded yet.</p>
            ) : history.map((h) => (
              <div key={h.id} className="card-flat" style={{ border: '1px solid var(--border-color)' }}>
                <div className="flex justify-between">
                  <strong>{h.diagnosis}</strong>
                  <span className="text-muted text-sm">{h.date}</span>
                </div>
                <p className="text-sm" style={{ margin: '6px 0 0' }}>{h.notes}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
