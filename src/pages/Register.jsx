import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Notification';

const ROLES = [
  { key: 'patient', label: 'Patient' },
  { key: 'doctor', label: 'Doctor' },
];

const DASH_PATH = { patient: '/patient/dashboard', doctor: '/doctor/dashboard' };

export default function Register() {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!/^[\d\s+()-]{7,}$/.test(form.phone)) next.phone = 'Enter a valid phone number.';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    const res = await register({ ...form, role });
    setSubmitting(false);
    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    notify('Account created — welcome to Meridian Health!', 'success');
    navigate(DASH_PATH[role], { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="text-sm mb-16">Register as a patient to book care, or as a doctor to see patients.</p>

        <div className="auth-role-tabs">
          <span
            className="auth-role-pill"
            style={{ '--n': ROLES.length, '--i': ROLES.findIndex((r) => r.key === role) }}
            aria-hidden="true"
          />
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`auth-role-tab ${role === r.key ? 'active' : ''}`}
              onClick={() => setRole(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {serverError && <div className="auth-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="reg-name">Full name</label>
            <input id="reg-name" className={`input ${errors.name ? 'has-error' : ''}`}
              value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Doe" />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div className="field">
            <label htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email" className={`input ${errors.email ? 'has-error' : ''}`}
              value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div className="field">
            <label htmlFor="reg-phone">Phone</label>
            <input id="reg-phone" className={`input ${errors.phone ? 'has-error' : ''}`}
              value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" className={`input ${errors.password ? 'has-error' : ''}`}
                value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="••••••••" />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
            <div className="field">
              <label htmlFor="reg-confirm">Confirm password</label>
              <input id="reg-confirm" type="password" className={`input ${errors.confirm ? 'has-error' : ''}`}
                value={form.confirm} onChange={(e) => update('confirm', e.target.value)} placeholder="••••••••" />
              {errors.confirm && <div className="field-error">{errors.confirm}</div>}
            </div>
          </div>
          <button className={`btn btn-primary btn-block ${submitting ? 'is-loading' : ''}`} type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
