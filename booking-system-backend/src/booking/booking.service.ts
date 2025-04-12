import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/service/prisma.service';
import { IBooking } from './entities/booking.entity';
import { IHttpResponse } from '@/common/entity/IHttpResponse';
import { IListPage } from '@/common/entity/IListPage';
@Injectable()
export class BookingService {
  constructor(private prismaService: PrismaService) {}

  async save(data: IBooking) {
    if (data.id === 0) {
      return this.create(data);
    } else {
      return this.update(data.id, data);
    }
  }
  async create(createUserDto: IBooking) {
    try {
      const user = await this.prismaService.prisma.bookings.create({
        data: { ...createUserDto, id: undefined },
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'Booking Crested SuccessFully',
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
      const user = await this.prismaService.prisma.bookings.findMany({
        skip: (data.currentPage - 1) * data.rowPerPage,
        take: data.rowPerPage,
        orderBy: [{ [data.sortBy]: data.sortOrder === 'asc' ? 'asc' : 'desc' }],
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'Booking Detail Retrieve SuccessFully',
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
      const user = await this.prismaService.prisma.bookings.findUnique({
        where: { id: data.id },
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'Booking Detail Retrieve SuccessFully',
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

  async update(id: number, data: Partial<IBooking>) {
    try {
      const user = await this.prismaService.prisma.bookings.update({
        where: { id: id },
        data: { ...data, id: undefined },
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'Booking Detail Update SuccessFully',
        data: user,
      };

      return res;
    } catch (error) {
      const res: IHttpResponse<null> = {
        status: 'Error',
        statusCode: 500,
        message: 'Error in Booking Update',
        data: null,
        devError: error,
      };

      return res;
    }
  }

  async remove(data: { id: number }) {
    try {
      const user = await this.prismaService.prisma.bookings.delete({
        where: { id: data.id },
      });

      const res: IHttpResponse<typeof user> = {
        status: 'OK',
        statusCode: 200,
        message: 'Booking Deleted SuccessFully',
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
