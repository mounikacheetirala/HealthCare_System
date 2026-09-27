import CountUp from './CountUp';

export default function DashboardCard({ icon, label, value, color = 'var(--color-primary)' }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>{icon}</div>
      <div>
        <div className="stat-value">{typeof value === 'number' ? <CountUp end={value} /> : value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
