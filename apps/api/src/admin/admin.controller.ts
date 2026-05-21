// admin.controller.ts
import { Controller, Get, Patch, Param, Body, Request, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, KycStatus } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMPLIANCE_OFFICER)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  getUsers(@Query() query: { page?: number; limit?: number; search?: string }) {
    return this.adminService.getUsers(query);
  }

  @Patch('users/:id/role')
  updateRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.adminService.updateUserRole(id, role);
  }

  @Patch('users/:id/kyc')
  updateKyc(@Param('id') id: string, @Body() body: { status: KycStatus; reviewNote?: string }) {
    return this.adminService.updateKyc(id, body.status, body.reviewNote);
  }

  @Patch('users/:id/status')
  toggleStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminService.toggleUserStatus(id, isActive);
  }

  @Get('transactions')
  getTransactions(@Query() query: { page?: number; limit?: number }) {
    return this.adminService.getAllTransactions(query);
  }

  @Patch('transactions/:id/approve')
  approveTransaction(@Param('id') id: string, @Request() req) {
    return this.adminService.approveTransaction(id, req.user.id);
  }

  @Get('kyc/documents')
  getKycDocuments() {
    return this.adminService.getPendingKycDocuments();
  }

  @Get('platform/stats')
  getPlatformStats() {
    return this.adminService.getPlatformStats();
  }
}
