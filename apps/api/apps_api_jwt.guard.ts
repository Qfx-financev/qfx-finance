import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return false

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET as string)
      return true
    } catch {
      return false
    }
  }
}
