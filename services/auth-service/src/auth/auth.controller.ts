import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { LoginRequest } from '@datafusion-ai/shared-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginRequest) {
    return this.authService.login(dto);
  }
}
