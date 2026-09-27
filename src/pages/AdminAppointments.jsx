import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Notification';
import * as api from '../services/api';

const STATUS_BADGE = {
  upcoming: 'badge-success',
  requested: 'badge-warning',
  completed: 'badge-neutral',
  cancelled: 'badge-danger',
};

export default function AdminAppointments() {
  const notify = useToast();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function load() {
    setLoading(true);
    const [a, d, p] = await Promise.all([api.getAppointments(), api.getDoctors(), api.getPatients()]);
    setAppointments(a);
    setDoctors(d);
    setPatients(p);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const doctorName = (id) => doctors.find((d) => d.id === id)?.name || 'Unknown';
  const patientName = (id) => patients.find((p) => p.id === id)?.name || 'Unknown';
  const list = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  async function handleDelete() {
    await api.deleteAppointment(confirmDelete.id);
    notify('Appointment record removed.', 'info');
    setConfirmDelete(null);
    load();
  }

  return (
    <div>
      <div className="dash-header">
        <h1>All Appointments</h1>
        <p className="text-muted">Full visibility into every appointment across the system.</p>
      </div>

      <div className="chip-row mb-16">
        {['all', 'requested', 'upcoming', 'completed', 'cancelled'].map((s) => (
          <button key={s} className={`chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id}>
                  <td>{patientName(a.patientId)}</td>
                  <td>{doctorName(a.doctorId)}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>{a.type}</td>
                  <td><span className={`badge ${STATUS_BADGE[a.status] || 'badge-neutral'}`}>{a.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete(a)}><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!confirmDelete}
        title="Remove appointment record"
        onClose={() => setConfirmDelete(null)}
        footer={(
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Remove</button>
          </>
        )}
      >
        <p>This permanently deletes the appointment record. Continue?</p>
      </Modal>
    </div>
  );
}
