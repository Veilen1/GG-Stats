import { Injectable, Logger } from '@nestjs/common';
import { RiotApiService } from '../riot-api/riot-api.service';
import { SummonerService } from '../summoner/summoner.service';
import type { LiveGameData } from '@gg-stats/shared';

@Injectable()
export class LiveGameService {
  private readonly logger = new Logger(LiveGameService.name);

  constructor(
    private readonly riotApi: RiotApiService,
    private readonly summonerService: SummonerService,
  ) {}

  /**
   * Checks the Spectator API to see if a summoner is currently in a game.
   * Returns null if not in game.
   */
  async getLiveGame(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<LiveGameData | null> {
    const puuid = await this.summonerService.resolvePuuid(
      region,
      gameName,
      tagLine,
    );

    if (!puuid) return null;

    return this.getLiveGameByPuuid(region, puuid);
  }

  /**
   * Direct lookup by PUUID via Spectator v5 API.
   */
  async getLiveGameByPuuid(
    region: string,
    puuid: string,
  ): Promise<LiveGameData | null> {
    const data = await this.riotApi.platformRequest<LiveGameData>(
      region,
      `/lol/spectator/v5/active-games/by-summoner/${puuid}`,
    );

    return data || null;
  }
}
