import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset your password</h2>
        <p className="text-sm mb-16">Enter your account email and we'll send you a reset link.</p>

        {sent ? (
          <div className="auth-error is-success" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            If an account exists for {email}, a reset link is on its way.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fp-email">Email</label>
              <input id="fp-email" type="email" className="input" required
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <button className="btn btn-primary btn-block" type="submit">Send reset link</button>
          </form>
        )}

        <div className="auth-foot">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
