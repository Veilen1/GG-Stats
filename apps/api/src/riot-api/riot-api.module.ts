import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RiotApiService } from './riot-api.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RiotApiService],
  exports: [RiotApiService],
})
export class RiotApiModule {}
