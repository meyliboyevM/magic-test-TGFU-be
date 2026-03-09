// src/modules/menus/menus.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {CreateMenuDto, UpdateMenuDto} from "./dto/create-menu.dto";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class MenusService {
    constructor(private prisma: PrismaService) {}

    async create(createMenuDto: CreateMenuDto) {

        const menu = await this.prisma.menu.create({
            data: createMenuDto as any,
        });

        return {
            success: true,
            message: 'Menu created successfully',
            data: menu,
        };
    }

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
    async findOne(id: number) {
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
            throw new NotFoundException(`Menu with id ${id} not found`);
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
    async update(id: number, updateMenuDto: any[]) {
        // Menu mavjudligini tekshirish
        const existingMenu = await this.prisma.menu.findUnique({
            where: { id }
        });

        if (!existingMenu) {
            throw new NotFoundException(`Menu with id ${id} not found`);
        }

        // Agar ID o'zgartirilayotgan bo'lsa, yangi ID mavjudligini tekshirish
        // if (updateMenuDto.id && updateMenuDto.id !== id) {
        //     const duplicateMenu = await this.prisma.menu.findUnique({
        //         where: { id: updateMenuDto.id }
        //     });
        //
        //     if (duplicateMenu) {
        //         throw new BadRequestException(`Menu with id ${updateMenuDto.id} already exists`);
        //     }
        // }

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
    async remove(id: number) {
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
            throw new NotFoundException(`Menu with id ${id} not found`);
        }

        // Agar menu subject ga bog'langan bo'lsa, o'chirishga ruxsat bermaslik
        if (existingMenu.subjects.length > 0) {
            throw new BadRequestException(
                `Cannot delete menu because it is used in subjects. Remove from subjects first.`
            );
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
    async findByIds(ids: number[]) {
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
    async getPopularMenus(limit: number = 5) {
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
}