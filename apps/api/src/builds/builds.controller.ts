import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BuildsService } from './builds.service';

@ApiTags('builds')
@Controller('builds')
export class BuildsController {
  constructor(private readonly buildsService: BuildsService) {}

  @Get(':championName')
  @ApiOperation({ summary: 'Get popular builds for a champion' })
  @ApiParam({ name: 'championName', example: 'Jinx' })
  async getChampionBuilds(
    @Param('championName') championName: string,
  ) {
    return this.buildsService.getChampionBuilds(championName);
  }
}
