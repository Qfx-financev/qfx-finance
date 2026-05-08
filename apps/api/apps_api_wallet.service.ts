import { Injectable } from '@nestjs/common'

@Injectable()
export class WalletService {
  async connect(data:any) {
    return {
      status:'connected',
      walletAddress:data.walletAddress,
      network:data.network
    }
  }
}
