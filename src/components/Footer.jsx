import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: 'white', marginBottom: 12 }}>
              <span className="brand-mark">⚕</span> Meridian Health
            </div>
            <p style={{ color: 'rgba(244,248,247,0.7)', fontSize: '0.9rem' }}>
              Connecting patients with trusted doctors for appointments, prescriptions, and ongoing care — all in one place.
            </p>
          </div>
          <div>
            <h5>Patients</h5>
            <Link to="/doctors">Find a doctor</Link>
            <Link to="/register">Create account</Link>
            <Link to="/login">Log in</Link>
          </div>
          <div>
            <h5>Care team</h5>
            <Link to="/register">Join as a doctor</Link>
            <Link to="/login">Doctor login</Link>
          </div>
          <div>
            <h5>Support</h5>
            <a href="#emergency">Emergency contact</a>
            <a href="mailto:support@meridian.health">support@meridian.health</a>
            <a href="tel:+911234567890">+91 12345 67890</a>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Meridian Health. Built for demonstration purposes only — not a real medical service.
        </div>
      </div>
    </footer>
  );
}
