import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { InvestmentPlan, TransactionType, TransactionStatus } from '@prisma/client';

@Injectable()
export class InvestmentsService {
  private readonly logger = new Logger(InvestmentsService.name);

  constructor(private prisma: PrismaService) {}

  async activate(userId: string, plan: InvestmentPlan, amount: number) {
    const config = await this.prisma.investmentPlanConfig.findUnique({ where: { plan } });
    if (!config) throw new BadRequestException('Invalid plan');
    if (!config.isActive) throw new BadRequestException('Plan not available');
    if (amount < Number(config.minAmount)) {
      throw new BadRequestException(`Minimum investment is $${config.minAmount}`);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (Number(user.balance) < amount) throw new BadRequestException('Insufficient balance');

    const investment = await this.prisma.$transaction(async (p) => {
      await p.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      });
      await p.transaction.create({
        data: {
          userId, type: TransactionType.INVESTMENT,
          status: TransactionStatus.COMPLETED,
          amount, description: `${plan} Plan Activation`,
        },
      });
      return p.investment.create({
        data: {
          userId, plan, amount,
          dailyReturn: config.dailyReturn,
          endDate: new Date(Date.now() + config.durationDays * 86400000),
        },
      });
    });

    return investment;
  }

  async getMyInvestments(userId: string) {
    return this.prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPlans() {
    return this.prisma.investmentPlanConfig.findMany({ where: { isActive: true } });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async distributeROI() {
    this.logger.log('🔄 Running daily ROI distribution...');

    const activeInvestments = await this.prisma.investment.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    let distributed = 0;
    for (const inv of activeInvestments) {
      const profit = Number(inv.amount) * Number(inv.dailyReturn);

      await this.prisma.$transaction(async (p) => {
        await p.user.update({
          where: { id: inv.userId },
          data: { balance: { increment: profit } },
        });
        await p.investment.update({
          where: { id: inv.id },
          data: { totalEarned: { increment: profit } },
        });
        await p.transaction.create({
          data: {
            userId: inv.userId,
            type: TransactionType.PROFIT_DISTRIBUTION,
            status: TransactionStatus.COMPLETED,
            amount: profit,
            description: `Daily ROI - ${inv.plan} Plan`,
            metadata: { investmentId: inv.id, rate: Number(inv.dailyReturn) },
          },
        });
      });

      // Auto-close expired investments
      if (inv.endDate && new Date() >= inv.endDate) {
        await this.prisma.investment.update({
          where: { id: inv.id },
          data: { isActive: false },
        });
        this.logger.log(`Investment ${inv.id} expired and closed`);
      }

      distributed++;
    }

    this.logger.log(`✅ ROI distributed to ${distributed} investments`);
  }
}
