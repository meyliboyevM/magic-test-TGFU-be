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
exports.SubjectsController = void 0;
// src/modules/subjects/subjects.controller.ts
const common_1 = require("@nestjs/common");
const subjects_service_1 = require("./subjects.service");
const create_subject_dto_1 = require("./dto/create-subject.dto");
let SubjectsController = class SubjectsController {
    constructor(subjectsService) {
        this.subjectsService = subjectsService;
    }
    // POST /subjects - Yangi subject yaratish
    create(createSubjectDto) {
        return this.subjectsService.create(createSubjectDto);
    }
    // GET /subjects - Barcha subjectlarni olish
    findAll() {
        return this.subjectsService.findAll();
    }
    // GET /subjects/:id - Bitta subjectni olish
    findOne(id) {
        return this.subjectsService.findOne(id);
    }
    // PATCH /subjects/:id - Subjectni yangilash
    update(id, updateSubjectDto) {
        return this.subjectsService.update(id, updateSubjectDto);
    }
    // DELETE /subjects/:id - Subjectni o'chirish
    // @Delete(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // remove(@Param('id') id: string) {
    //     return this.subjectsService.remove(id);
    // }
    // POST /subjects/:subjectId/menus/:menuId - Subjectga menu qo'shish
    addMenu(subjectId, menuId, order) {
        return this.subjectsService.addMenu(subjectId, menuId, order);
    }
    // DELETE /subjects/:subjectId/menus/:menuId - Subjectdan menu o'chirish
    removeMenu(subjectId, menuId) {
        return this.subjectsService.removeMenu(subjectId, menuId);
    }
    // POST /subjects/:subjectId/test-types/:testTypeId - Subjectga test type qo'shish
    addTestType(subjectId, testTypeId, order) {
        return this.subjectsService.addTestType(subjectId, testTypeId, order);
    }
    // DELETE /subjects/:subjectId/test-types/:testTypeId - Subjectdan test type o'chirish
    removeTestType(subjectId, testTypeId) {
        return this.subjectsService.removeTestType(subjectId, testTypeId);
    }
};
exports.SubjectsController = SubjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subject_dto_1.CreateSubjectDto]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_subject_dto_1.UpdateSubjectDto]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':subjectId/menus/:menuId'),
    __param(0, (0, common_1.Param)('subjectId')),
    __param(1, (0, common_1.Param)('menuId')),
    __param(2, (0, common_1.Body)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "addMenu", null);
__decorate([
    (0, common_1.Delete)(':subjectId/menus/:menuId'),
    __param(0, (0, common_1.Param)('subjectId')),
    __param(1, (0, common_1.Param)('menuId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "removeMenu", null);
__decorate([
    (0, common_1.Post)(':subjectId/test-types/:testTypeId'),
    __param(0, (0, common_1.Param)('subjectId')),
    __param(1, (0, common_1.Param)('testTypeId')),
    __param(2, (0, common_1.Body)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "addTestType", null);
__decorate([
    (0, common_1.Delete)(':subjectId/test-types/:testTypeId'),
    __param(0, (0, common_1.Param)('subjectId')),
    __param(1, (0, common_1.Param)('testTypeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "removeTestType", null);
exports.SubjectsController = SubjectsController = __decorate([
    (0, common_1.Controller)('subjects'),
    __metadata("design:paramtypes", [subjects_service_1.SubjectsService])
], SubjectsController);
