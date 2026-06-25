import { api, ApiError } from '@/lib/api';
import { REGION_NAMES } from '@gg-stats/shared';
import type { SummonerProfile, TFTMatchSummary } from '@gg-stats/shared';
import { ProfileHeader } from '@/components/summoner/ProfileHeader';
import { TftRankedCard } from '@/components/tft/TftRankedCard';
import { TftMatchHistory } from '@/components/tft/TftMatchHistory';
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
    title: `${decodedName}#${decodedTag} — Perfil TFT`,
    description: `Estadísticas de TFT de ${decodedName}#${decodedTag} en ${REGION_NAMES[region] || region.toUpperCase()}. Match history, ranked stats, y más.`,
  };
}

export default async function TftSummonerPage({ params }: PageProps) {
  const { region, name, tag } = await params;
  const gameName = decodeURIComponent(name);
  const tagLine = decodeURIComponent(tag);

  let profile: SummonerProfile | null = null;
  let ranked: any[] = [];
  let matches: TFTMatchSummary[] = [];
  let error: string | null = null;

  try {
    // Fetch all data in parallel
    const [tftProfileData, matchData] = await Promise.allSettled([
      api.getTftSummoner(region, gameName, tagLine),
      api.getTftMatches(region, gameName, tagLine, 20),
    ]);

    if (tftProfileData.status === 'fulfilled' && tftProfileData.value) {
      profile = tftProfileData.value.profile;
      ranked = tftProfileData.value.tftRanked || [];
    } else {
      const err = tftProfileData.status === 'rejected' ? tftProfileData.reason : null;
      if (err instanceof ApiError && err.status === 404) {
        error = `No se encontró a "${gameName}#${tagLine}" en ${REGION_NAMES[region] || region.toUpperCase()}`;
      } else {
        error = 'Error al buscar el invocador. Intentá de nuevo más tarde.';
      }
    }

    if (matchData.status === 'fulfilled') {
      matches = matchData.value as TFTMatchSummary[];
    }
  } catch (e) {
    error = 'Error inesperado. Intentá de nuevo más tarde.';
  }

  if (error || !profile) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <SearchBar baseRoute="/tft/summoner" />
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
        <SearchBar baseRoute="/tft/summoner" />
      </div>

      {/* Profile header */}
      <ProfileHeader profile={profile} activeTab="tft" />

      {/* Ranked stats */}
      <div className="ranked-grid animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <TftRankedCard
          stats={ranked.find((r: any) => r.queueType === 'RANKED_TFT')}
          queueName="Ranked TFT"
        />
        <TftRankedCard
          stats={ranked.find((r: any) => r.queueType === 'RANKED_TFT_TURBO')}
          queueName="Hyper Roll"
        />
      </div>

      {/* Match history */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="section-title">Historial de TFT</h2>
        <TftMatchHistory matches={matches} region={region} />
      </div>
    </div>
  );
}
