import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const details =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    const errorResponse = {
      success: false,
      error: {
        code: exception instanceof HttpException ? (details as any)?.code || 'HTTP_ERROR' : 'INTERNAL_ERROR',
        message: message,
        details: typeof details === 'object' ? details : { raw: details },
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `${request.method} ${request.url} failed with status ${status}: ${
        exception instanceof Error ? exception.stack || exception.message : JSON.stringify(exception)
      }`,
    );

    response.status(status).json(errorResponse);
  }
}
