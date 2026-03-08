import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let errorResponse: ErrorResponse;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object') {
                errorResponse = {
                    success: false,
                    ...exceptionResponse as object,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    method: request.method
                } as ErrorResponse;
            } else {
                errorResponse = {
                    success: false,
                    message: exceptionResponse as string,
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    method: request.method
                };
            }
        } else {
            // Noma'lum xatolar uchun
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorResponse = {
                success: false,
                message: 'Internal server error',
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method
            };
        }

        response.status(status).json(errorResponse);
    }
}