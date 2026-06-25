/**
 * Data Dragon utility functions.
 *
 * Data Dragon is Riot's CDN for static game assets (champion icons, items, etc.)
 * We use it to display images without storing them locally.
 */

const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';
const VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';

let cachedVersion: string | null = null;

/**
 * Gets the latest Data Dragon version.
 * Cached in memory to avoid repeated requests.
 */
export async function getLatestVersion(): Promise<string> {
  if (cachedVersion) return cachedVersion;

  try {
    const response = await fetch(VERSIONS_URL, {
      next: { revalidate: 3600 }, // Re-check every hour
    });
    const versions: string[] = await response.json();
    cachedVersion = versions[0];
    return cachedVersion;
  } catch {
    // Fallback to a known recent version
    return '16.13.1';
  }
}

/**
 * Gets the URL for a champion's square icon.
 */
export function getChampionIconUrl(
  championName: string,
  version: string = '16.13.1',
): string {
  return `${DDRAGON_BASE}/${version}/img/champion/${championName}.png`;
}

/**
 * Gets the URL for an item icon.
 */
export function getItemIconUrl(
  itemId: number,
  version: string = '16.13.1',
): string {
  if (itemId === 0) return '';
  return `${DDRAGON_BASE}/${version}/img/item/${itemId}.png`;
}

/**
 * Gets the URL for a summoner spell icon.
 */
export function getSummonerSpellIconUrl(
  spellId: number,
  version: string = '16.13.1',
): string {
  const spellNames: Record<number, string> = {
    1: 'SummonerBoost',      // Cleanse
    3: 'SummonerExhaust',
    4: 'SummonerFlash',
    6: 'SummonerHaste',      // Ghost
    7: 'SummonerHeal',
    11: 'SummonerSmite',
    12: 'SummonerTeleport',
    13: 'SummonerMana',      // Clarity
    14: 'SummonerDot',       // Ignite
    21: 'SummonerBarrier',
    32: 'SummonerSnowball',  // Mark (ARAM)
  };

  const name = spellNames[spellId] || 'SummonerFlash';
  return `${DDRAGON_BASE}/${version}/img/spell/${name}.png`;
}

/**
 * Gets the URL for a profile icon.
 */
export function getProfileIconUrl(
  iconId: number,
  version: string = '16.13.1',
): string {
  return `${DDRAGON_BASE}/${version}/img/profileicon/${iconId}.png`;
}

/**
 * Gets the ranked emblem image URL.
 * Uses Community Dragon for better quality ranked emblems.
 */
export function getRankedEmblemUrl(tier: string): string {
  const tierLower = tier.toLowerCase();
  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/${tierLower}.png`;
}

/**
 * Gets the URL for a TFT unit's square icon from Community Dragon.
 */
export function getTftUnitIconUrl(characterId: string): string {
  const id = characterId.toLowerCase();
  const match = id.match(/tft(\d+)_/);
  const setNum = match ? match[1] : '17'; // Set 17 default
  return `https://raw.communitydragon.org/latest/game/assets/characters/${id}/hud/${id}_square.tft_set${setNum}.png`;
}

/**
 * Gets the URL for a TFT item icon from Data Dragon.
 */
export function getTftItemIconUrl(
  itemId: string,
  version: string = '16.13.1',
): string {
  // TFT items are usually in lower case or standard format in ddragon.
  // Riot sometimes prefixes with TFT_Item_ or similar. We use the raw itemId.
  return `${DDRAGON_BASE}/${version}/img/tft-item/${itemId}.png`;
}

/**
 * Gets a list of possible URLs for a TFT trait icon from Data Dragon.
 * Riot uses different naming conventions depending on the set the trait was released.
 */
export function getTftTraitIconUrls(
  traitId: string,
  version: string = '16.13.1',
): string[] {
  const match = traitId.match(/TFT(\d+)_([A-Za-z0-9_]+)/i);
  const baseUrl = `${DDRAGON_BASE}/${version}/img/tft-trait`;
  
  if (match) {
    const setNum = match[1];
    const name = match[2];
    
    return [
      // 1. Most recent sets (e.g. Trait_Icon_17_PartyAnimal.TFT_Set17.png)
      `${baseUrl}/Trait_Icon_${setNum}_${name}.TFT_Set${setNum}.png`,
      // 2. Older sets (e.g. Trait_Icon_6_Sniper.png)
      `${baseUrl}/Trait_Icon_${setNum}_${name}.png`,
      // 3. Evergreen traits (e.g. Trait_Icon_Brawler.png)
      `${baseUrl}/Trait_Icon_${name}.png`,
      // 4. Fallback raw ID
      `${baseUrl}/${traitId}.png`
    ];
  }
  return [
    `${baseUrl}/Trait_Icon_${traitId}.png`,
    `${baseUrl}/${traitId}.png`
  ];
}

/**
 * Formats game duration from seconds to "MM:SS" string.
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats a timestamp to a relative "time ago" string.
 */
export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Justo ahora';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 30) return `Hace ${days}d`;
  return new Date(timestamp).toLocaleDateString('es-AR');
}

/**
 * Returns a CSS class name based on KDA ratio.
 */
export function getKdaClass(kda: number): string {
  if (kda >= 5) return 'perfect';
  if (kda >= 4) return 'great';
  if (kda >= 3) return 'good';
  if (kda >= 2) return 'average';
  return 'bad';
}
