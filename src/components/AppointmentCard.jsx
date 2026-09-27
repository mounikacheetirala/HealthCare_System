const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const STATUS_BADGE = {
  upcoming: 'badge-success',
  requested: 'badge-warning',
  completed: 'badge-neutral',
  cancelled: 'badge-danger',
};

export default function AppointmentCard({ appointment, counterpartName, onReschedule, onCancel, onAccept, onReject, onComplete }) {
  const d = new Date(appointment.date);
  const day = isNaN(d) ? '--' : d.getDate();
  const mon = isNaN(d) ? '' : MONTHS[d.getMonth()];

  return (
    <div className="appt-card">
      <div className="appt-date-block">
        <span className="day">{day}</span>
        <span className="mon">{mon}</span>
      </div>
      <div className="appt-info">
        <h4>{counterpartName}</h4>
        <div className="meta">{appointment.time} · {appointment.type} · {appointment.reason}</div>
        <div className="mt-8">
          <span className={`badge ${STATUS_BADGE[appointment.status] || 'badge-neutral'}`}>
            {appointment.status}
          </span>
        </div>
      </div>
      <div className="appt-actions">
        {onAccept && appointment.status === 'requested' && (
          <button className="btn btn-primary btn-sm" onClick={() => onAccept(appointment)}>Accept</button>
        )}
        {onReject && appointment.status === 'requested' && (
          <button className="btn btn-danger btn-sm" onClick={() => onReject(appointment)}>Reject</button>
        )}
        {onComplete && appointment.status === 'upcoming' && (
          <button className="btn btn-primary btn-sm" onClick={() => onComplete(appointment)}>Mark complete</button>
        )}
        {onReschedule && ['upcoming', 'requested'].includes(appointment.status) && (
          <button className="btn btn-outline btn-sm" onClick={() => onReschedule(appointment)}>Reschedule</button>
        )}
        {onCancel && ['upcoming', 'requested'].includes(appointment.status) && (
          <button className="btn btn-ghost btn-sm" onClick={() => onCancel(appointment)}>Cancel</button>
        )}
      </div>
    </div>
  );
}
