import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Notification';

const ROLES = [
  { key: 'patient', label: 'Patient' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'admin', label: 'Admin' },
];

const DASH_PATH = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
};

const DEMO_CREDENTIALS = {
  patient: { email: 'kiran.patel@example.com', password: 'patient123' },
  doctor: { email: 'priya.sharma@meridian.health', password: 'doctor123' },
  admin: { email: 'admin@meridian.health', password: 'admin123' },
};

export default function Login() {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await login({ email, password, role, remember });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    notify(`Welcome back, ${res.user.name.split(' ')[0]}!`, 'success');
    const target = location.state?.from?.pathname || DASH_PATH[role];
    navigate(target, { replace: true });
  }

  function fillDemo() {
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Log in to Meridian Health</h2>
        <p className="text-sm mb-16">Access your dashboard as a patient, doctor, or admin.</p>

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

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" className="input" required
              value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" className="input" required
              value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="flex justify-between items-center mb-16">
            <label className="checkbox-row">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm">Forgot password?</Link>
          </div>
          <button className={`btn btn-primary btn-block ${submitting ? 'is-loading' : ''}`} type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <button type="button" className="btn btn-ghost btn-block mt-8" onClick={fillDemo}>
          Fill demo {role} credentials
        </button>

        <div className="auth-foot">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
