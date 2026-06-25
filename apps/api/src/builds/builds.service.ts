import { Injectable, Logger } from '@nestjs/common';

/**
 * Builds service.
 *
 * In a production app, this would aggregate build data from stored match data
 * in the database. For the MVP, we return structured placeholder data that
 * demonstrates the API contract.
 *
 * TODO: Implement build aggregation from MatchParticipant data in PostgreSQL
 */
@Injectable()
export class BuildsService {
  private readonly logger = new Logger(BuildsService.name);

  async getChampionBuilds(championName: string) {
    this.logger.log(`Fetching builds for ${championName}`);

    // This will be populated from aggregated match data in Phase 2
    return {
      championName,
      message:
        'Build aggregation will be available once match data collection is implemented.',
      builds: [],
    };
  }
}
