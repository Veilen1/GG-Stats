import { TIER_NAMES, TIER_COLORS } from '@gg-stats/shared';
import { getRankedEmblemUrl } from '@/lib/ddragon';

interface TftRankedStats {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak?: boolean;
}

interface TftRankedCardProps {
  stats?: TftRankedStats;
  queueName: string;
}

export function TftRankedCard({ stats, queueName }: TftRankedCardProps) {
  if (!stats) {
    return (
      <div className="card ranked-card">
        <div className="card-header">
          <span className="card-title">{queueName}</span>
        </div>
        <div className="ranked-content" style={{ justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏅</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
              Unranked
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tierColor = TIER_COLORS[stats.tier]?.primary || '#6B6B6B';
  const isApex = ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(stats.tier);
  
  // In TFT, "wins" usually means Top 4 finishes
  const totalGames = stats.wins + stats.losses;
  const top4Rate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

  return (
    <div
      className="card ranked-card"
      style={{
        borderTop: `3px solid ${tierColor}`,
      }}
    >
      <div className="card-header">
        <span className="card-title">{queueName}</span>
        {stats.hotStreak && <span className="badge badge-hot">🔥 Hot Streak</span>}
      </div>

      <div className="ranked-content">
        {/* Rank Emblem */}
        <div style={{ position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ranked-emblem"
            src={getRankedEmblemUrl(stats.tier)}
            alt={`${stats.tier} emblem`}
            width={80}
            height={80}
          />
        </div>

        {/* Rank Info */}
        <div className="ranked-info">
          <div className="ranked-tier" style={{ color: tierColor }}>
            {TIER_NAMES[stats.tier] || stats.tier}{' '}
            {!isApex && stats.rank}
          </div>

          <div className="ranked-lp">{stats.leaguePoints} LP</div>

          <div className="ranked-record">
            <span className="ranked-wins" style={{ color: 'var(--success)' }}>{stats.wins} Top 4</span>
            <span className="ranked-losses">{totalGames} Jugadas</span>
          </div>

          {/* Win rate bar */}
          <div className="winrate-bar">
            <div
              className="winrate-fill"
              style={{ width: `${top4Rate}%` }}
            />
          </div>
          <div className="winrate-text">{top4Rate}% Top 4</div>
        </div>
      </div>
    </div>
  );
}
