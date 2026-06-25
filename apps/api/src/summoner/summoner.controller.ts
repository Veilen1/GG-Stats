import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SummonerService } from './summoner.service';

@ApiTags('summoner')
@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Get(':region/:gameName/:tagLine')
  @ApiOperation({ summary: 'Get summoner profile by Riot ID' })
  @ApiParam({ name: 'region', example: 'la2', description: 'Platform region' })
  @ApiParam({ name: 'gameName', example: 'Faker', description: 'Riot ID game name' })
  @ApiParam({ name: 'tagLine', example: 'KR1', description: 'Riot ID tag line' })
  async getSummoner(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
  ) {
    const data = await this.summonerService.getSummonerByRiotId(
      region.toLowerCase(),
      gameName,
      tagLine,
    );

    if (!data) {
      throw new HttpException(
        `Summoner "${gameName}#${tagLine}" not found in ${region.toUpperCase()}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return data;
  }

  @Get(':region/:gameName/:tagLine/ranked')
  @ApiOperation({ summary: 'Get ranked stats for a summoner' })
  async getRankedStats(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
  ) {
    return this.summonerService.getRankedStats(
      region.toLowerCase(),
      gameName,
      tagLine,
    );
  }

  @Get(':region/:gameName/:tagLine/champion-mastery')
  @ApiOperation({ summary: 'Get champion mastery for a summoner' })
  @ApiQuery({ name: 'count', required: false, example: 10 })
  async getChampionMastery(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
    @Query('count') count: number = 10,
  ) {
    return this.summonerService.getChampionMastery(
      region.toLowerCase(),
      gameName,
      tagLine,
      count,
    );
  }
}
