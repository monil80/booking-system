import { Global, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Global()
@Module({
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
