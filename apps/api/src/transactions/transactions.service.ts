import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType, TransactionStatus } from '@prisma/client';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionsService {
  private stripe: Stripe;
  private readonly logger = new Logger(TransactionsService.name);

  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY') || 'sk_test_placeholder', {
      apiVersion: '2023-10-16',
    });
  }

  async deposit(userId: string, amount: number, currency = 'USD') {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    // Create Stripe PaymentIntent
    let stripePaymentIntentId: string;
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata: { userId },
      });
      stripePaymentIntentId = intent.id;
    } catch (err) {
      this.logger.warn('Stripe unavailable, creating pending transaction');
      stripePaymentIntentId = `manual_${Date.now()}`;
    }

    const tx = await this.prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING,
        amount,
        currency,
        description: 'Deposit via Stripe',
        metadata: { stripePaymentIntentId },
      },
    });

    return { transaction: tx, clientSecret: stripePaymentIntentId };
  }

  async withdraw(userId: string, amount: number, currency = 'USD') {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (Number(user.balance) < amount) throw new BadRequestException('Insufficient balance');

    // Large withdrawals require admin approval
    const requiresApproval = amount > 1000;
    const status = requiresApproval ? TransactionStatus.PENDING : TransactionStatus.PROCESSING;

    const tx = await this.prisma.$transaction(async (p) => {
      if (!requiresApproval) {
        await p.user.update({
          where: { id: userId },
          data: { balance: { decrement: amount } },
        });
      }
      return p.transaction.create({
        data: { userId, type: TransactionType.WITHDRAWAL, status, amount, currency,
          description: requiresApproval ? 'Withdrawal pending approval' : 'Withdrawal',
        },
      });
    });

    return { transaction: tx, requiresApproval };
  }

  async getTransactions(userId: string, query: {
    page?: number; limit?: number; type?: string; status?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }
}
