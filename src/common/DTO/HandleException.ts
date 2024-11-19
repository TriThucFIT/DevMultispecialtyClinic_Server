import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    log("Into HttpExceptionFilter : ", exception.message);
    const errorResponse = {
      statusCode: status,
      message: exception.message, 
      data: null,
    };

    response
      .status(status)
      .json(errorResponse);
  }
}