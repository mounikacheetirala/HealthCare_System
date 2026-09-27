import { useEffect, useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Notification';
import * as api from '../services/api';

export default function DoctorAvailability() {
  const { user } = useAuth();
  const notify = useToast();
  const [doctor, setDoctor] = useState(null);
  const [newSlot, setNewSlot] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getDoctorById(user.doctorId).then(setDoctor);
  }, [user.doctorId]);

  async function toggleAvailable() {
    const updated = await api.updateDoctor(doctor.id, { available: !doctor.available });
    setDoctor(updated);
    notify(`You're now marked as ${updated.available ? 'available' : 'unavailable'}.`, 'success');
  }

  async function addSlot(e) {
    e.preventDefault();
    if (!newSlot.trim()) return;
    const slots = [...(doctor.slots || []), newSlot.trim()];
    setSaving(true);
    const updated = await api.updateDoctor(doctor.id, { slots });
    setDoctor(updated);
    setNewSlot('');
    setSaving(false);
  }

  async function removeSlot(slot) {
    const slots = doctor.slots.filter((s) => s !== slot);
    const updated = await api.updateDoctor(doctor.id, { slots });
    setDoctor(updated);
  }

  if (!doctor) return <LoadingSpinner />;

  return (
    <div>
      <div className="dash-header">
        <h1>Availability</h1>
        <p className="text-muted">Control whether patients can book you, and which time slots are open.</p>
      </div>

      <div className="card mb-24 flex justify-between items-center" style={{ maxWidth: 560 }}>
        <div>
          <h4 style={{ margin: 0 }}>Accepting new appointments</h4>
          <p className="text-sm" style={{ margin: 0 }}>Turn this off if you're fully booked or on leave.</p>
        </div>
        <button className={`btn ${doctor.available ? 'btn-primary' : 'btn-outline'}`} onClick={toggleAvailable}>
          {doctor.available ? 'Available' : 'Unavailable'}
        </button>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <h4 style={{ marginTop: 0 }}>Time slots</h4>
        <div className="chip-row mb-16">
          {(doctor.slots || []).length === 0 && <p className="text-muted text-sm">No slots added yet.</p>}
          {(doctor.slots || []).map((s) => (
            <span key={s} className="chip">
              {s}
              <button onClick={() => removeSlot(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }} aria-label={`Remove ${s}`}>
                <FiX />
              </button>
            </span>
          ))}
        </div>
        <form className="flex gap-8" onSubmit={addSlot}>
          <input className="input" placeholder="e.g. 03:00 PM" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} />
          <button className="btn btn-primary" type="submit" disabled={saving}><FiPlus /> Add</button>
        </form>
      </div>
    </div>
  );
}
