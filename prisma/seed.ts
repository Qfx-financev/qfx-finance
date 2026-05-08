import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
async function main(){
  await prisma.admin.create({ data:{ email:'admin@qfx-finance.com', password: await bcrypt.hash('QfxAdmin@2026',10), role:'super_admin' } })
  await prisma.depositAddress.createMany({ data:[
    { asset:'BTC', network:'BTC', address:'bc1qQFXPrimaryWallet2026' },
    { asset:'ETH', network:'ERC20', address:'0xQFXEthereumPrimary2026' },
    { asset:'USDT', network:'TRC20', address:'TQFXUsdtPrimaryWallet2026' }
  ]})
}
main()
