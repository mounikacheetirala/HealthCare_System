import { useEffect, useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function MedicalHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMedicalHistoryForPatient(user.patientId),
      api.getDoctors(),
    ]).then(([h, d]) => {
      setHistory([...h].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setDoctors(d);
      setLoading(false);
    });
  }, [user.patientId]);

  const doctorName = (id) => doctors.find((d) => d.id === id)?.name || 'Doctor';

  return (
    <div>
      <div className="dash-header">
        <h1>Medical History</h1>
        <p className="text-muted">A record of your past visits, diagnoses, and notes.</p>
      </div>

      {loading ? <LoadingSpinner /> : history.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>No medical history recorded yet.</p>
        </div>
      ) : (
        <div className="flex-col gap-16 stagger">
          {history.map((h) => (
            <div key={h.id} className="card">
              <div className="flex justify-between items-center mb-16" style={{ flexWrap: 'wrap', gap: 8 }}>
                <h4 style={{ margin: 0 }}>{h.diagnosis}</h4>
                <div className="doctor-meta-row">
                  <span><FiCalendar /> {h.date}</span>
                  <span><FiUser /> {doctorName(h.doctorId)}</span>
                </div>
              </div>
              <p style={{ margin: 0 }}>{h.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
