import { Module, Global } from '@nestjs/common';
import { SummonerController } from './summoner.controller';
import { SummonerService } from './summoner.service';

@Global()
@Module({
  controllers: [SummonerController],
  providers: [SummonerService],
  exports: [SummonerService],
})
export class SummonerModule {}
