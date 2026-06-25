// ============================================
// Queue Types & Game Modes
// ============================================

export const QUEUE_TYPES = {
  RANKED_SOLO: 420,
  RANKED_FLEX: 440,
  NORMAL_DRAFT: 400,
  NORMAL_BLIND: 430,
  ARAM: 450,
  URF: 900,
  CLASH: 700,
  TFT_RANKED: 1100,
  TFT_NORMAL: 1090,
  TFT_HYPER_ROLL: 1130,
  TFT_DOUBLE_UP: 1160,
} as const;

export const QUEUE_NAMES: Record<number, string> = {
  420: 'Ranked Solo/Duo',
  440: 'Ranked Flex',
  400: 'Normal Draft',
  430: 'Normal Blind',
  450: 'ARAM',
  900: 'URF',
  700: 'Clash',
  1100: 'TFT Ranked',
  1090: 'TFT Normal',
  1130: 'TFT Hyper Roll',
  1160: 'TFT Double Up',
};

export const RANKED_QUEUE_TYPES = {
  RANKED_SOLO_5x5: 'RANKED_SOLO_5x5',
  RANKED_FLEX_SR: 'RANKED_FLEX_SR',
  RANKED_TFT: 'RANKED_TFT',
  RANKED_TFT_TURBO: 'RANKED_TFT_TURBO',
  RANKED_TFT_DOUBLE_UP: 'RANKED_TFT_DOUBLE_UP',
} as const;

export type QueueType = (typeof QUEUE_TYPES)[keyof typeof QUEUE_TYPES];
