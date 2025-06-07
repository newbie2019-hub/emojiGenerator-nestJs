import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const switchToHttp = host.switchToHttp();
    const request = switchToHttp.getResponse<Request>();
    const response = switchToHttp.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException ? exception.getStatus() : 500;

    response.status(statusCode);
    response.json({
      message: isHttpException ? exception['message'] : 'Internal server error',
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
