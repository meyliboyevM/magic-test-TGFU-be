"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTypesController = void 0;
// src/modules/test-types/test-types.controller.ts
const common_1 = require("@nestjs/common");
const create_test_type_dto_1 = require("./dto/create-test-type.dto");
const test_type_service_1 = require("./test-type.service");
let TestTypesController = class TestTypesController {
    constructor(testTypesService) {
        this.testTypesService = testTypesService;
    }
    // POST /test-types - Yangi test type yaratish
    create(createTestTypeDto) {
        return this.testTypesService.create(createTestTypeDto);
    }
    // GET /test-types - Barcha test turlarini olish
    findAll() {
        return this.testTypesService.findAll();
    }
    // GET /test-types/with-count - Savollar soni bilan
    // @Get('with-count')
    // findAllWithQuestionsCount() {
    //     return this.testTypesService.findAllWithQuestionsCount();
    // }
    // GET /test-types/unused - Ishlatilmagan test turlari
    getUnusedTestTypes() {
        return this.testTypesService.getUnusedTestTypes();
    }
    // GET /test-types/popular - Eng ko'p ishlatilgan test turlari
    getPopularTestTypes(limit) {
        return this.testTypesService.getPopularTestTypes(limit);
    }
    // GET /test-types/by-subject/:subjectId - Subject bo'yicha test turlari
    getBySubject(subjectId) {
        return this.testTypesService.getBySubject(subjectId);
    }
    // GET /test-types/by-ids?ids=id1,id2,id3 - Bir nechta ID lar bo'yicha
    findByIds(ids) {
        const idArray = ids.split(',').map(id => id.trim());
        return this.testTypesService.findByIds(idArray);
    }
    // GET /test-types/:id - Bitta test turni olish
    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.testTypesService.findOne(id);
    // }
    // PATCH /test-types/:id - Test turni yangilash
    update(id, updateTestTypeDto) {
        return this.testTypesService.update(id, updateTestTypeDto);
    }
};
exports.TestTypesController = TestTypesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_test_type_dto_1.CreateTestTypeDto]),
    __metadata("design:returntype", void 0)
], TestTypesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestTypesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unused'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestTypesController.prototype, "getUnusedTestTypes", null);
__decorate([
    (0, common_1.Get)('popular'),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(5), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TestTypesController.prototype, "getPopularTestTypes", null);
__decorate([
    (0, common_1.Get)('by-subject/:subjectId'),
    __param(0, (0, common_1.Param)('subjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestTypesController.prototype, "getBySubject", null);
__decorate([
    (0, common_1.Get)('by-ids'),
    __param(0, (0, common_1.Query)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestTypesController.prototype, "findByIds", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_test_type_dto_1.UpdateTestTypeDto]),
    __metadata("design:returntype", void 0)
], TestTypesController.prototype, "update", null);
exports.TestTypesController = TestTypesController = __decorate([
    (0, common_1.Controller)('test-types'),
    __metadata("design:paramtypes", [test_type_service_1.TestTypesService])
], TestTypesController);
