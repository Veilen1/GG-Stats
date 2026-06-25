import type { TFTMatchSummary } from '@gg-stats/shared';
import { TftMatchCard } from './TftMatchCard';

interface TftMatchHistoryProps {
  matches: TFTMatchSummary[];
  region: string;
}

export function TftMatchHistory({ matches, region }: TftMatchHistoryProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>Sin partidas recientes</h3>
        <p style={{ color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
          No se encontraron partidas de TFT en los últimos días.
        </p>
      </div>
    );
  }

  return (
    <div className="match-history" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {matches.map((match) => (
        <TftMatchCard key={match.matchId} match={match} />
      ))}
    </div>
  );
}
