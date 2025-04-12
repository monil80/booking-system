import { Controller,  Post, Body,  Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from '@/user/entities/user.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Res() res: Response,
    @Body() data: Pick<IUser, 'email' | 'password_hash'>,
  ) {
    const serviceResponse = await this.authService.login(data);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Post('verify')
  async verifyJwt(
    @Res() res: Response,
    @Body()
    data: { token: string },
  ) {
    const serviceResponse = await this.authService.verifyJwt(data);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Post('email/verify')
  async verifyEmail(
    @Res() res: Response,
    @Body()
    data: { email: string },
  ) {
    const serviceResponse = await this.authService.verifyEmail(data);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Post('signup')
  async signup(
    @Res() res: Response,
    @Body()
    data: Pick<IUser, 'email' | 'password_hash' | 'first_name' | 'last_name'>,
  ) {
    const serviceResponse = await this.authService.signup(data);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Post('email/resend')
  async resendEmail(
    @Res() res: Response,
    @Body()
    data: { email: string },
  ) {
    const serviceResponse = await this.authService.resendEmail(data);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }
}
