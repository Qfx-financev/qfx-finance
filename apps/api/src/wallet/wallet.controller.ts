import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallets')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('link')
  linkWallet(@Request() req, @Body() body: { address: string; chain: string; label?: string }) {
    return this.walletService.linkWallet(req.user.id, body.address, body.chain, body.label);
  }

  @Get('my')
  getMyWallets(@Request() req) {
    return this.walletService.getMyWallets(req.user.id);
  }

  @Public()
  @Get('platform')
  getPlatformWallets() {
    return this.walletService.getPlatformWallets();
  }
}
