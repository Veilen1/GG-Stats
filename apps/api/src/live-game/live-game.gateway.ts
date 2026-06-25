import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LiveGameService } from './live-game.service';

interface Subscription {
  puuid: string;
  region: string;
  interval: NodeJS.Timeout;
}

/**
 * WebSocket gateway for real-time live game updates.
 *
 * Flow:
 * 1. Client connects and sends 'live-game:subscribe' with { puuid, region }
 * 2. Server starts polling Spectator API every 30s
 * 3. When data changes, emits 'live-game:update' to client
 * 4. When client disconnects, polling stops
 */
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', process.env.FRONTEND_URL || ''],
  },
  namespace: '/live-game',
})
export class LiveGameGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(LiveGameGateway.name);
  private readonly subscriptions = new Map<string, Subscription>();
  private readonly POLL_INTERVAL = 30_000; // 30 seconds

  constructor(private readonly liveGameService: LiveGameService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.cleanupSubscription(client.id);
  }

  @SubscribeMessage('live-game:subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { puuid: string; region: string },
  ) {
    const { puuid, region } = data;
    this.logger.log(`Client ${client.id} subscribing to live game for ${puuid}`);

    // Cleanup existing subscription for this client
    this.cleanupSubscription(client.id);

    // Immediately check and send current state
    await this.pollAndEmit(client, region, puuid);

    // Set up polling interval
    const interval = setInterval(async () => {
      await this.pollAndEmit(client, region, puuid);
    }, this.POLL_INTERVAL);

    this.subscriptions.set(client.id, { puuid, region, interval });
  }

  @SubscribeMessage('live-game:unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} unsubscribing from live game`);
    this.cleanupSubscription(client.id);
  }

  private async pollAndEmit(client: Socket, region: string, puuid: string) {
    try {
      const data = await this.liveGameService.getLiveGameByPuuid(region, puuid);

      if (data) {
        client.emit('live-game:update', data);
      } else {
        client.emit('live-game:not-in-game');
      }
    } catch (error) {
      this.logger.error(`Error polling live game: ${error}`);
      client.emit('live-game:error', 'Failed to fetch live game data');
    }
  }

  private cleanupSubscription(clientId: string) {
    const sub = this.subscriptions.get(clientId);
    if (sub) {
      clearInterval(sub.interval);
      this.subscriptions.delete(clientId);
      this.logger.debug(`Cleaned up subscription for ${clientId}`);
    }
  }
}
