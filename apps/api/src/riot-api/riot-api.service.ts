import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PLATFORM_TO_REGIONAL } from '@gg-stats/shared';

/**
 * Core Riot API HTTP client.
 *
 * Handles:
 * - API key injection (from environment, never exposed to client)
 * - Region-based URL routing (platform vs regional endpoints)
 * - Rate limit awareness with retry + backoff
 * - Error mapping to NestJS exceptions
 */
@Injectable()
export class RiotApiService {
  private readonly logger = new Logger(RiotApiService.name);
  private readonly apiKey: string;
  private readonly requestQueue: Map<string, number> = new Map();

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('RIOT_API_KEY');
    if (!key) {
      throw new Error(
        'RIOT_API_KEY is not set. Add it to your .env file.',
      );
    }
    this.apiKey = key;
  }

  // ─── Platform API (region-specific: la2, na1, etc.) ──────────

  /**
   * Makes a request to a platform-specific Riot API endpoint.
   * Example: GET https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}
   */
  async platformRequest<T>(
    region: string,
    path: string,
    retries = 2,
  ): Promise<T> {
    const url = `https://${region}.api.riotgames.com${path}`;
    return this.makeRequest<T>(url, retries);
  }

  // ─── Regional API (americas, europe, asia, sea) ──────────────

  /**
   * Makes a request to a regional Riot API endpoint.
   * Example: GET https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{name}/{tag}
   */
  async regionalRequest<T>(
    region: string,
    path: string,
    retries = 2,
  ): Promise<T> {
    const regionalRoute = PLATFORM_TO_REGIONAL[region] || 'americas';
    const url = `https://${regionalRoute}.api.riotgames.com${path}`;
    return this.makeRequest<T>(url, retries);
  }

  /**
   * Shortcut for regional requests using a platform region code.
   * Automatically resolves platform → regional route.
   */
  async accountRequest<T>(
    region: string,
    path: string,
    retries = 2,
  ): Promise<T> {
    return this.regionalRequest<T>(region, path, retries);
  }

  // ─── Core Request Handler ────────────────────────────────────

  private async makeRequest<T>(url: string, retries: number): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        this.logger.debug(`Riot API → ${url} (attempt ${attempt + 1})`);

        const response = await fetch(url, {
          headers: {
            'X-Riot-Token': this.apiKey,
            'Accept-Language': 'es-AR,es;q=0.9',
          },
        });

        // Rate limited — wait and retry
        if (response.status === 429) {
          const retryAfter = parseInt(
            response.headers.get('Retry-After') || '5',
            10,
          );
          this.logger.warn(
            `Rate limited on ${url}. Retrying in ${retryAfter}s...`,
          );

          if (attempt < retries) {
            await this.sleep(retryAfter * 1000);
            continue;
          }

          throw new HttpException(
            'Riot API rate limit exceeded. Please try again shortly.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }

        // Not found — summoner doesn't exist, not in game, etc.
        if (response.status === 404) {
          return null as T;
        }

        // Forbidden — API key invalid or expired
        if (response.status === 403) {
          this.logger.error('Riot API key is invalid or expired');
          throw new HttpException(
            'Riot API authentication failed. API key may be expired.',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        // Other errors
        if (!response.ok) {
          const body = await response.text();
          this.logger.error(
            `Riot API error ${response.status}: ${body}`,
          );
          throw new HttpException(
            `Riot API error: ${response.statusText}`,
            HttpStatus.BAD_GATEWAY,
          );
        }

        return (await response.json()) as T;
      } catch (error) {
        if (error instanceof HttpException) throw error;

        this.logger.error(`Riot API request failed: ${error}`);

        if (attempt < retries) {
          await this.sleep(1000 * (attempt + 1)); // Exponential backoff
          continue;
        }

        throw new HttpException(
          'Failed to reach Riot API. Please try again later.',
          HttpStatus.BAD_GATEWAY,
        );
      }
    }

    throw new HttpException(
      'Riot API request exhausted all retries.',
      HttpStatus.BAD_GATEWAY,
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
