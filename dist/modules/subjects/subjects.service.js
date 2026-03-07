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
exports.SubjectsService = void 0;
// src/modules/subjects/subjects.service.ts
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SubjectsService = class SubjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // CREATE - Yangi subject yaratish
    async create(createSubjectDto) {
        const { menuIds, testTypeIds, ...subjectData } = createSubjectDto;
        // Subject mavjudligini tekshirish
        const existingSubject = await this.prisma.subject.findUnique({
            where: { id: subjectData.id },
        });
        if (existingSubject) {
            throw new common_1.BadRequestException(`Subject with id ${subjectData.id} already exists`);
        }
        try {
            const subject = await this.prisma.subject.create({
                data: {
                    ...subjectData,
                    // Menularni bog‘lash
                    menus: menuIds
                        ? {
                            create: menuIds.map((menuId, index) => ({
                                menuId,
                                order: index + 1,
                            })),
                        }
                        : undefined,
                    // Test turlarini bog‘lash
                    testTypes: testTypeIds
                        ? {
                            create: testTypeIds.map((testTypeId, index) => ({
                                testTypeId,
                                order: index + 1,
                            })),
                        }
                        : undefined,
                },
                include: {
                    menus: {
                        include: {
                            menu: true,
                        },
                    },
                    testTypes: {
                        include: {
                            testType: true,
                        },
                    },
                },
            });
            return this.formatSubjectResponse(subject);
        }
        catch (error) {
            // Prisma foreign key xatosi
            if (error.code === 'P2003') {
                throw new common_1.BadRequestException('Invalid menuIds or testTypeIds. Related record not found.');
            }
            // Prisma duplicate xatosi
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Subject already exists or unique constraint failed.');
            }
            throw error;
        }
    }
    // GET ALL - Barcha subjectlarni olish
    async findAll() {
        const subjects = await this.prisma.subject.findMany({
            include: {
                menus: {
                    include: {
                        menu: true
                    },
                    orderBy: { order: 'asc' }
                },
                testTypes: {
                    include: {
                        testType: true
                    },
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { id: 'asc' }
        });
        return subjects.map(subject => this.formatSubjectResponse(subject));
    }
    // GET ONE - Bitta subjectni olish
    async findOne(id) {
        const subject = await this.prisma.subject.findUnique({
            where: { id },
            include: {
                menus: {
                    include: {
                        menu: true
                    },
                    orderBy: { order: 'asc' }
                },
                testTypes: {
                    include: {
                        testType: true
                    },
                    orderBy: { order: 'asc' }
                }
            }
        });
        if (!subject) {
            throw new common_1.NotFoundException(`Subject with id ${id} not found`);
        }
        return this.formatSubjectResponse(subject);
    }
    // UPDATE - Subjectni yangilash
    async update(id, updateSubjectDto) {
        const { menuIds, testTypeIds, ...subjectData } = updateSubjectDto;
        // Subject mavjudligini tekshirish
        const existingSubject = await this.prisma.subject.findUnique({
            where: { id }
        });
        if (!existingSubject) {
            throw new common_1.NotFoundException(`Subject with id ${id} not found`);
        }
        // Subjectni yangilash va menular/test turlarini yangilash
        const subject = await this.prisma.$transaction(async (prisma) => {
            // Subject ma'lumotlarini yangilash
            const updated = await prisma.subject.update({
                where: { id },
                data: subjectData
            });
            // Agar menuIds berilgan bo'lsa, menularni yangilash
            if (menuIds) {
                // Eski menularni o'chirish
                await prisma.subjectMenu.deleteMany({
                    where: { subjectId: id }
                });
                // Yangi menularni qo'shish
                if (menuIds.length > 0) {
                    await prisma.subjectMenu.createMany({
                        data: menuIds.map((menuId, index) => ({
                            subjectId: id,
                            menuId,
                            order: index + 1
                        }))
                    });
                }
            }
            // Agar testTypeIds berilgan bo'lsa, test turlarini yangilash
            if (testTypeIds) {
                // Eski test turlarini o'chirish
                await prisma.subjectTestType.deleteMany({
                    where: { subjectId: id }
                });
                // Yangi test turlarini qo'shish
                if (testTypeIds.length > 0) {
                    await prisma.subjectTestType.createMany({
                        data: testTypeIds.map((testTypeId, index) => ({
                            subjectId: id,
                            testTypeId,
                            order: index + 1
                        }))
                    });
                }
            }
            // Yangilangan subjectni qaytarish
            return prisma.subject.findUnique({
                where: { id },
                include: {
                    menus: {
                        include: { menu: true },
                        orderBy: { order: 'asc' }
                    },
                    testTypes: {
                        include: { testType: true },
                        orderBy: { order: 'asc' }
                    }
                }
            });
        });
        return this.formatSubjectResponse(subject);
    }
    // DELETE - Subjectni o'chirish
    // async remove(id: string) {
    //     // Subject mavjudligini tekshirish
    //     const existingSubject = await this.prisma.subject.findUnique({
    //         where: { id },
    //         include: {
    //             questions: true // Savollarni ham tekshirish
    //         }
    //     });
    //
    //     if (!existingSubject) {
    //         throw new NotFoundException(`Subject with id ${id} not found`);
    //     }
    //
    //     // Agar subjectga tegishli savollar bo'lsa, ularni ham o'chirish
    //     if (existingSubject.questions.length > 0) {
    //         await this.prisma.$transaction([
    //             // Avval optionlarni o'chirish
    //             this.prisma.option.deleteMany({
    //                 where: {
    //                     question: {
    //                         subjectId: id
    //                     }
    //                 }
    //             }),
    //             // Keyin savollarni o'chirish
    //             this.prisma.question.deleteMany({
    //                 where: { subjectId: id }
    //             }),
    //             // Subject menularini o'chirish
    //             this.prisma.subjectMenu.deleteMany({
    //                 where: { subjectId: id }
    //             }),
    //             // Subject test turlarini o'chirish
    //             this.prisma.subjectTestType.deleteMany({
    //                 where: { subjectId: id }
    //             }),
    //             // Subjectni o'chirish
    //             this.prisma.subject.delete({
    //                 where: { id }
    //             })
    //         ]);
    //     } else {
    //         // Agar savollar bo'lmasa, to'g'ridan-to'g'ri o'chirish
    //         await this.prisma.$transaction([
    //             this.prisma.subjectMenu.deleteMany({ where: { subjectId: id } }),
    //             this.prisma.subjectTestType.deleteMany({ where: { subjectId: id } }),
    //             this.prisma.subject.delete({ where: { id } })
    //         ]);
    //     }
    //
    //     return { message: `Subject with id ${id} deleted successfully` };
    // }
    // Helper function - subject responseni formatlash
    formatSubjectResponse(subject) {
        var _a, _b;
        return {
            id: subject.id,
            title: subject.title,
            totalQuestions: subject.totalQuestions,
            timeLimitMinutes: subject.timeLimitMinutes,
            questionsPerTest: subject.questionsPerTest,
            menus: ((_a = subject.menus) === null || _a === void 0 ? void 0 : _a.map(sm => ({
                id: sm.menu.id,
                title: sm.menu.title,
                icon: sm.menu.icon,
                description: sm.menu.description,
                bgColor: sm.menu.bgColor,
                order: sm.order
            }))) || [],
            test_types: ((_b = subject.test_types) === null || _b === void 0 ? void 0 : _b.map(st => ({
                id: st.testType.id,
                name: st.testType.name,
                description: st.testType.description,
                icon: st.testType.icon,
                order: st.order,
                questionCount: st.questionCount
            }))) || []
        };
    }
    // Subjectga menu qo'shish
    async addMenu(subjectId, menuId, order) {
        const subjectMenu = await this.prisma.subjectMenu.create({
            data: {
                subjectId,
                menuId,
                order: order || 0
            },
            include: {
                menu: true
            }
        });
        return subjectMenu;
    }
    // Subjectdan menu o'chirish
    async removeMenu(subjectId, menuId) {
        await this.prisma.subjectMenu.delete({
            where: {
                subjectId_menuId: {
                    subjectId,
                    menuId
                }
            }
        });
        return { message: 'Menu removed from subject' };
    }
    // Subjectga test type qo'shish
    async addTestType(subjectId, testTypeId, order) {
        const subjectTestType = await this.prisma.subjectTestType.create({
            data: {
                subjectId,
                testTypeId,
                order: order || 0
            },
            include: {
                testType: true
            }
        });
        return subjectTestType;
    }
    // Subjectdan test type o'chirish
    async removeTestType(subjectId, testTypeId) {
        await this.prisma.subjectTestType.delete({
            where: {
                subjectId_testTypeId: {
                    subjectId,
                    testTypeId
                }
            }
        });
        return { message: 'Test type removed from subject' };
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubjectsService);
