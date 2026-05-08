import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body:any) {
    return this.authService.register(body)
  }

  @Post('login')
  login(@Body() body:any) {
    return this.authService.login(body)
  }

  @Get('profile/:id')
  profile(@Param('id') id:string) {
    return this.authService.profile(id)
  }
}
