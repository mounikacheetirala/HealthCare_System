import { FiMail, FiPhone } from 'react-icons/fi';

export default function PatientCard({ patient, actions }) {
  return (
    <div className="card-flat flex items-center justify-between gap-16" style={{ border: '1px solid var(--border-color)' }}>
      <div className="flex items-center gap-12">
        <div className="doctor-avatar" style={{ width: 48, height: 48, fontSize: '1rem' }}>
          {patient.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
        </div>
        <div>
          <h4 style={{ margin: 0 }}>{patient.name}</h4>
          <div className="doctor-meta-row">
            <span><FiMail /> {patient.email}</span>
            {patient.phone && <span><FiPhone /> {patient.phone}</span>}
          </div>
        </div>
      </div>
      {actions && <div className="flex gap-8">{actions}</div>}
    </div>
  );
}
