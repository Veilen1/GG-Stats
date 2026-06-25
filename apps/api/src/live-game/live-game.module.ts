import { Module } from '@nestjs/common';
import { LiveGameGateway } from './live-game.gateway';
import { LiveGameService } from './live-game.service';
import { LiveGameController } from './live-game.controller';

@Module({
  controllers: [LiveGameController],
  providers: [LiveGameGateway, LiveGameService],
  exports: [LiveGameService],
})
export class LiveGameModule {}
