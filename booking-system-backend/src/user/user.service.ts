import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/service/prisma.service';
import { IUser } from './entities/user.entity';
import { IHttpResponse } from '@/common/entity/IHttpResponse';
import { IListPage } from '@/common/entity/IListPage';
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(data: { email: string } ) {
      try {
        const user = await this.prismaService.prisma.users.findFirst({
          where: { email: data.email },
        });

        const res: IHttpResponse<typeof user> = {
          status: 'OK',
          statusCode: 200,
          message: 'User Detail Retrieve SuccessFully',
          data: user,
        };

        return res;
      } catch (error) {
        const res: IHttpResponse<null> = {
          status: 'Error',
          statusCode: 500,
          message: 'Error in User Retrieve',
          data: null,
          devError: error,
        };

        return res;
      }
  }
  async save(data: IUser) {
    if (data.id === 0) {
      return this.create(data);
    } else {
      return this.update(data.id, data);
    }
  }

  async create(createUserDto: IUser) {
    try {
      const user = await this.prismaService.prisma.users.create({
        data: { ...createUserDto, id: undefined },
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'User Crested SuccessFully',
        data: user,
      };

      return res;
    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'Error',
        statusCode: 500,
        message: 'Error in User Create',
        data: null,
        devError: error,
      };

      return res;
    }
  }

  async findAll(data: IListPage) {
    try {
      const user = await this.prismaService.prisma.users.findMany({
        skip: (data.currentPage - 1) * data.rowPerPage,
        take: data.rowPerPage,
        orderBy: [{ [data.sortBy]: data.sortOrder === 'asc' ? 'asc' : 'desc' }],
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'User Detail Retrieve SuccessFully',
        data: user,
      };

      return res;
    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'Error',
        statusCode: 500,
        message: 'Error in User Retrieve',
        data: null,
        devError: error,
      };

      return res;
    }
  }

  async findOne(data: { id: number }) {
    try {
      const user = await this.prismaService.prisma.users.findUnique({
        where: { id: data.id },
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'User Detail Retrieve SuccessFully',
        data: user,
      };

      return res;
    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'Error',
        statusCode: 500,
        message: 'Error in User Retrieve',
        data: null,
        devError: error,
      };

      return res;
    }
  }

  async update(id: number, data: Partial<IUser>) {
    try {
      const user = await this.prismaService.prisma.users.update({
        where: { id: id },
        data: { ...data, id: undefined },
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'User Detail Update SuccessFully',
        data: user,
      };

      return res;
    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'Error',
        statusCode: 500,
        message: 'Error in User Update',
        data: null,
        devError: error,
      };

      return res;
    }
  }

  async remove(data: { id: number }) {
    try {
      const user = await this.prismaService.prisma.users.delete({
        where: { id: data.id },
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'User Deleted SuccessFully',
        data: user,
      };

      return res;
    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'Error',
        statusCode: 500,
        message: 'Error in User Delete',
        data: null,
        devError: error,
      };

      return res;
    }
  }
}
