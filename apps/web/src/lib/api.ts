/**
 * API client for communicating with the GG Stats backend.
 * All Riot API calls are proxied through our backend for security.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiOptions {
  cache?: RequestCache;
  revalidate?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    path: string,
    options: ApiOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/api${path}`;

    const fetchOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (options.cache) {
      fetchOptions.cache = options.cache;
    }

    if (options.revalidate) {
      fetchOptions.next = { revalidate: options.revalidate };
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new ApiError(
        error.message || 'An error occurred',
        response.status,
      );
    }

    return response.json();
  }

  // ─── Summoner ──────────────────────────────

  async getSummoner(region: string, gameName: string, tagLine: string) {
    return this.request(
      `/summoner/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      { revalidate: 300 }, // Cache for 5 minutes
    );
  }

  async getRankedStats(region: string, gameName: string, tagLine: string) {
    return this.request(
      `/summoner/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}/ranked`,
      { revalidate: 300 },
    );
  }

  async getChampionMastery(
    region: string,
    gameName: string,
    tagLine: string,
    count = 10,
  ) {
    return this.request(
      `/summoner/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}/champion-mastery?count=${count}`,
      { revalidate: 600 },
    );
  }

  // ─── Matches ───────────────────────────────

  async getMatchHistory(
    region: string,
    gameName: string,
    tagLine: string,
    count = 20,
    queue?: number,
  ) {
    let path = `/matches/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?count=${count}`;
    if (queue) path += `&queue=${queue}`;
    return this.request(path, { cache: 'no-store' });
  }

  async getMatchDetail(region: string, matchId: string) {
    return this.request(
      `/matches/detail/${region}/${matchId}`,
      { revalidate: 3600 }, // Matches don't change, cache for 1 hour
    );
  }

  // ─── Live Game ─────────────────────────────

  async getLiveGame(region: string, gameName: string, tagLine: string) {
    return this.request(
      `/live-game/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      { cache: 'no-store' }, // Always fresh
    );
  }

  // ─── Builds ────────────────────────────────

  async getChampionBuilds(championName: string) {
    return this.request(
      `/builds/${encodeURIComponent(championName)}`,
      { revalidate: 1800 },
    );
  }

  // ─── TFT ───────────────────────────────────

  async getTftSummoner(region: string, gameName: string, tagLine: string) {
    return this.request(
      `/tft/summoner/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      { revalidate: 300 },
    );
  }

  async getTftMatches(
    region: string,
    gameName: string,
    tagLine: string,
    count = 20,
  ) {
    return this.request(
      `/tft/matches/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?count=${count}`,
      { cache: 'no-store' },
    );
  }
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const api = new ApiClient(API_URL);
