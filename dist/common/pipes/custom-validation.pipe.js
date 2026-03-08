"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const validation_exception_factory_1 = require("../exceptions/validation.exception-factory");
class CustomValidationPipe extends common_1.ValidationPipe {
    constructor(options) {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: false,
            exceptionFactory: validation_exception_factory_1.createValidationException,
            ...options // Qo'shimcha optionslarni qabul qilish
        });
    }
}
exports.CustomValidationPipe = CustomValidationPipe;
