import { Controller, Get, Patch, Param } from '@nestjs/common'
import { AdminService } from './admin.service'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('deposits')
  deposits() { return this.adminService.pendingDeposits() }

  @Get('withdrawals')
  withdrawals() { return this.adminService.pendingWithdrawals() }

  @Patch('approve/:id')
  approve(@Param('id') id:string) { return this.adminService.approveTransaction(id) }
}
