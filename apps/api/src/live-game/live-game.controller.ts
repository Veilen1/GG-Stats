import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { LiveGameService } from './live-game.service';

@ApiTags('live-game')
@Controller('live-game')
export class LiveGameController {
  constructor(private readonly liveGameService: LiveGameService) {}

  @Get(':region/:gameName/:tagLine')
  @ApiOperation({ summary: 'Check if summoner is in a live game' })
  @ApiParam({ name: 'region', example: 'la2' })
  @ApiParam({ name: 'gameName', example: 'Faker' })
  @ApiParam({ name: 'tagLine', example: 'KR1' })
  async getLiveGame(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
  ) {
    const data = await this.liveGameService.getLiveGame(
      region.toLowerCase(),
      gameName,
      tagLine,
    );

    if (!data) {
      return { inGame: false, data: null };
    }

    return { inGame: true, data };
  }
}
