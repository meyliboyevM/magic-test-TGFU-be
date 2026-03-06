"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const questions_controller_1 = require("./modules/questions/questions.controller");
const questions_service_1 = require("./modules/questions/questions.service");
const prisma_service_1 = require("./prisma/prisma.service.");
const subjects_controller_1 = require("./modules/subjects/subjects.controller");
const subjects_service_1 = require("./modules/subjects/subjects.service");
const menu_controller_1 = require("./modules/menu/menu.controller");
const menu_service_1 = require("./modules/menu/menu.service");
const test_type_controller_1 = require("./modules/test-type/test-type.controller");
const test_type_service_1 = require("./modules/test-type/test-type.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            menu_controller_1.MenusController,
            test_type_controller_1.TestTypesController,
            subjects_controller_1.SubjectsController,
            questions_controller_1.QuestionsController,
        ],
        providers: [
            menu_service_1.MenusService,
            test_type_service_1.TestTypesService,
            subjects_service_1.SubjectsService,
            questions_service_1.QuestionsService,
            prisma_service_1.PrismaService
        ],
    })
], AppModule);
