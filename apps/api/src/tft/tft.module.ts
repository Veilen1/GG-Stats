import { Module } from '@nestjs/common';
import { TftController } from './tft.controller';
import { TftService } from './tft.service';

@Module({
  controllers: [TftController],
  providers: [TftService],
  exports: [TftService],
})
export class TftModule {}
