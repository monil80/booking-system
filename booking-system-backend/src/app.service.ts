import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  Health(): string {
    return 'Server Is Up And Running';
  }
}
