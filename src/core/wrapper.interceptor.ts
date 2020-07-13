import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseWrapper<T> {
  result: T;
  statusCode: number;
  message: string
}

/**
 * Standardize all responses
 */
@Injectable()
export class WrapperInterceptor<T> implements NestInterceptor<T, ResponseWrapper<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseWrapper<T>> {
    return next.handle().pipe(map(data => (
      {
        result: data === undefined ? null : data,
        statusCode: 200,
        message: ''
      }
    )));
  }
}
