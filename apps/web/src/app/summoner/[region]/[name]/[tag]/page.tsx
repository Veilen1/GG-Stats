import { api, ApiError } from '@/lib/api';
import { REGION_NAMES, QUEUE_NAMES } from '@gg-stats/shared';
import type { SummonerProfile, RankedStats, MatchSummary } from '@gg-stats/shared';
import { ProfileHeader } from '@/components/summoner/ProfileHeader';
import { RankedCard } from '@/components/summoner/RankedCard';
import { MatchHistory } from '@/components/summoner/MatchHistory';
import { LiveGameBanner } from '@/components/live-game/LiveGameBanner';
import { SearchBar } from '@/components/search/SearchBar';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    region: string;
    name: string;
    tag: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, name, tag } = await params;
  const decodedName = decodeURIComponent(name);
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedName}#${decodedTag} — Perfil`,
    description: `Estadísticas de ${decodedName}#${decodedTag} en ${REGION_NAMES[region] || region.toUpperCase()}. Match history, ranked stats, y más.`,
  };
}

export default async function SummonerPage({ params }: PageProps) {
  const { region, name, tag } = await params;
  const gameName = decodeURIComponent(name);
  const tagLine = decodeURIComponent(tag);

  let profile: SummonerProfile | null = null;
  let ranked: RankedStats[] = [];
  let matches: MatchSummary[] = [];
  let liveGame: any = null;
  let error: string | null = null;

  try {
    // Fetch all data in parallel
    const [profileData, rankedData, matchData, liveData] = await Promise.allSettled([
      api.getSummoner(region, gameName, tagLine),
      api.getRankedStats(region, gameName, tagLine),
      api.getMatchHistory(region, gameName, tagLine, 20),
      api.getLiveGame(region, gameName, tagLine),
    ]);

    if (profileData.status === 'fulfilled') {
      profile = profileData.value as SummonerProfile;
    } else {
      const err = profileData.reason;
      if (err instanceof ApiError && err.status === 404) {
        error = `No se encontró a "${gameName}#${tagLine}" en ${REGION_NAMES[region] || region.toUpperCase()}`;
      } else {
        error = 'Error al buscar el invocador. Intentá de nuevo más tarde.';
      }
    }

    if (rankedData.status === 'fulfilled') {
      ranked = rankedData.value as RankedStats[];
    }

    if (matchData.status === 'fulfilled') {
      matches = matchData.value as MatchSummary[];
    }

    if (liveData.status === 'fulfilled') {
      liveGame = liveData.value;
    }
  } catch (e) {
    error = 'Error inesperado. Intentá de nuevo más tarde.';
  }

  if (error || !profile) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <SearchBar />
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2>{error || 'Invocador no encontrado'}</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-tertiary)' }}>
            Verificá el nombre y la región, e intentá de nuevo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      {/* Search bar at top */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar />
      </div>

      {/* Live game banner */}
      {liveGame?.inGame && (
        <LiveGameBanner
          region={region}
          gameName={gameName}
          tagLine={tagLine}
        />
      )}

      {/* Profile header */}
      <ProfileHeader profile={profile} />

      {/* Ranked stats */}
      <div className="ranked-grid animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <RankedCard
          stats={ranked.find((r) => r.queueType === 'RANKED_SOLO_5x5')}
          queueName="Ranked Solo/Duo"
        />
        <RankedCard
          stats={ranked.find((r) => r.queueType === 'RANKED_FLEX_SR')}
          queueName="Ranked Flex"
        />
      </div>

      {/* Match history */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="section-title">Historial de Partidas</h2>
        <MatchHistory matches={matches} region={region} />
      </div>
    </div>
  );
}
