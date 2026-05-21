// users.controller.ts
import { Controller, Get, Patch, Body, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req) {
    return this.usersService.getMe(req.user.id);
  }

  @Patch('me')
  updateProfile(@Request() req, @Body() body: { firstName?: string; lastName?: string; phone?: string }) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Patch('me/password')
  changePassword(
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(req.user.id, body.currentPassword, body.newPassword);
  }
}
