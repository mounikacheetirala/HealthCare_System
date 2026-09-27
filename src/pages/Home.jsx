import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiHeart, FiActivity, FiUsers, FiCalendar, FiPhoneCall,
  FiVideo, FiFileText, FiShield, FiAlertCircle,
} from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import HeartbeatLine from '../components/HeartbeatLine';
import * as api from '../services/api';

const SPEC_ICON = {
  Cardiologist: <FiHeart />,
  Dermatologist: <FiActivity />,
  Pediatrician: <FiUsers />,
  Neurologist: <FiActivity />,
  Orthopedic: <FiActivity />,
  'General Physician': <FiFileText />,
  Dentist: <FiActivity />,
  Psychiatrist: <FiActivity />,
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getDoctors(), api.getSpecializations()]).then(([d, s]) => {
      setDoctors(d);
      setSpecializations(s);
      setLoading(false);
    });
  }, []);

  const featured = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 3);

  function handleSearch(q) {
    navigate(`/doctors${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  }

  return (
    <>
      <section className="hero">
        <HeartbeatLine />
        <div className="hero-inner">
          <div className="hero-seq">
            <h1>Care that fits around your life, not the other way around.</h1>
            <p className="lead">
              Search trusted doctors by specialty, check real-time availability, and book an appointment
              in minutes — then keep every prescription and visit note in one place.
            </p>
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              placeholder="Search by doctor name or specialty"
            />
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num"><CountUp end={doctors.length} delay={250} suffix="+" /></div>
                <div className="hero-stat-label">Verified doctors</div>
              </div>
              <div>
                <div className="hero-stat-num"><CountUp end={12} delay={600} suffix="k+" /></div>
                <div className="hero-stat-label">Appointments booked</div>
              </div>
              <div>
                <div className="hero-stat-num"><CountUp end={4.7} decimals={1} delay={600} duration={1100} suffix="★" /></div>
                <div className="hero-stat-label">Average rating</div>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-art-row">
              <div className="hero-art-icon"><FiCalendar /></div>
              <div>
                <strong style={{ color: 'white' }}>Same-week booking</strong>
                <div style={{ fontSize: '0.85rem', color: 'rgba(244,248,247,0.7)' }}>Real-time slot availability</div>
              </div>
            </div>
            <div className="hero-art-row">
              <div className="hero-art-icon"><FiVideo /></div>
              <div>
                <strong style={{ color: 'white' }}>Video consultations</strong>
                <div style={{ fontSize: '0.85rem', color: 'rgba(244,248,247,0.7)' }}>From wherever you are</div>
              </div>
            </div>
            <div className="hero-art-row">
              <div className="hero-art-icon"><FiFileText /></div>
              <div>
                <strong style={{ color: 'white' }}>Digital prescriptions</strong>
                <div style={{ fontSize: '0.85rem', color: 'rgba(244,248,247,0.7)' }}>Always in your dashboard</div>
              </div>
            </div>
            <div className="hero-art-row">
              <div className="hero-art-icon"><FiShield /></div>
              <div>
                <strong style={{ color: 'white' }}>Verified specialists</strong>
                <div style={{ fontSize: '0.85rem', color: 'rgba(244,248,247,0.7)' }}>Reviewed by our medical board</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <h2>Popular specialties</h2>
              <p>Jump straight to the kind of care you need.</p>
            </div>
          </Reveal>
          <Reveal className="chip-row" stagger style={{ '--step': '40ms' }}>
            {(specializations.length ? specializations : []).map((s) => (
              <Link key={s.id} to={`/doctors?specialization=${encodeURIComponent(s.name)}`} className="chip">
                {SPEC_ICON[s.name] || <FiActivity />} {s.name}
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section-sunken">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <h2>Featured doctors</h2>
              <p>Highly rated specialists accepting new patients this week.</p>
            </div>
            <Link to="/doctors" className="btn btn-outline">See all doctors</Link>
          </Reveal>
          {loading ? <LoadingSpinner label="Finding great doctors…" /> : (
            <Reveal className="grid grid-3" stagger>
              {featured.map((d) => <DoctorCard key={d.id} doctor={d} />)}
            </Reveal>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <h2>How Meridian Health helps</h2>
              <p>Everything you need to manage your care, in one dashboard.</p>
            </div>
          </Reveal>
          <Reveal className="grid grid-4" stagger>
            <div className="card">
              <FiUsers size={22} color="var(--color-primary)" />
              <h4 className="mt-16">Find the right doctor</h4>
              <p className="text-sm">Filter by specialty, experience, rating, and fee to find a good fit fast.</p>
            </div>
            <div className="card">
              <FiCalendar size={22} color="var(--color-primary)" />
              <h4 className="mt-16">Book in a few taps</h4>
              <p className="text-sm">Pick an open slot, choose in-clinic or video, and get instant confirmation.</p>
            </div>
            <div className="card">
              <FiFileText size={22} color="var(--color-primary)" />
              <h4 className="mt-16">Track your history</h4>
              <p className="text-sm">Every diagnosis, prescription, and visit note stored and easy to revisit.</p>
            </div>
            <div className="card">
              <FiPhoneCall size={22} color="var(--color-primary)" />
              <h4 className="mt-16">Stay in touch</h4>
              <p className="text-sm">Get notified about upcoming visits, requests, and prescription updates.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="emergency">
        <div className="container">
          <Reveal className="emergency-banner">
            <div className="flex items-center gap-16">
              <span className="pulse-ring"><FiAlertCircle size={28} color="var(--color-danger)" /></span>
              <div>
                <strong>Having a medical emergency?</strong>
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                  Meridian Health is for scheduled, non-urgent care. If this is an emergency, call your local emergency number immediately.
                </p>
              </div>
            </div>
            <a href="tel:112" className="btn btn-danger">Call emergency: 112</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
