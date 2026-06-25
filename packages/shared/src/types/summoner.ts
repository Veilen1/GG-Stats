// ============================================
// Summoner Types
// ============================================

import type { MatchSummary } from './match';

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface SummonerProfile {
  puuid: string;
  summonerId?: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  summonerLevel: number;
  region: string;
  lastUpdated: string;
}

export interface RankedStats {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export interface SummonerData {
  profile: SummonerProfile;
  ranked: RankedStats[];
  recentMatches: MatchSummary[];
  championStats: ChampionStat[];
}

export interface ChampionStat {
  championId: number;
  championName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgCs: number;
  avgKda: number;
}
