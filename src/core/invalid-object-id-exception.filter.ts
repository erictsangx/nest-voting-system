import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';

/**
 * Handle mongoose CastError: Cast to ObjectId failed for value "xxx"
 */
@Catch(Error.CastError)
export class InvalidObjectIdExceptionFilter implements ExceptionFilter {
  catch(exception: Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 400;

    response
      .status(400)
      .json({
        statusCode: status,
        message: 'Invalid ObjectId Format'
      });
  }
}
