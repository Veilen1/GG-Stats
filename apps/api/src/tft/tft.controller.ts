import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TftService } from './tft.service';

@ApiTags('tft')
@Controller('tft')
export class TftController {
  constructor(private readonly tftService: TftService) {}

  @Get('summoner/:region/:gameName/:tagLine')
  @ApiOperation({ summary: 'Get TFT summoner profile with ranked stats' })
  @ApiParam({ name: 'region', example: 'la2' })
  @ApiParam({ name: 'gameName', example: 'Faker' })
  @ApiParam({ name: 'tagLine', example: 'KR1' })
  async getTftSummoner(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
  ) {
    const data = await this.tftService.getTftProfile(
      region.toLowerCase(),
      gameName,
      tagLine,
    );

    if (!data) {
      throw new HttpException('Summoner not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  @Get('matches/:region/:gameName/:tagLine')
  @ApiOperation({ summary: 'Get TFT match history' })
  @ApiQuery({ name: 'count', required: false, example: 20 })
  async getTftMatches(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
    @Query('count') count: number = 20,
  ) {
    return this.tftService.getTftMatchHistory(
      region.toLowerCase(),
      gameName,
      tagLine,
      count,
    );
  }
}
