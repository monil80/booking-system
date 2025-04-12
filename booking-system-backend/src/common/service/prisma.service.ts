import { Injectable, OnModuleInit } from '@nestjs/common';
import {PrismaClient} from '../../../prisma/generated/prisma';
import { ApplicationShareData } from '../config/app.share.data';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  prisma = new PrismaClient({
   log: ApplicationShareData.isDevelopmentMode
        ? ['query', 'info', 'warn', 'error']
        : [],
        
  });

}
