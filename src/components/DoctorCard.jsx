import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin } from 'react-icons/fi';

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map((p) => p[0]).slice(0, 2).join('');
}

export default function DoctorCard({ doctor }) {
  return (
    <div className="doctor-card">
      <div className="doctor-card-top">
        <div className="doctor-avatar">{initials(doctor.name)}</div>
        <div style={{ minWidth: 0 }}>
          <h4 className="doctor-name">{doctor.name}</h4>
          <div className="doctor-spec">{doctor.specialization}</div>
          <div className="doctor-meta-row">
            <span><FiStar /> {doctor.rating || '—'} ({doctor.reviews || 0})</span>
            <span>{doctor.experience} yrs exp.</span>
          </div>
        </div>
      </div>
      <div className="doctor-meta-row">
        <span><FiMapPin /> {doctor.hospital || 'Meridian Health Network'}</span>
      </div>
      <div className="doctor-meta-row">
        {doctor.available ? (
          <span className="badge badge-success"><FiClock /> Available today</span>
        ) : (
          <span className="badge badge-neutral"><FiClock /> Fully booked</span>
        )}
        {doctor.status === 'pending' && <span className="badge badge-warning">Pending approval</span>}
      </div>
      <div className="doctor-card-foot">
        <div className="doctor-fee">₹{doctor.fee} <small>/ visit</small></div>
        <div className="flex gap-8">
          <Link to={`/doctors/${doctor.id}`} className="btn btn-outline btn-sm">View profile</Link>
          <Link to={`/book/${doctor.id}`} className="btn btn-primary btn-sm">Book</Link>
        </div>
      </div>
    </div>
  );
}
