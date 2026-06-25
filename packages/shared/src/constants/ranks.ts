// ============================================
// Rank & Tier Constants
// ============================================

export const TIERS = [
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'EMERALD',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER',
] as const;

export const DIVISIONS = ['I', 'II', 'III', 'IV'] as const;

/** Tiers that don't have divisions (single rank) */
export const APEX_TIERS = ['MASTER', 'GRANDMASTER', 'CHALLENGER'] as const;

/** Tier display names */
export const TIER_NAMES: Record<string, string> = {
  IRON: 'Iron',
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
  EMERALD: 'Emerald',
  DIAMOND: 'Diamond',
  MASTER: 'Master',
  GRANDMASTER: 'Grandmaster',
  CHALLENGER: 'Challenger',
};

/** Color scheme for each tier (for UI) */
export const TIER_COLORS: Record<string, { primary: string; gradient: string }> = {
  IRON: { primary: '#6B6B6B', gradient: 'linear-gradient(135deg, #6B6B6B, #8B8B8B)' },
  BRONZE: { primary: '#CD7F32', gradient: 'linear-gradient(135deg, #8B5E3C, #CD7F32)' },
  SILVER: { primary: '#C0C0C0', gradient: 'linear-gradient(135deg, #9E9E9E, #D4D4D4)' },
  GOLD: { primary: '#FFD700', gradient: 'linear-gradient(135deg, #DAA520, #FFD700)' },
  PLATINUM: { primary: '#4ECDC4', gradient: 'linear-gradient(135deg, #2F9E97, #4ECDC4)' },
  EMERALD: { primary: '#50C878', gradient: 'linear-gradient(135deg, #2E8B57, #50C878)' },
  DIAMOND: { primary: '#B9F2FF', gradient: 'linear-gradient(135deg, #6CB4EE, #B9F2FF)' },
  MASTER: { primary: '#9B59B6', gradient: 'linear-gradient(135deg, #7D3C98, #BB8FCE)' },
  GRANDMASTER: { primary: '#E74C3C', gradient: 'linear-gradient(135deg, #C0392B, #E74C3C)' },
  CHALLENGER: { primary: '#F4D03F', gradient: 'linear-gradient(135deg, #D4AC0D, #F7DC6F)' },
};

export type Tier = (typeof TIERS)[number];
export type Division = (typeof DIVISIONS)[number];
