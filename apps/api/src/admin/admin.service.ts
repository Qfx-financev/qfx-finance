import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, KycStatus, TransactionStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where, skip, take: limit,
        select: { id: true, email: true, firstName: true, lastName: true, role: true, kycStatus: true, balance: true, isActive: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async updateUserRole(userId: string, role: Role) {
    return this.prisma.user.update({ where: { id: userId }, data: { role } });
  }

  async updateKyc(userId: string, status: KycStatus, reviewNote?: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { kycStatus: status } });
  }

  async getAllTransactions(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, firstName: true } } },
      }),
      this.prisma.transaction.count(),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async approveTransaction(txId: string, adminId: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: txId } });
    if (!tx) throw new NotFoundException('Transaction not found');

    return this.prisma.$transaction(async (p) => {
      if (tx.type === 'WITHDRAWAL') {
        await p.user.update({
          where: { id: tx.userId },
          data: { balance: { decrement: tx.amount } },
        });
      }
      return p.transaction.update({
        where: { id: txId },
        data: { status: TransactionStatus.COMPLETED, approvedBy: adminId },
      });
    });
  }

  async getPlatformStats() {
    const [totalUsers, activeInvestments, pendingKyc, transactions] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.investment.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { kycStatus: 'PENDING' } }),
      this.prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
    ]);

    const aum = await this.prisma.investment.aggregate({
      _sum: { amount: true },
      where: { isActive: true },
    });

    return {
      totalUsers,
      activeInvestments,
      pendingKyc,
      totalVolume: transactions._sum.amount || 0,
      aum: aum._sum.amount || 0,
    };
  }

  async getPendingKycDocuments() {
    return this.prisma.kycDocument.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async toggleUserStatus(userId: string, isActive: boolean) {
    return this.prisma.user.update({ where: { id: userId }, data: { isActive } });
  }
}
