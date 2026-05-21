// wallet.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async linkWallet(userId: string, address: string, chain: string, label?: string) {
    const existing = await this.prisma.wallet.findUnique({ where: { address } });
    if (existing) throw new ConflictException('Wallet already linked');
    return this.prisma.wallet.create({ data: { userId, address, chain, label } });
  }

  async getMyWallets(userId: string) {
    return this.prisma.wallet.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async getPlatformWallets() {
    return this.prisma.platformWallet.findMany();
  }
}
