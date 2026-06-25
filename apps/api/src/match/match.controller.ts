import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MatchService } from './match.service';

@ApiTags('matches')
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':region/:gameName/:tagLine')
  @ApiOperation({ summary: 'Get match history for a summoner' })
  @ApiParam({ name: 'region', example: 'la2' })
  @ApiParam({ name: 'gameName', example: 'Faker' })
  @ApiParam({ name: 'tagLine', example: 'KR1' })
  @ApiQuery({ name: 'count', required: false, example: 20 })
  @ApiQuery({ name: 'queue', required: false, example: 420, description: 'Queue ID filter' })
  async getMatchHistory(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
    @Query('count') count: number = 20,
    @Query('queue') queue?: number,
  ) {
    const matches = await this.matchService.getMatchHistory(
      region.toLowerCase(),
      gameName,
      tagLine,
      count,
      queue,
    );

    if (!matches) {
      throw new HttpException('Summoner not found', HttpStatus.NOT_FOUND);
    }

    return matches;
  }

  @Get('detail/:region/:matchId')
  @ApiOperation({ summary: 'Get detailed match data' })
  @ApiParam({ name: 'region', example: 'la2' })
  @ApiParam({ name: 'matchId', example: 'LA2_123456789' })
  async getMatchDetail(
    @Param('region') region: string,
    @Param('matchId') matchId: string,
  ) {
    const match = await this.matchService.getMatchDetail(
      region.toLowerCase(),
      matchId,
    );

    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }

    return match;
  }
}
