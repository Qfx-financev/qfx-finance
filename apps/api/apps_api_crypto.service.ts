import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

@Injectable()
export class CryptoService {
  async buy(data:any) {
    const user = await prisma.user.findUnique({ where:{ id:data.userId } })
    return prisma.user.update({
      where:{ id:data.userId },
      data:{
        checkingBalance:(user?.checkingBalance||0)-Number(data.amount),
        cryptoBalance:(user?.cryptoBalance||0)+Number(data.amount)
      }
    })
  }

  async sell(data:any) {
    const user = await prisma.user.findUnique({ where:{ id:data.userId } })
    return prisma.user.update({
      where:{ id:data.userId },
      data:{
        checkingBalance:(user?.checkingBalance||0)+Number(data.amount),
        cryptoBalance:(user?.cryptoBalance||0)-Number(data.amount)
      }
    })
  }
}
