"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidationException = createValidationException;
const common_1 = require("@nestjs/common");
function createValidationException(errors) {
    const formattedErrors = errors.map(error => ({
        field: error.property,
        errors: Object.values(error.constraints || {})
    }));
    return new common_1.BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
        statusCode: 400,
        timestamp: new Date().toISOString()
    });
}
