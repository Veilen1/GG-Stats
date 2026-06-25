// ============================================
// Riot API Regions & Routing
// ============================================

/** Platform routing values (for game-specific APIs) */
export const PLATFORM_ROUTES = {
  BR1: 'br1',
  EUN1: 'eun1',
  EUW1: 'euw1',
  JP1: 'jp1',
  KR: 'kr',
  LA1: 'la1',
  LA2: 'la2',
  NA1: 'na1',
  OC1: 'oc1',
  PH2: 'ph2',
  RU: 'ru',
  SG2: 'sg2',
  TH2: 'th2',
  TR1: 'tr1',
  TW2: 'tw2',
  VN2: 'vn2',
} as const;

/** Regional routing values (for account/match APIs) */
export const REGIONAL_ROUTES = {
  AMERICAS: 'americas',
  ASIA: 'asia',
  EUROPE: 'europe',
  SEA: 'sea',
} as const;

/** Maps platform routes to their regional route */
export const PLATFORM_TO_REGIONAL: Record<string, string> = {
  br1: 'americas',
  la1: 'americas',
  la2: 'americas',
  na1: 'americas',
  oc1: 'americas',
  eun1: 'europe',
  euw1: 'europe',
  ru: 'europe',
  tr1: 'europe',
  jp1: 'asia',
  kr: 'asia',
  ph2: 'sea',
  sg2: 'sea',
  th2: 'sea',
  tw2: 'sea',
  vn2: 'sea',
};

/** Human-readable region names */
export const REGION_NAMES: Record<string, string> = {
  br1: 'Brasil',
  eun1: 'EU Nordic & East',
  euw1: 'EU West',
  jp1: 'Japón',
  kr: 'Corea',
  la1: 'LAN',
  la2: 'LAS',
  na1: 'Norteamérica',
  oc1: 'Oceanía',
  ph2: 'Filipinas',
  ru: 'Rusia',
  sg2: 'Singapur',
  th2: 'Tailandia',
  tr1: 'Turquía',
  tw2: 'Taiwán',
  vn2: 'Vietnam',
};

export type PlatformRoute = (typeof PLATFORM_ROUTES)[keyof typeof PLATFORM_ROUTES];
export type RegionalRoute = (typeof REGIONAL_ROUTES)[keyof typeof REGIONAL_ROUTES];
