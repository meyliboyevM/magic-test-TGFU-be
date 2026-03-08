import { ValidationError, BadRequestException } from '@nestjs/common';

export function createValidationException(errors: ValidationError[]) {
    const formattedErrors = errors.map(error => ({
        field: error.property,
        errors: Object.values(error.constraints || {})
    }));

    return new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
        statusCode: 400,
        timestamp: new Date().toISOString()
    });
}