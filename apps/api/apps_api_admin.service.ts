import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

@Injectable()
export class AdminService {
  async pendingDeposits() {
    return prisma.transaction.findMany({ where:{ type:'deposit', status:'pending' } })
  }

  async pendingWithdrawals() {
    return prisma.transaction.findMany({ where:{ type:'withdrawal', status:'pending' } })
  }

  async approveTransaction(id:string) {
    return prisma.transaction.update({
      where:{ id },
      data:{ status:'approved' }
    })
  }
}
