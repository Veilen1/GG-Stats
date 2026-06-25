import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RiotApiModule } from './riot-api/riot-api.module';
import { SummonerModule } from './summoner/summoner.module';
import { MatchModule } from './match/match.module';
import { LiveGameModule } from './live-game/live-game.module';
import { BuildsModule } from './builds/builds.module';
import { TftModule } from './tft/tft.module';

@Module({
  imports: [
    // Load .env from monorepo root
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    // Rate limiting — 60 requests per minute per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),

    // Feature modules
    RiotApiModule,
    SummonerModule,
    MatchModule,
    LiveGameModule,
    BuildsModule,
    TftModule,
  ],
})
export class AppModule {}
