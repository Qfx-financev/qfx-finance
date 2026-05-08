import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

@Injectable()
export class TransactionsService {
  async transfer(data:any) {
    return prisma.transaction.create({
      data:{
        userId:data.userId,
        type:'transfer',
        amount:Number(data.amount),
        status:'pending',
        reference:'TRF-'+Date.now()
      }
    })
  }

  async getByUser(userId:string) {
    return prisma.transaction.findMany({ where:{ userId } })
  }
}
