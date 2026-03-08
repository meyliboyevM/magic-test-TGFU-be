import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {AllExceptionsFilter, CustomValidationPipe} from "./common";

async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    app.enableCors({origin: '*'})

    // Custom ValidationPipe ni ishlatish
    app.useGlobalPipes(new CustomValidationPipe());

    // Global Exception Filter ni ishlatish
    app.useGlobalFilters(new AllExceptionsFilter());

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();