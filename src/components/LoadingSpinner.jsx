export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="spinner-wrap flex-col items-center gap-8">
      <div className="spinner" role="status" aria-label={label} />
      <span className="text-muted text-sm">{label}</span>
    </div>
  );
}
