import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { createValidationException } from '../exceptions/validation.exception-factory';

export class CustomValidationPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions) {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: false,
            exceptionFactory: createValidationException,
            ...options // Qo'shimcha optionslarni qabul qilish
        });
    }
}