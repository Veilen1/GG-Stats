// ============================================
// TFT Types
// ============================================

export interface TFTMatchSummary {
  matchId: string;
  gameType: string;
  gameDatetime: number;
  gameLength: number;
  gameVersion: string;
  placement: number;
  level: number;
  playersEliminated: number;
  totalDamageToPlayers: number;
  traits: TFTTrait[];
  units: TFTUnit[];
  augments: string[];
}

export interface TFTMatchDetail {
  matchId: string;
  gameType: string;
  gameDatetime: number;
  gameLength: number;
  gameVersion: string;
  queueId: number;
  participants: TFTParticipant[];
}

export interface TFTParticipant {
  puuid: string;
  placement: number;
  level: number;
  lastRound: number;
  timeEliminated: number;
  playersEliminated: number;
  totalDamageToPlayers: number;
  goldLeft: number;
  traits: TFTTrait[];
  units: TFTUnit[];
  augments: string[];
  companion: {
    contentID: string;
    skinID: number;
    species: string;
  };
}

export interface TFTTrait {
  name: string;
  numUnits: number;
  currentTier: number;
  maxTier: number;
  style: number; // 0=inactive, 1=bronze, 2=silver, 3=gold, 4=chromatic
  iconUrl?: string; // Resolved from DDragon JSON
}

export interface TFTUnit {
  characterId: string;
  name: string;
  rarity: number;
  tier: number; // Star level (1-3)
  itemNames: string[];
  iconUrl?: string;
}

export interface TFTMetaComp {
  name: string;
  tier: string; // S, A, B, C
  avgPlacement: number;
  playRate: number;
  topFourRate: number;
  winRate: number;
  traits: TFTTrait[];
  units: TFTUnit[];
  coreItems: Record<string, string[]>; // champion -> items
  augments: string[];
}
