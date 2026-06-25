// ============================================
// Match Types
// ============================================

export interface MatchSummary {
  matchId: string;
  gameMode: string;
  queueId: number;
  gameDuration: number;
  gameCreation: number;
  /** The participant data for the searched summoner */
  participant: MatchParticipantData;
  /** Whether the searched summoner's team won */
  win: boolean;
}

export interface MatchDetail {
  matchId: string;
  gameMode: string;
  queueId: number;
  gameDuration: number;
  gameCreation: number;
  gameVersion: string;
  teams: TeamData[];
  participants: MatchParticipantData[];
}

export interface MatchParticipantData {
  puuid: string;
  riotIdGameName: string;
  riotIdTagline: string;
  championId: number;
  championName: string;
  champLevel: number;
  teamId: number;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  csPerMin: number;
  goldEarned: number;
  goldPerMin: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  items: number[];
  summoner1Id: number;
  summoner2Id: number;
  perks: PerkData;
  role: string;
  lane: string;
  /** Multikill info */
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
}

export interface PerkData {
  primaryStyle: number;
  primarySelections: number[];
  subStyle: number;
  subSelections: number[];
  statPerks: {
    offense: number;
    flex: number;
    defense: number;
  };
}

export interface TeamData {
  teamId: number;
  win: boolean;
  bans: { championId: number; pickTurn: number }[];
  objectives: Record<string, { first: boolean; kills: number }>;
}
