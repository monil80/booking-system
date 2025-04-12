import { IHttpResponse } from '@/common/entity/IHttpResponse';
import { MailService } from '@/common/service/mail.service';
import { IUser } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwt: JwtService,
    private mailService: MailService,
  ) {}

  async signup(
    dto: Pick<IUser, 'email' | 'password_hash' | 'first_name' | 'last_name'>,
  ) {
    const existing = await this.usersService.findByEmail({ email: dto.email });
    if (existing) throw new BadRequestException('Email already exists');

    const hash = await bcrypt.hash(dto.password_hash, 10);
    const user = await this.usersService.create({
      ...dto,
      password_hash: hash,
      is_verified: false,
      created_at: new Date(),
      id: 0,
      token: nanoid(),
    });

    if (!user.data) return user;

    const token = this.jwt.sign({ id: user.data.id, email: user.data.email });

    await this.mailService.sendVerificationEmail(user.data.email, token);
    const res: IHttpResponse<IUser> = {
      status: 'OK',
      statusCode: 200,
      message: 'User Signup SuccessFully Check Email For Verification',
      data: {
        ...user.data,
        token: token,
      },
    };
    return res;
  }

  async login(data: Pick<IUser, 'email' | 'password_hash'>) {
    try {
      const user = await this.usersService.findByEmail({ email: data.email });

      if (!user.data) throw new UnauthorizedException('User Not Found');

      const valid = await bcrypt.compare(
        data.password_hash,
        user?.data?.password_hash || '',
      );
      if (!valid) throw new Error('Invalid credentials');

      if (!user.data.is_verified) throw new Error('Email not verified');

      const token = this.jwt.sign({
        id: user.data.id,
        email: user.data.email,
      });

      const res: IHttpResponse<IUser> = {
        status: 'OK',
        statusCode: 200,
        message: 'User Detail Retrieve SuccessFully',
        data: {
          ...user.data,
          jwt_token: token,
        },
      };

      return res;
    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'Error',
        statusCode: 500,
        message: error?.message || 'User Login Error',
        data: null,
      };
      return res;
    }
  }

  async verifyJwt(data: { token: string }) {
    try {
      const decoded = this.jwt.verify(data.token);

      const userId: number = decoded?.id;

      const user = await this.usersService.findOne({ id: userId });

      if (!user.data) {
        user.message = 'User Verification Fail';
        return user;
      }

      const res: IHttpResponse<IUser> = {
        status: 'OK',
        statusCode: 200,
        message: 'User Verification Done',
        data: {
          ...user.data,
          jwt_token: data.token,
        },
      };
      return res;

    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'Error',
        statusCode: 500,
        message: error?.message || 'User Email Verify Error',
        data: null,
      };
      return res;
    }
  }

  async verifyEmail(data: { email: string }) {
    try {
      const user = await this.usersService.findByEmail({email:data.email});
      if (!user.data) throw new BadRequestException('User not found');

      if (user.data.is_verified) throw new Error("Email Already Verified");

      await this.usersService.update(user.data.id, { is_verified: true });
      const res: IHttpResponse<IUser> = {
        status: 'OK',
        statusCode: 200,
        message: 'User Email Verify SuccessFully',
        data: {
          ...user.data,
          
        },
      };
      return res;
    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'Error',
        statusCode: 500,
        message: error?.message || 'User Email Verify Error',
        data: null,
      };
      return res;
    }
  }

  async resendEmail(data: Pick<IUser, 'email'>) {
    try {
      const user = await this.usersService.findByEmail({ email: data.email });

      if (!user.data) throw new Error('User Not Found');

      if (user.data.is_verified) throw new Error('Email Is Already verified');

      const emailRes = await this.mailService.sendVerificationEmail(
        user.data.email,
        user.data.token || '',
      );

      const res: IHttpResponse<typeof data> = {
        status: 'OK',
        statusCode: 200,
        message: emailRes ? 'Email SuccessFully Send' : 'Error In Email Send',
        data: data,
      };

      return res;
    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'OK',
        statusCode: 200,
        message: error?.message || 'User Login Error',
        data: null,
      };
      return res;
    }
  }
}
