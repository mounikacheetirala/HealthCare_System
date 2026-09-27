import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Notification';
import LoadingSpinner from '../components/LoadingSpinner';
import * as api from '../services/api';

export default function PatientProfile() {
  const { user } = useAuth();
  const notify = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getPatientById(user.patientId).then(setForm);
  }, [user.patientId]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await api.updatePatient(user.patientId, form);
    setSaving(false);
    notify('Profile updated.', 'success');
  }

  if (!form) return <LoadingSpinner />;

  return (
    <div>
      <div className="dash-header">
        <h1>My Profile</h1>
        <p className="text-muted">Keep your personal and medical details up to date.</p>
      </div>

      <form className="card" style={{ maxWidth: 640 }} onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="p-name">Full name</label>
            <input id="p-name" className="input" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="p-email">Email</label>
            <input id="p-email" className="input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="p-phone">Phone</label>
            <input id="p-phone" className="input" value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="p-age">Age</label>
            <input id="p-age" className="input" type="number" value={form.age || ''} onChange={(e) => update('age', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="p-gender">Gender</label>
            <select id="p-gender" className="input" value={form.gender || ''} onChange={(e) => update('gender', e.target.value)}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="p-blood">Blood group</label>
            <input id="p-blood" className="input" value={form.bloodGroup || ''} onChange={(e) => update('bloodGroup', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="p-address">Address</label>
          <input id="p-address" className="input" value={form.address || ''} onChange={(e) => update('address', e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
      </form>
    </div>
  );
}
