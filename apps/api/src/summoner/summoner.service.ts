import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { RiotApiService } from '../riot-api/riot-api.service';
import type { RiotAccount, SummonerProfile, RankedStats } from '@gg-stats/shared';

/** Riot API response types (internal, not exported) */
interface RiotSummonerResponse {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

interface RiotLeagueEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  summonerId: string;
}

export interface RiotChampionMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  tokensEarned: number;
}

@Injectable()
export class SummonerService {
  private readonly logger = new Logger(SummonerService.name);

  constructor(private readonly riotApi: RiotApiService) {}

  /**
   * Resolves a Riot ID (gameName#tagLine) to a PUUID, then fetches summoner data.
   */
  async getSummonerByRiotId(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<SummonerProfile | null> {
    // Step 1: Resolve Riot ID → PUUID via regional Account API
    const account = await this.riotApi.regionalRequest<RiotAccount>(
      region,
      `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    );

    if (!account) return null;

    // Step 2: Get summoner details via platform API using PUUID
    const summoner = await this.riotApi.platformRequest<RiotSummonerResponse>(
      region,
      `/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
    );

    if (!summoner) return null;

    return {
      puuid: account.puuid,
      summonerId: summoner.id,
      gameName: account.gameName,
      tagLine: account.tagLine,
      profileIconId: summoner.profileIconId,
      summonerLevel: summoner.summonerLevel,
      region,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Gets the PUUID for a Riot ID. Used internally by other services.
   */
  async resolvePuuid(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<string | null> {
    const account = await this.riotApi.regionalRequest<RiotAccount>(
      region,
      `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    );

    return account?.puuid || null;
  }

  /**
   * Gets ranked stats (Solo/Duo and Flex) for a summoner.
   */
  async getRankedStats(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<RankedStats[]> {
    const puuid = await this.resolvePuuid(region, gameName, tagLine);
    if (!puuid) {
      throw new HttpException('Summoner not found', HttpStatus.NOT_FOUND);
    }

    const entries = await this.riotApi.platformRequest<RiotLeagueEntry[]>(
      region,
      `/lol/league/v4/entries/by-puuid/${puuid}`,
    );

    if (!entries || entries.length === 0) return [];

    return entries.map((entry) => ({
      queueType: entry.queueType,
      tier: entry.tier,
      rank: entry.rank,
      leaguePoints: entry.leaguePoints,
      wins: entry.wins,
      losses: entry.losses,
      winRate:
        entry.wins + entry.losses > 0
          ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100)
          : 0,
      hotStreak: entry.hotStreak,
      veteran: entry.veteran,
      freshBlood: entry.freshBlood,
      inactive: entry.inactive,
    }));
  }

  /**
   * Gets champion mastery data for a summoner.
   */
  async getChampionMastery(
    region: string,
    gameName: string,
    tagLine: string,
    count: number = 10,
  ) {
    const puuid = await this.resolvePuuid(region, gameName, tagLine);
    if (!puuid) {
      throw new HttpException('Summoner not found', HttpStatus.NOT_FOUND);
    }

    const mastery = await this.riotApi.platformRequest<RiotChampionMastery[]>(
      region,
      `/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`,
    );

    return mastery || [];
  }
}
