import { Module } from '@nestjs/common';
import { CryptoService, CryptoPriceGateway } from './crypto.service';
import { CryptoController } from './crypto.controller';

@Module({
  providers: [CryptoService, CryptoPriceGateway],
  controllers: [CryptoController],
  exports: [CryptoService],
})
export class CryptoModule {}
