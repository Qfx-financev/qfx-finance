import { Body, Controller, Post } from '@nestjs/common'
import { CryptoService } from './crypto.service'

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('buy')
  buy(@Body() body:any) {
    return this.cryptoService.buy(body)
  }

  @Post('sell')
  sell(@Body() body:any) {
    return this.cryptoService.sell(body)
  }
}
