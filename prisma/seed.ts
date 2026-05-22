import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('QfxAdmin@2026', 10)

  await prisma.admin.upsert({
    where: { email: 'admin@qfx-finance.com' },
    update: { password: hashedPassword, role: 'super_admin' },
    create: {
      email: 'admin@qfx-finance.com',
      password: hashedPassword,
      role: 'super_admin',
    },
  })

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

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
