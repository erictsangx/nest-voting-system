import { Injectable } from '@nestjs/common';

@Injectable()
export class FooService {
  getHello(): string {
    return 'Hello World!';
  }
}
