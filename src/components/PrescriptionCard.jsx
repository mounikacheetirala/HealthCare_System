import { FiCalendar, FiUser } from 'react-icons/fi';

export default function PrescriptionCard({ prescription, doctorName, actions }) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-8 text-muted text-sm">
          <FiCalendar /> {prescription.date}
          {doctorName && <><span>·</span><FiUser /> {doctorName}</>}
        </div>
        {actions}
      </div>
      <div className="table-wrap" style={{ border: 'none' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {prescription.medicines.map((m, i) => (
              <tr key={i}>
                <td>{m.name}</td>
                <td>{m.dosage}</td>
                <td>{m.frequency}</td>
                <td>{m.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {prescription.notes && <p className="mt-16 text-sm"><strong>Doctor's notes:</strong> {prescription.notes}</p>}
    </div>
  );
}
