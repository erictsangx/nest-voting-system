import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  result: T;
  statusCode: number;
  message: string
}

/**
 * Standardize all responses
 */
@Injectable()
export class WrapperInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => (
      {
        result: data === undefined ? null : data,
        statusCode: 200,
        message: ''
      }
    )));
  }
}
