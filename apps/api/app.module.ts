import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { TransactionsController } from './transactions/transactions.controller'
import { TransactionsService } from './transactions/transactions.service'
import { CryptoController } from './crypto/crypto.controller'
import { CryptoService } from './crypto/crypto.service'

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [AuthController, TransactionsController, CryptoController],
  providers: [AuthService, TransactionsService, CryptoService]
})
export class AppModule {}
