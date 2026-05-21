import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { createClient } from 'redis';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private redis: ReturnType<typeof createClient>;

  constructor(private config: ConfigService) {
    this.redis = createClient({ url: this.config.get('REDIS_URL') });
    this.redis.connect().catch(err => this.logger.error('Redis error', err));
  }

  async getPrices(): Promise<any[]> {
    const cached = await this.redis.get('crypto:prices').catch(() => null);
    if (cached) return JSON.parse(cached);
    return this.fetchAndCache();
  }

  async getPrice(symbol: string): Promise<any> {
    const prices = await this.getPrices();
    return prices.find(p => p.symbol.toLowerCase() === symbol.toLowerCase()) || null;
  }

  async fetchAndCache(): Promise<any[]> {
    try {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 20,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h',
          },
          headers: this.config.get('COINGECKO_API_KEY')
            ? { 'x-cg-demo-api-key': this.config.get('COINGECKO_API_KEY') }
            : {},
          timeout: 5000,
        },
      );
      await this.redis.setEx('crypto:prices', 30, JSON.stringify(data));
      return data;
    } catch (err) {
      this.logger.warn('CoinGecko unavailable, returning mock data');
      return this.getMockPrices();
    }
  }

  private getMockPrices() {
    return [
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 67420, price_change_percentage_24h: 2.3, market_cap: 1320000000000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
      { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3540, price_change_percentage_24h: 1.8, market_cap: 425000000000, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
      { id: 'tether', symbol: 'usdt', name: 'Tether', current_price: 1.00, price_change_percentage_24h: 0.01, market_cap: 110000000000, image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
      { id: 'binancecoin', symbol: 'bnb', name: 'BNB', current_price: 420, price_change_percentage_24h: -0.5, market_cap: 62000000000, image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
      { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 185, price_change_percentage_24h: 3.2, market_cap: 82000000000, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    ];
  }
}

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/crypto' })
export class CryptoPriceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(CryptoPriceGateway.name);

  constructor(private cryptoService: CryptoService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe_prices')
  handleSubscribe(client: Socket) {
    client.join('price_feed');
    return { status: 'subscribed' };
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async broadcastPrices() {
    const prices = await this.cryptoService.fetchAndCache();
    this.server.to('price_feed').emit('price_update', prices);
  }
}
