import { useState } from 'react';

export default function AppointmentForm({ doctor, initialValues, onSubmit, submitLabel = 'Confirm appointment' }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    date: initialValues?.date || today,
    time: initialValues?.time || doctor?.slots?.[0] || '',
    type: initialValues?.type || 'In-clinic',
    reason: initialValues?.reason || '',
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.date) next.date = 'Please select a date.';
    if (!form.time) next.time = 'Please select a time slot.';
    if (!form.reason || form.reason.trim().length < 5) next.reason = 'Tell the doctor a bit about your reason for visiting (5+ characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="appt-date">Date</label>
          <input
            id="appt-date"
            type="date"
            className={`input ${errors.date ? 'has-error' : ''}`}
            min={today}
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
          {errors.date && <div className="field-error">{errors.date}</div>}
        </div>
        <div className="field">
          <label htmlFor="appt-time">Available time</label>
          <select
            id="appt-time"
            className={`input ${errors.time ? 'has-error' : ''}`}
            value={form.time}
            onChange={(e) => update('time', e.target.value)}
          >
            <option value="">Select a slot</option>
            {(doctor?.slots?.length ? doctor.slots : ['09:00 AM', '11:00 AM', '02:00 PM']).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.time && <div className="field-error">{errors.time}</div>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="appt-type">Appointment type</label>
        <select id="appt-type" className="input" value={form.type} onChange={(e) => update('type', e.target.value)}>
          <option>In-clinic</option>
          <option>Video call</option>
          <option>Phone call</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="appt-reason">Reason for visit</label>
        <textarea
          id="appt-reason"
          className={`input ${errors.reason ? 'has-error' : ''}`}
          placeholder="Briefly describe your symptoms or reason for the visit"
          value={form.reason}
          onChange={(e) => update('reason', e.target.value)}
        />
        {errors.reason && <div className="field-error">{errors.reason}</div>}
      </div>

      <button type="submit" className="btn btn-primary btn-block">{submitLabel}</button>
    </form>
  );
}
