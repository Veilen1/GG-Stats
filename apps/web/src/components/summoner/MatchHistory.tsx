'use client';

import Image from 'next/image';
import type { MatchSummary } from '@gg-stats/shared';
import { QUEUE_NAMES } from '@gg-stats/shared';
import {
  getChampionIconUrl,
  getItemIconUrl,
  formatDuration,
  timeAgo,
  getKdaClass,
} from '@/lib/ddragon';

interface MatchHistoryProps {
  matches: MatchSummary[];
  region: string;
}

export function MatchHistory({ matches, region }: MatchHistoryProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p>No se encontraron partidas recientes</p>
      </div>
    );
  }

  return (
    <div className="match-list stagger-children">
      {matches.map((match) => (
        <MatchCard key={match.matchId} match={match} />
      ))}
    </div>
  );
}

function MatchCard({ match }: { match: MatchSummary }) {
  const p = match.participant;
  const isWin = match.win;
  const queueName = QUEUE_NAMES[match.queueId] || match.gameMode;
  const kdaClass = getKdaClass(p.kda);
  const totalCs = p.totalMinionsKilled + p.neutralMinionsKilled;

  return (
    <div className="match-card animate-fade-in">
      {/* Win/Loss indicator bar */}
      <div className={`match-indicator ${isWin ? 'win' : 'loss'}`} />

      {/* Match content */}
      <div className={`match-content ${isWin ? 'win' : 'loss'}`}>
        {/* Champion + Queue */}
        <div className="match-champion">
          <Image
            className="match-champion-icon"
            src={getChampionIconUrl(p.championName)}
            alt={p.championName}
            width={48}
            height={48}
          />
          <div className="match-champion-info">
            <span className="match-champion-name">{p.championName}</span>
            <span className="match-queue">{queueName}</span>
            <span className="match-time-ago">{timeAgo(match.gameCreation)}</span>
          </div>
        </div>

        {/* KDA + CS + Items */}
        <div className="match-stats">
          {/* KDA */}
          <div className="match-kda">
            <div className="match-kda-numbers">
              <span className="kills">{p.kills}</span>
              <span className="slash">/</span>
              <span className="deaths">{p.deaths}</span>
              <span className="slash">/</span>
              <span className="assists">{p.assists}</span>
            </div>
            <div className={`match-kda-ratio ${kdaClass}`}>
              {p.deaths === 0 ? 'Perfect' : `${p.kda} KDA`}
            </div>
          </div>

          {/* CS */}
          <div className="match-cs">
            <div>{totalCs} CS</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
              {p.csPerMin}/min
            </div>
          </div>

          {/* Items */}
          <div className="match-items">
            {p.items.map((itemId, idx) => (
              <div key={idx}>
                {itemId > 0 ? (
                  <Image
                    className="match-item-icon"
                    src={getItemIconUrl(itemId)}
                    alt={`Item ${itemId}`}
                    width={28}
                    height={28}
                  />
                ) : (
                  <div className="match-item-icon" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Result + Duration */}
        <div className="match-meta">
          <div className={`match-result ${isWin ? 'win' : 'loss'}`}>
            {isWin ? 'Victoria' : 'Derrota'}
          </div>
          <div className="match-duration">
            {formatDuration(match.gameDuration)}
          </div>
        </div>
      </div>
    </div>
  );
}
