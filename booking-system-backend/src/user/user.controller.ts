import { Controller, Get, Post, Body, Param, Delete, Res,  ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './entities/user.entity';
import { Response } from 'express';
import { IListPage } from '@/common/entity/IListPage';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async save(@Res() res: Response, @Body() data: IUser) {
    const serviceResponse = await this.userService.save(data);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Post()
  async findAll(@Res() res: Response, @Body() data: IListPage) {
    const serviceResponse = await this.userService.findAll(data);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const serviceResponse = await this.userService.findOne({ id: id });
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const serviceResponse = await this.userService.remove({ id: id });
    res.status(serviceResponse.statusCode).json(serviceResponse);
  }
}
