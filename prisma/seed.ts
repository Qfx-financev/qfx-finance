import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()


if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env and set DATABASE_URL before running `npx prisma db seed`.',
  )
}

const DEFAULT_ADMIN_EMAIL = 'admin@qfx-finance.com'
const DEFAULT_ADMIN_PASSWORD = 'ChangeMe123!'

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'super_admin' },
    create: {
      email,
      password: hashedPassword,
      role: 'super_admin',
    },
  })
}

async function seedDepositAddresses() {
  const addresses = [
    { asset: 'BTC', network: 'BTC', address: 'bc1qQFXPrimaryWallet2026' },
    { asset: 'ETH', network: 'ERC20', address: '0xQFXEthereumPrimary2026' },
    { asset: 'USDT', network: 'TRC20', address: 'TQFXUsdtPrimaryWallet2026' },
  ]

  for (const item of addresses) {
    const existing = await prisma.depositAddress.findFirst({
      where: {
        asset: item.asset,
        network: item.network,
        address: item.address,
      },
    })

    if (!existing) {
      await prisma.depositAddress.create({ data: item })
    }
  }
}

async function main() {
  await seedAdmin()
  await seedDepositAddresses()
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
