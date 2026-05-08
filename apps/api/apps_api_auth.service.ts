import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

@Injectable()
export class AuthService {
  async register(data:any) {
    const hash = await bcrypt.hash(data.password,10)
    return prisma.user.create({
      data:{
        ...data,
        password:hash,
        accountNumber:'QFX'+Date.now()
      }
    })
  }

  async login(data:any) {
    const user = await prisma.user.findUnique({ where:{ email:data.email } })
    if(!user) throw new Error('User not found')
    const valid = await bcrypt.compare(data.password,user.password)
    if(!valid) throw new Error('Invalid credentials')
    const token = jwt.sign({ id:user.id }, process.env.JWT_SECRET as string)
    return { token, user }
  }

  async profile(id:string) {
    return prisma.user.findUnique({ where:{ id } })
  }
}
