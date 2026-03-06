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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenusService = void 0;
// src/modules/menus/menus.service.ts
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service.");
let MenusService = class MenusService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // CREATE - Yangi menu yaratish
    async create(createMenuDto) {
        // Menu ID mavjudligini tekshirish
        const existingMenu = await this.prisma.menu.findUnique({
            where: { id: createMenuDto.id }
        });
        if (existingMenu) {
            throw new common_1.BadRequestException(`Menu with id ${createMenuDto.id} already exists`);
        }
        const menu = await this.prisma.menu.create({
            data: createMenuDto
        });
        return {
            success: true,
            message: 'Menu created successfully',
            data: menu
        };
    }
    // GET ALL - Barcha menularni olish
    async findAll() {
        const menus = await this.prisma.menu.findMany({
            orderBy: { order: 'asc' }
        });
        return {
            success: true,
            total: menus.length,
            data: menus
        };
    }
    // GET ONE - Bitta menuni olish
    async findOne(id) {
        const menu = await this.prisma.menu.findUnique({
            where: { id },
            include: {
                subjects: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                }
            }
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu with id ${id} not found`);
        }
        // Menu ishlatilayotgan subjectlar
        const usedInSubjects = menu.subjects.map(sm => ({
            subjectId: sm.subjectId,
            subjectTitle: sm.subject.title,
            order: sm.order
        }));
        return {
            success: true,
            data: {
                ...menu,
                usedInSubjects
            }
        };
    }
    // UPDATE - Menuni yangilash
    async update(id, updateMenuDto) {
        // Menu mavjudligini tekshirish
        const existingMenu = await this.prisma.menu.findUnique({
            where: { id }
        });
        if (!existingMenu) {
            throw new common_1.NotFoundException(`Menu with id ${id} not found`);
        }
        // Agar ID o'zgartirilayotgan bo'lsa, yangi ID mavjudligini tekshirish
        if (updateMenuDto.id && updateMenuDto.id !== id) {
            const duplicateMenu = await this.prisma.menu.findUnique({
                where: { id: updateMenuDto.id }
            });
            if (duplicateMenu) {
                throw new common_1.BadRequestException(`Menu with id ${updateMenuDto.id} already exists`);
            }
        }
        const updatedMenu = await this.prisma.menu.update({
            where: { id },
            data: updateMenuDto
        });
        return {
            success: true,
            message: 'Menu updated successfully',
            data: updatedMenu
        };
    }
    // DELETE - Menuni o'chirish
    async remove(id) {
        // Menu mavjudligini tekshirish
        const existingMenu = await this.prisma.menu.findUnique({
            where: { id },
            include: {
                subjects: {
                    take: 1 // Faqat bitta subject bog'langanligini tekshirish uchun
                }
            }
        });
        if (!existingMenu) {
            throw new common_1.NotFoundException(`Menu with id ${id} not found`);
        }
        // Agar menu subject ga bog'langan bo'lsa, o'chirishga ruxsat bermaslik
        if (existingMenu.subjects.length > 0) {
            throw new common_1.BadRequestException(`Cannot delete menu because it is used in subjects. Remove from subjects first.`);
        }
        await this.prisma.menu.delete({
            where: { id }
        });
        return {
            success: true,
            message: `Menu with id ${id} deleted successfully`
        };
    }
    // GET MENU BY IDS - Bir nechta menu ID lar bo'yicha olish
    async findByIds(ids) {
        const menus = await this.prisma.menu.findMany({
            where: {
                id: {
                    in: ids
                }
            },
            orderBy: { order: 'asc' }
        });
        // Berilgan ID larning hammasi topilganligini tekshirish
        const foundIds = menus.map(m => m.id);
        const missingIds = ids.filter(id => !foundIds.includes(id));
        return {
            success: true,
            data: menus,
            missingIds: missingIds.length > 0 ? missingIds : undefined
        };
    }
    // GET UNUSED MENUS - Hech qanday subjectda ishlatilmagan menular
    async getUnusedMenus() {
        const menus = await this.prisma.menu.findMany({
            where: {
                subjects: {
                    none: {} // Hech qanday subject bog'lanmagan
                }
            },
            orderBy: { order: 'asc' }
        });
        return {
            success: true,
            total: menus.length,
            data: menus
        };
    }
    // GET POPULAR MENUS - Eng ko'p subjectda ishlatilgan menular
    async getPopularMenus(limit = 5) {
        const menus = await this.prisma.menu.findMany({
            include: {
                _count: {
                    select: { subjects: true }
                }
            },
            orderBy: {
                subjects: {
                    _count: 'desc'
                }
            },
            take: limit
        });
        return {
            success: true,
            data: menus.map(menu => ({
                ...menu,
                usageCount: menu._count.subjects
            }))
        };
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenusService);
