import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type PriceMap = Record<string, { usd: number }>

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name)
  private cache: { data: PriceMap; expiresAt: number } | null = null

  async buy(data: any) {
    const user = await prisma.user.findUnique({ where: { id: data.userId } })
    return prisma.user.update({
      where: { id: data.userId },
      data: {
        checkingBalance: (user?.checkingBalance || 0) - Number(data.amount),
        cryptoBalance: (user?.cryptoBalance || 0) + Number(data.amount),
      },
    })
  }

  async sell(data: any) {
    const user = await prisma.user.findUnique({ where: { id: data.userId } })
    return prisma.user.update({
      where: { id: data.userId },
      data: {
        checkingBalance: (user?.checkingBalance || 0) + Number(data.amount),
        cryptoBalance: (user?.cryptoBalance || 0) - Number(data.amount),
      },
    })
  }

  async prices() {
    if (this.cache && this.cache.expiresAt > Date.now()) {
      return this.cache.data
    }

    try {
      const { data } = await axios.get<PriceMap>(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin,ethereum,solana',
            vs_currencies: 'usd',
          },
          timeout: 3000,
        },
      )

      this.cache = {
        data,
        expiresAt: Date.now() + 60_000,
      }

      return data
    } catch (error) {
      this.logger.warn('CoinGecko unavailable, returning cached/fallback data')

      if (this.cache) {
        return this.cache.data
      }

      return {
        bitcoin: { usd: 0 },
        ethereum: { usd: 0 },
        solana: { usd: 0 },
      }
    }
  }
}
