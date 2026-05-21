// crypto.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CryptoService } from './crypto.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private cryptoService: CryptoService) {}

  @Public()
  @Get('prices')
  getPrices() {
    return this.cryptoService.getPrices();
  }

  @Public()
  @Get('prices/:symbol')
  getPrice(@Param('symbol') symbol: string) {
    return this.cryptoService.getPrice(symbol);
  }
}
