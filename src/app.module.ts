import { Module } from '@nestjs/common';
import { QuestionsController } from "./modules/questions/questions.controller";
import { QuestionsService } from "./modules/questions/questions.service";
import {SubjectsController} from "./modules/subjects/subjects.controller";
import {SubjectsService} from "./modules/subjects/subjects.service";
import {MenusController} from "./modules/menu/menu.controller";
import {MenusService} from "./modules/menu/menu.service";
import {TestTypesController} from "./modules/test-type/test-type.controller";
import {TestTypesService} from "./modules/test-type/test-type.service";
import {PrismaService} from "./prisma/prisma.service";

@Module({
    controllers: [
        MenusController,
        TestTypesController,
        SubjectsController,
        QuestionsController,
    ],
    providers: [
        MenusService,
        TestTypesService,
        SubjectsService,
        QuestionsService,
        PrismaService
    ],
})
export class AppModule {}