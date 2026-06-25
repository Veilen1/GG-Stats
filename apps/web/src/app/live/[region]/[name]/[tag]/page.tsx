'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getChampionIconUrl } from '@/lib/ddragon';
import type { LiveGameData, LiveGameParticipant } from '@gg-stats/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LiveGamePage() {
  const params = useParams();
  const region = params.region as string;
  const gameName = decodeURIComponent(params.name as string);
  const tagLine = decodeURIComponent(params.tag as string);

  const [liveData, setLiveData] = useState<LiveGameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Fetch live game data
  useEffect(() => {
    const fetchLiveGame = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/live-game/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        );
        const data = await res.json();

        if (data.inGame && data.data) {
          setLiveData(data.data);
          setElapsedTime(data.data.gameLength || 0);
        } else {
          setError('El invocador no está en partida actualmente.');
        }
      } catch {
        setError('Error al obtener datos de la partida en vivo.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveGame();

    // Poll every 30 seconds
    const interval = setInterval(fetchLiveGame, 30000);
    return () => clearInterval(interval);
  }, [region, gameName, tagLine]);

  // Timer
  useEffect(() => {
    if (!liveData) return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [liveData]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="empty-state">
          <div className="skeleton" style={{ width: 200, height: 30, marginBottom: '1rem' }} />
          <div className="skeleton" style={{ width: '100%', height: 400 }} />
        </div>
      </div>
    );
  }

  if (error || !liveData) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🎮</div>
          <h2>{error || 'No está en partida'}</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-tertiary)' }}>
            {gameName}#{tagLine} no se encuentra en una partida activa.
          </p>
        </div>
      </div>
    );
  }

  const blueTeam = liveData.participants.filter((p) => p.teamId === 100);
  const redTeam = liveData.participants.filter((p) => p.teamId === 200);

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Live header */}
      <div className="live-banner" style={{ marginBottom: '2rem' }}>
        <div className="live-dot" />
        <span className="live-text">Partida en Vivo</span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Teams */}
      <div className="live-teams">
        {/* Blue Team */}
        <div className="live-team">
          <div className="live-team-header blue">Equipo Azul</div>
          {blueTeam.map((participant) => (
            <PlayerCard key={participant.puuid} participant={participant} />
          ))}
        </div>

        {/* Red Team */}
        <div className="live-team">
          <div className="live-team-header red">Equipo Rojo</div>
          {redTeam.map((participant) => (
            <PlayerCard key={participant.puuid} participant={participant} />
          ))}
        </div>
      </div>

      {/* Bans */}
      {liveData.bannedChampions && liveData.bannedChampions.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 className="section-title">Bans</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {liveData.bannedChampions.map((ban, i) => (
              <div
                key={i}
                style={{
                  opacity: 0.6,
                  filter: 'grayscale(100%)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: `2px solid ${ban.teamId === 100 ? 'var(--accent-blue)' : 'var(--color-loss)'}`,
                }}
              >
                {ban.championId > 0 && (
                  <Image
                    src={getChampionIconUrl(ban.championId.toString())}
                    alt={`Ban ${ban.championId}`}
                    width={36}
                    height={36}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ participant }: { participant: LiveGameParticipant }) {
  const riotId = participant.riotId || 'Unknown';

  return (
    <div className="live-player">
      <Image
        src={getChampionIconUrl(participant.championId.toString())}
        alt={`Champion ${participant.championId}`}
        width={40}
        height={40}
        style={{
          borderRadius: 'var(--radius-sm)',
          border: '2px solid var(--border-glass)',
        }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{riotId}</div>
        {participant.rankedStats && (
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
            }}
          >
            {participant.rankedStats.tier} {participant.rankedStats.rank} •{' '}
            {participant.rankedStats.winRate}% WR
          </div>
        )}
      </div>
    </div>
  );
}
