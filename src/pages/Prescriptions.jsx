import { useEffect, useState } from 'react';
import PrescriptionCard from '../components/PrescriptionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getPrescriptionsForPatient(user.patientId),
      api.getDoctors(),
    ]).then(([p, d]) => {
      setPrescriptions([...p].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setDoctors(d);
      setLoading(false);
    });
  }, [user.patientId]);

  const doctorName = (id) => doctors.find((d) => d.id === id)?.name || 'Doctor';

  return (
    <div>
      <div className="dash-header">
        <h1>Prescriptions</h1>
        <p className="text-muted">Every prescription your doctors have issued you.</p>
      </div>

      {loading ? <LoadingSpinner /> : prescriptions.length === 0 ? (
        <div className="empty-state">
          <div className="icon">💊</div>
          <p>No prescriptions on file yet.</p>
        </div>
      ) : (
        <div className="flex-col gap-16 stagger">
          {prescriptions.map((p) => (
            <PrescriptionCard key={p.id} prescription={p} doctorName={doctorName(p.doctorId)} />
          ))}
        </div>
      )}
    </div>
  );
}
