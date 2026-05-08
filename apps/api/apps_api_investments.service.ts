import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

@Injectable()
export class InvestmentsService {
  async subscribe(data:any) {
    const user = await prisma.user.findUnique({ where:{ id:data.userId } })
    return prisma.user.update({
      where:{ id:data.userId },
      data:{
        checkingBalance:(user?.checkingBalance||0)-Number(data.amount),
        investmentTotal:(user?.investmentTotal||0)+Number(data.amount)
      }
    })
  }
}
