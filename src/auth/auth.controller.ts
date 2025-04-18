import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('auth/login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/me')
  getMe(@Req() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
