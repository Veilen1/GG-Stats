import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { RiotApiService } from '../riot-api/riot-api.service';
import { SummonerService } from '../summoner/summoner.service';
import type { TFTMatchSummary, TFTParticipant } from '@gg-stats/shared';

interface RiotTFTMatchResponse {
  metadata: {
    data_version: string;
    match_id: string;
    participants: string[];
  };
  info: {
    game_datetime: number;
    game_length: number;
    game_version: string;
    queue_id: number;
    tft_game_type: string;
    tft_set_number: number;
    tft_set_core_name: string;
    participants: any[];
  };
}

@Injectable()
export class TftService {
  private readonly logger = new Logger(TftService.name);

  constructor(
    private readonly riotApi: RiotApiService,
    private readonly summonerService: SummonerService,
  ) {}

  /**
   * Gets TFT profile with ranked stats.
   */
  async getTftProfile(region: string, gameName: string, tagLine: string) {
    const profile = await this.summonerService.getSummonerByRiotId(
      region,
      gameName,
      tagLine,
    );

    if (!profile) return null;

    // Get TFT-specific ranked data using the new puuid endpoint
    // (Riot deprecated summonerId and added /by-puuid/ as the replacement)
    const tftSummoner = await this.riotApi.platformRequest<any>(
      region,
      `/tft/league/v1/by-puuid/${profile.puuid}`,
    );

    return {
      profile,
      tftRanked: tftSummoner || [],
    };
  }

  /**
   * Gets TFT match history.
   */
  async getTftMatchHistory(
    region: string,
    gameName: string,
    tagLine: string,
    count: number = 20,
  ): Promise<TFTMatchSummary[] | null> {
    const puuid = await this.summonerService.resolvePuuid(
      region,
      gameName,
      tagLine,
    );

    if (!puuid) return null;

    // Get match IDs from TFT match API
    const matchIds = await this.riotApi.regionalRequest<string[]>(
      region,
      `/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${Math.min(count, 100)}`,
    );

    if (!matchIds || matchIds.length === 0) return [];

    // Fetch each match
    const matches = await Promise.all(
      matchIds.map((id) => this.getTftMatchSummary(region, id, puuid)),
    );

    return matches.filter((m): m is TFTMatchSummary => m !== null);
  }

  private ddragonTraitsCache: Record<string, any> = {};
  private ddragonChampionsCache: Record<string, any> = {};
  private ddragonVersion: string = '16.13.1';
  private traitsFetched: boolean = false;

  private async fetchDdragonAssets() {
    if (this.traitsFetched) return;
    try {
      const [traitsRes, champsRes] = await Promise.all([
        fetch(`https://ddragon.leagueoflegends.com/cdn/${this.ddragonVersion}/data/en_US/tft-trait.json`),
        fetch(`https://ddragon.leagueoflegends.com/cdn/${this.ddragonVersion}/data/en_US/tft-champion.json`)
      ]);
      
      const traitsJson = await traitsRes.json();
      this.ddragonTraitsCache = traitsJson.data;

      const champsJson = await champsRes.json();
      // Champs JSON keys are long paths, we map them by their 'id' field
      for (const champ of Object.values(champsJson.data) as any[]) {
        if (champ.id) {
          this.ddragonChampionsCache[champ.id] = champ;
        }
      }

      this.traitsFetched = true;
    } catch (error) {
      this.logger.error('Failed to fetch DDragon TFT assets', error);
    }
  }

  private async getTftMatchSummary(
    region: string,
    matchId: string,
    puuid: string,
  ): Promise<TFTMatchSummary | null> {
    const match = await this.riotApi.regionalRequest<RiotTFTMatchResponse>(
      region,
      `/tft/match/v1/matches/${matchId}`,
    );

    if (!match) return null;

    const participant = match.info.participants.find(
      (p) => p.puuid === puuid,
    );

    if (!participant) return null;

    await this.fetchDdragonAssets();

    return {
      matchId: match.metadata.match_id,
      gameType: match.info.tft_game_type || match.info.queue_id.toString(),
      gameDatetime: match.info.game_datetime,
      gameLength: match.info.game_length,
      gameVersion: match.info.game_version,
      placement: participant.placement,
      level: participant.level,
      playersEliminated: participant.players_eliminated,
      totalDamageToPlayers: participant.total_damage_to_players,
      traits: participant.traits?.map((t: any) => {
        const traitData = this.ddragonTraitsCache[t.name];
        let iconUrl: string | undefined = undefined;
        if (traitData && traitData.image && traitData.image.full) {
          iconUrl = `https://ddragon.leagueoflegends.com/cdn/${this.ddragonVersion}/img/tft-trait/${traitData.image.full}`;
        }
        return {
          name: t.name,
          numUnits: t.num_units,
          currentTier: t.tier_current,
          maxTier: t.tier_total,
          style: t.style,
          iconUrl
        };
      }) || [],
      units: participant.units?.map((u: any) => {
        const champData = this.ddragonChampionsCache[u.character_id];
        let iconUrl: string | undefined = undefined;
        if (champData && champData.image && champData.image.full) {
          iconUrl = `https://ddragon.leagueoflegends.com/cdn/${this.ddragonVersion}/img/tft-champion/${champData.image.full}`;
        }
        return {
          characterId: u.character_id,
          name: u.name,
          rarity: u.rarity,
          tier: u.tier,
          itemNames: u.itemNames || u.items || [],
          iconUrl
        };
      }) || [],
      augments: participant.augments || [],
    };
  }
}
