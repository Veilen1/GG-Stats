import { Injectable, Logger } from '@nestjs/common';
import { RiotApiService } from '../riot-api/riot-api.service';
import { SummonerService } from '../summoner/summoner.service';
import type { MatchSummary, MatchDetail, MatchParticipantData, PerkData } from '@gg-stats/shared';

/** Raw Riot API match response structure */
interface RiotMatchResponse {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameMode: string;
    gameVersion: string;
    queueId: number;
    teams: Array<{
      teamId: number;
      win: boolean;
      bans: Array<{ championId: number; pickTurn: number }>;
      objectives: Record<string, { first: boolean; kills: number }>;
    }>;
    participants: Array<Record<string, any>>;
  };
}

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(
    private readonly riotApi: RiotApiService,
    private readonly summonerService: SummonerService,
  ) {}

  /**
   * Fetches match history IDs and then loads each match's data.
   */
  async getMatchHistory(
    region: string,
    gameName: string,
    tagLine: string,
    count: number = 20,
    queue?: number,
  ): Promise<MatchSummary[] | null> {
    const puuid = await this.summonerService.resolvePuuid(region, gameName, tagLine);
    if (!puuid) return null;

    // Build query params
    let queryParams = `?start=0&count=${Math.min(count, 100)}`;
    if (queue) queryParams += `&queue=${queue}`;

    // Get match IDs
    const matchIds = await this.riotApi.regionalRequest<string[]>(
      region,
      `/lol/match/v5/matches/by-puuid/${puuid}/ids${queryParams}`,
    );

    if (!matchIds || matchIds.length === 0) return [];

    // Fetch each match in parallel (with concurrency limit)
    const matches = await Promise.all(
      matchIds.map((id) => this.getMatchSummary(region, id, puuid)),
    );

    return matches.filter((m): m is MatchSummary => m !== null);
  }

  /**
   * Gets a single match and extracts the relevant participant's summary.
   */
  private async getMatchSummary(
    region: string,
    matchId: string,
    puuid: string,
  ): Promise<MatchSummary | null> {
    const match = await this.riotApi.regionalRequest<RiotMatchResponse>(
      region,
      `/lol/match/v5/matches/${matchId}`,
    );

    if (!match) return null;

    const participant = match.info.participants.find(
      (p: any) => p.puuid === puuid,
    );

    if (!participant) return null;

    return {
      matchId: match.metadata.matchId,
      gameMode: match.info.gameMode,
      queueId: match.info.queueId,
      gameDuration: match.info.gameDuration,
      gameCreation: match.info.gameCreation,
      win: participant.win,
      participant: this.mapParticipant(participant, match.info.gameDuration),
    };
  }

  /**
   * Gets full match detail with all participants and teams.
   */
  async getMatchDetail(
    region: string,
    matchId: string,
  ): Promise<MatchDetail | null> {
    const match = await this.riotApi.regionalRequest<RiotMatchResponse>(
      region,
      `/lol/match/v5/matches/${matchId}`,
    );

    if (!match) return null;

    return {
      matchId: match.metadata.matchId,
      gameMode: match.info.gameMode,
      queueId: match.info.queueId,
      gameDuration: match.info.gameDuration,
      gameCreation: match.info.gameCreation,
      gameVersion: match.info.gameVersion,
      teams: match.info.teams.map((team) => ({
        teamId: team.teamId,
        win: team.win,
        bans: team.bans || [],
        objectives: team.objectives || {},
      })),
      participants: match.info.participants.map((p: any) =>
        this.mapParticipant(p, match.info.gameDuration),
      ),
    };
  }

  /**
   * Maps raw Riot participant data to our clean interface.
   */
  private mapParticipant(p: any, gameDuration: number): MatchParticipantData {
    const deaths = p.deaths || 1;
    const minutes = gameDuration / 60;

    return {
      puuid: p.puuid,
      riotIdGameName: p.riotIdGameName || '',
      riotIdTagline: p.riotIdTagline || '',
      championId: p.championId,
      championName: p.championName,
      champLevel: p.champLevel,
      teamId: p.teamId,
      win: p.win,
      kills: p.kills,
      deaths: p.deaths,
      assists: p.assists,
      kda: p.deaths === 0
        ? p.kills + p.assists
        : parseFloat(((p.kills + p.assists) / p.deaths).toFixed(2)),
      totalMinionsKilled: p.totalMinionsKilled,
      neutralMinionsKilled: p.neutralMinionsKilled || 0,
      csPerMin: parseFloat(
        ((p.totalMinionsKilled + (p.neutralMinionsKilled || 0)) / minutes).toFixed(1),
      ),
      goldEarned: p.goldEarned,
      goldPerMin: parseFloat((p.goldEarned / minutes).toFixed(0)),
      totalDamageDealtToChampions: p.totalDamageDealtToChampions,
      totalDamageTaken: p.totalDamageTaken,
      visionScore: p.visionScore,
      wardsPlaced: p.wardsPlaced,
      wardsKilled: p.wardsKilled,
      items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
      summoner1Id: p.summoner1Id,
      summoner2Id: p.summoner2Id,
      perks: this.mapPerks(p.perks),
      role: p.role || '',
      lane: p.lane || '',
      doubleKills: p.doubleKills || 0,
      tripleKills: p.tripleKills || 0,
      quadraKills: p.quadraKills || 0,
      pentaKills: p.pentaKills || 0,
    };
  }

  private mapPerks(perks: any): PerkData {
    if (!perks?.styles) {
      return {
        primaryStyle: 0,
        primarySelections: [],
        subStyle: 0,
        subSelections: [],
        statPerks: { offense: 0, flex: 0, defense: 0 },
      };
    }

    const primary = perks.styles[0];
    const sub = perks.styles[1];

    return {
      primaryStyle: primary?.style || 0,
      primarySelections: primary?.selections?.map((s: any) => s.perk) || [],
      subStyle: sub?.style || 0,
      subSelections: sub?.selections?.map((s: any) => s.perk) || [],
      statPerks: perks.statPerks || { offense: 0, flex: 0, defense: 0 },
    };
  }
}
