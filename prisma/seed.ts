import { PrismaClient, Role, InvestmentPlan } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── SUPER ADMIN ─────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@qfx-finance.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@QFX2024!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
      kycStatus: 'APPROVED',
    },
  });
  console.log('✅ Super admin created:', adminEmail);

  // ─── INVESTMENT PLAN CONFIGS ──────────────────────────────
  const plans = [
    { plan: InvestmentPlan.BRONZE, dailyReturn: 0.02, minAmount: 100, maxAmount: 4999, durationDays: 30 },
    { plan: InvestmentPlan.SILVER, dailyReturn: 0.035, minAmount: 5000, maxAmount: 24999, durationDays: 60 },
    { plan: InvestmentPlan.GOLD, dailyReturn: 0.05, minAmount: 25000, maxAmount: 99999, durationDays: 90 },
    { plan: InvestmentPlan.VIP, dailyReturn: 0.08, minAmount: 100000, maxAmount: null, durationDays: 180 },
  ];

  for (const p of plans) {
    await prisma.investmentPlanConfig.upsert({
      where: { plan: p.plan },
      update: {},
      create: p,
    });
  }
  console.log('✅ Investment plans seeded');

  // ─── PLATFORM WALLETS ────────────────────────────────────
  const wallets = [
    { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', chain: 'ETH', label: 'QFX ETH Hot Wallet' },
    { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', chain: 'BTC', label: 'QFX BTC Cold Wallet' },
    { address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', chain: 'TRX', label: 'QFX USDT TRC20 Wallet' },
  ];

  for (const w of wallets) {
    await prisma.platformWallet.upsert({
      where: { address: w.address },
      update: {},
      create: w,
    });
  }
  console.log('✅ Platform wallets seeded');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
