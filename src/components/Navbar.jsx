import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const DASH_PATH = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Soft shadow appears once the page scrolls under the sticky header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">⚕</span>
          Meridian Health
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/doctors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>Find Doctors</NavLink>
          {user && (
            <NavLink to={DASH_PATH[user.role]} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>Dashboard</NavLink>
          )}
          {user?.role === 'patient' && (
            <NavLink to="/patient/appointments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>My Appointments</NavLink>
          )}

          <div className="flex gap-8" style={{ marginTop: 4 }}>
            {user ? (
              <>
                <span className="nav-link flex items-center gap-8" style={{ borderBottom: 'none' }}>
                  <FiUser /> {user.name.split(' ')[0]}
                </span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Log in</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </nav>

        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation">
          {open ? <FiX key="close" className="icon-swap" /> : <FiMenu key="menu" className="icon-swap" />}
        </button>
      </div>
    </header>
  );
}
