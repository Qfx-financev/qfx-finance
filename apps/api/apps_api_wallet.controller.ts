import { Body, Controller, Post } from '@nestjs/common'
import { WalletService } from './wallet.service'

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('connect')
  connect(@Body() body:any) {
    return this.walletService.connect(body)
  }
}
