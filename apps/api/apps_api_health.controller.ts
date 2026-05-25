import { Controller, Get } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { createClient } from 'redis'

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async health() {
    let db: 'ok' | 'error' = 'ok'
    let redis: 'ok' | 'error' = 'ok'

    try {
      await this.prisma.$queryRaw`SELECT 1`
    } catch {
      db = 'error'
    }

    const redisUrl = process.env.REDIS_URL
    if (redisUrl) {
      const client = createClient({ url: redisUrl })
      try {
        await client.connect()
        await client.ping()
      } catch {
        redis = 'error'
      } finally {
        await client.disconnect().catch(() => undefined)
      }
    }

    return {
      status: db === 'ok' && redis === 'ok' ? 'ok' : 'degraded',
      db,
      redis,
      uptimeSec: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    }
  }
}
