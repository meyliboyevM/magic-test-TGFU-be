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
exports.MenusController = void 0;
// src/modules/menus/menus.controller.ts
const common_1 = require("@nestjs/common");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const menu_service_1 = require("./menu.service");
let MenusController = class MenusController {
    constructor(menusService) {
        this.menusService = menusService;
    }
    // POST /menus - Yangi menu yaratish
    create(createMenuDto) {
        return this.menusService.create(createMenuDto);
    }
    // GET /menus - Barcha menularni olish
    findAll() {
        return this.menusService.findAll();
    }
    // GET /menus/unused - Hech qanday subjectda ishlatilmagan menular
    getUnusedMenus() {
        return this.menusService.getUnusedMenus();
    }
    // GET /menus/popular - Eng ko'p ishlatilgan menular
    getPopularMenus(limit) {
        return this.menusService.getPopularMenus(limit);
    }
    // GET /menus/by-ids?ids=id1,id2,id3 - Bir nechta ID lar bo'yicha olish
    // @Get('by-ids')
    // findByIds(@Query('ids') ids: string) {
    //     const idArray = ids.split(',').map(id => id.trim());
    //     return this.menusService.findByIds(idArray);
    // }
    // GET /menus/:id - Bitta menuni olish
    findOne(id) {
        return this.menusService.findOne(id);
    }
    // PATCH /menus/:id - Menuni yangilash
    update(id, updateMenuDto) {
        return this.menusService.update(id, updateMenuDto);
    }
    // DELETE /menus/:id - Menuni o'chirish
    remove(id) {
        return this.menusService.remove(id);
    }
};
exports.MenusController = MenusController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_dto_1.CreateMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unused'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "getUnusedMenus", null);
__decorate([
    (0, common_1.Get)('popular'),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(5), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "getPopularMenus", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "remove", null);
exports.MenusController = MenusController = __decorate([
    (0, common_1.Controller)('menus'),
    __metadata("design:paramtypes", [menu_service_1.MenusService])
], MenusController);
