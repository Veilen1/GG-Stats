export default function SummonerLoading() {
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Profile skeleton */}
      <div className="profile-header">
        <div
          className="skeleton"
          style={{ width: 100, height: 100, borderRadius: 'var(--radius-lg)' }}
        />
        <div style={{ flex: 1 }}>
          <div
            className="skeleton"
            style={{ width: 250, height: 32, marginBottom: 8 }}
          />
          <div
            className="skeleton"
            style={{ width: 120, height: 16 }}
          />
        </div>
      </div>

      {/* Ranked skeleton */}
      <div className="ranked-grid">
        <div className="card skeleton" style={{ height: 120 }} />
        <div className="card skeleton" style={{ height: 120 }} />
      </div>

      {/* Match history skeleton */}
      <div style={{ marginTop: '2rem' }}>
        <div className="skeleton" style={{ width: 200, height: 24, marginBottom: '1rem' }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 72, marginBottom: 8, borderRadius: 'var(--radius-md)' }}
          />
        ))}
      </div>
    </div>
  );
}
