import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiMapPin, FiAward, FiClock, FiArrowLeft } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import * as api from '../services/api';

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map((p) => p[0]).slice(0, 2).join('');
}

export default function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getDoctorById(id).then((d) => { setDoctor(d); setLoading(false); });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!doctor) {
    return (
      <div className="section container">
        <div className="empty-state">
          <h4>Doctor not found</h4>
          <Link to="/doctors" className="btn btn-outline mt-16">Back to search</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <button className="btn btn-ghost btn-sm mb-16" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          <div className="stagger">
            <div className="card">
              <div className="flex items-center gap-16">
                <div className="doctor-avatar" style={{ width: 84, height: 84, fontSize: '1.8rem' }}>
                  {initials(doctor.name)}
                </div>
                <div>
                  <h2 style={{ marginBottom: 4 }}>{doctor.name}</h2>
                  <div className="doctor-spec">{doctor.specialization}</div>
                  <div className="doctor-meta-row mt-8">
                    <span><FiStar /> {doctor.rating} ({doctor.reviews} reviews)</span>
                    <span><FiAward /> {doctor.experience} yrs experience</span>
                    <span><FiMapPin /> {doctor.hospital}</span>
                  </div>
                </div>
              </div>

              <h4 className="mt-24">About</h4>
              <p>{doctor.about || 'This doctor has not added a bio yet.'}</p>

              <h4 className="mt-24">Qualification</h4>
              <p>{doctor.qualification || 'Not specified'}</p>
            </div>

            <div className="card mt-24">
              <h4>Available time slots</h4>
              <div className="chip-row mt-8 stagger" style={{ '--step': '40ms' }}>
                {(doctor.slots || []).length ? doctor.slots.map((s) => (
                  <span key={s} className="chip"><FiClock /> {s}</span>
                )) : <p className="text-muted text-sm">No open slots right now — check back later.</p>}
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ position: 'sticky', top: 90 }}>
              <div className="flex justify-between items-center mb-16">
                <span className="text-muted text-sm">Consultation fee</span>
                <span className="doctor-fee">₹{doctor.fee}</span>
              </div>
              {doctor.available ? (
                <span className="badge badge-success mb-16" style={{ display: 'inline-flex' }}>Accepting new patients</span>
              ) : (
                <span className="badge badge-neutral mb-16" style={{ display: 'inline-flex' }}>Fully booked</span>
              )}
              <Link to={`/book/${doctor.id}`} className="btn btn-primary btn-block">Book appointment</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
