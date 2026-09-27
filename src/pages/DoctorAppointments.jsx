import { useEffect, useState } from 'react';
import AppointmentCard from '../components/AppointmentCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Notification';
import * as api from '../services/api';

const TABS = [
  { key: 'requested', label: 'Requests' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const emptyNoteForm = { diagnosis: '', notes: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }] };

export default function DoctorAppointments() {
  const { user } = useAuth();
  const notify = useToast();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('requested');
  const [noteAppt, setNoteAppt] = useState(null);
  const [noteForm, setNoteForm] = useState(emptyNoteForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [a, p] = await Promise.all([api.getAppointmentsForDoctor(user.doctorId), api.getPatients()]);
    setAppointments(a);
    setPatients(p);
    setLoading(false);
  }
  useEffect(() => { load(); }, [user.doctorId]);

  const patientName = (id) => patients.find((p) => p.id === id)?.name || 'Patient';
  const list = appointments.filter((a) => a.status === tab);

  async function accept(a) { await api.updateAppointment(a.id, { status: 'upcoming' }); notify('Appointment confirmed.', 'success'); load(); }
  async function reject(a) { await api.updateAppointment(a.id, { status: 'cancelled' }); notify('Appointment declined.', 'info'); load(); }
  async function cancel(a) { await api.updateAppointment(a.id, { status: 'cancelled' }); notify('Appointment cancelled.', 'info'); load(); }

  function openComplete(appt) {
    setNoteAppt(appt);
    setNoteForm(emptyNoteForm);
  }

  function updateMedicine(index, field, value) {
    setNoteForm((f) => {
      const medicines = [...f.medicines];
      medicines[index] = { ...medicines[index], [field]: value };
      return { ...f, medicines };
    });
  }
  function addMedicineRow() {
    setNoteForm((f) => ({ ...f, medicines: [...f.medicines, { name: '', dosage: '', frequency: '', duration: '' }] }));
  }

  async function handleCompleteSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    await api.addMedicalHistoryEntry({
      patientId: noteAppt.patientId,
      doctorId: user.doctorId,
      date: today,
      diagnosis: noteForm.diagnosis,
      notes: noteForm.notes,
    });
    const medicines = noteForm.medicines.filter((m) => m.name.trim());
    if (medicines.length) {
      await api.addPrescription({
        patientId: noteAppt.patientId,
        doctorId: user.doctorId,
        appointmentId: noteAppt.id,
        date: today,
        medicines,
        notes: noteForm.notes,
      });
    }
    await api.updateAppointment(noteAppt.id, { status: 'completed' });
    setSaving(false);
    setNoteAppt(null);
    notify('Visit completed and recorded.', 'success');
    load();
  }

  return (
    <div>
      <div className="dash-header">
        <h1>Appointments</h1>
        <p className="text-muted">Confirm requests and manage your schedule.</p>
      </div>

      <div className="tab-row">
        {TABS.map((t) => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label} ({appointments.filter((a) => a.status === t.key).length})
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : list.length === 0 ? (
        <div className="empty-state"><div className="icon">🗓️</div><p>Nothing here.</p></div>
      ) : (
        <div className="flex-col gap-16 stagger">
          {list.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              counterpartName={patientName(a.patientId)}
              onAccept={tab === 'requested' ? accept : undefined}
              onReject={tab === 'requested' ? reject : undefined}
              onComplete={tab === 'upcoming' ? openComplete : undefined}
              onCancel={tab === 'upcoming' ? cancel : undefined}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!noteAppt}
        title={`Complete visit — ${noteAppt ? patientName(noteAppt.patientId) : ''}`}
        onClose={() => setNoteAppt(null)}
      >
        <form onSubmit={handleCompleteSubmit}>
          <div className="field">
            <label htmlFor="diagnosis">Diagnosis</label>
            <input id="diagnosis" className="input" required value={noteForm.diagnosis}
              onChange={(e) => setNoteForm((f) => ({ ...f, diagnosis: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="doc-notes">Notes for patient</label>
            <textarea id="doc-notes" className="input" value={noteForm.notes}
              onChange={(e) => setNoteForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>

          <label>Prescription (optional)</label>
          {noteForm.medicines.map((m, i) => (
            <div className="form-row mt-8" key={i}>
              <input className="input" placeholder="Medicine name" value={m.name} onChange={(e) => updateMedicine(i, 'name', e.target.value)} />
              <input className="input" placeholder="Dosage e.g. 500mg" value={m.dosage} onChange={(e) => updateMedicine(i, 'dosage', e.target.value)} />
              <input className="input" placeholder="Frequency" value={m.frequency} onChange={(e) => updateMedicine(i, 'frequency', e.target.value)} />
              <input className="input" placeholder="Duration" value={m.duration} onChange={(e) => updateMedicine(i, 'duration', e.target.value)} />
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm mt-8" onClick={addMedicineRow}>+ Add another medicine</button>

          <button type="submit" className="btn btn-primary btn-block mt-24" disabled={saving}>
            {saving ? 'Saving…' : 'Mark complete & save record'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
