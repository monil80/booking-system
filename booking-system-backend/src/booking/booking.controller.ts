import { Controller,  Post, Body,  Param,  ParseIntPipe,  Res } from '@nestjs/common';
import { BookingService } from './booking.service';
import { IListPage } from '@/common/entity/IListPage';
import { IBooking } from '@/booking/entities/booking.entity';
import {  Response } from 'express';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('save')
  async save(@Res() res: Response, @Body() data: IBooking) {
    const serviceResponse = await this.bookingService.save(data);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Post('list')
  async findAll(@Res() res: Response, @Body() data: IListPage) {
    const serviceResponse = await this.bookingService.findAll(data);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Post('get/:id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const serviceResponse = await this.bookingService.findOne({ id: id });
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Post('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const serviceResponse = await this.bookingService.remove({ id: id });
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }
}
