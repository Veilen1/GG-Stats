// ============================================
// Live Game Types
// ============================================

export interface LiveGameData {
  gameId: number;
  gameType: string;
  gameMode: string;
  gameLength: number;
  mapId: number;
  platformId: string;
  gameQueueConfigId: number;
  bannedChampions: BannedChampion[];
  participants: LiveGameParticipant[];
  observers: {
    encryptionKey: string;
  };
}

export interface LiveGameParticipant {
  puuid: string;
  teamId: number;
  championId: number;
  profileIconId: number;
  riotId: string;
  bot: boolean;
  summonerId: string;
  gameCustomizationObjects: unknown[];
  perks: {
    perkIds: number[];
    perkStyle: number;
    perkSubStyle: number;
  };
  spell1Id: number;
  spell2Id: number;
  /** Enriched data (added by our backend) */
  rankedStats?: {
    tier: string;
    rank: string;
    lp: number;
    winRate: number;
  };
  championMastery?: {
    championLevel: number;
    championPoints: number;
  };
}

export interface BannedChampion {
  championId: number;
  teamId: number;
  pickTurn: number;
}

/** Socket.IO event types */
export interface LiveGameEvents {
  /** Client → Server */
  'live-game:subscribe': (puuid: string) => void;
  'live-game:unsubscribe': (puuid: string) => void;

  /** Server → Client */
  'live-game:update': (data: LiveGameData) => void;
  'live-game:not-in-game': () => void;
  'live-game:error': (error: string) => void;
}
