// src/modules/subjects/subjects.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {CreateSubjectDto, UpdateSubjectDto} from './dto/create-subject.dto';
import {PrismaService} from "../../prisma/prisma.service.";

@Injectable()
export class SubjectsService {
    constructor(private prisma: PrismaService) {}

    // CREATE - Yangi subject yaratish
    async create(createSubjectDto: CreateSubjectDto) {
        const { menuIds, testTypeIds, ...subjectData } = createSubjectDto;

        // Subject ID mavjudligini tekshirish
        const existingSubject = await this.prisma.subject.findUnique({
            where: { id: subjectData.id }
        });

        if (existingSubject) {
            throw new BadRequestException(`Subject with id ${subjectData.id} already exists`);
        }

        // Subject yaratish
        const subject = await this.prisma.subject.create({
            data: {
                ...subjectData,
                // Menularni bog'lash (agar berilgan bo'lsa)
                menus: menuIds ? {
                    create: menuIds.map((menuId, index) => ({
                        menuId,
                        order: index + 1
                    }))
                } : undefined,
                // Test turlarini bog'lash (agar berilgan bo'lsa)
                test_types: testTypeIds ? {
                    create: testTypeIds.map((testTypeId, index) => ({
                        testTypeId,
                        order: index + 1
                    }))
                } : undefined
            },
            include: {
                menus: {
                    include: {
                        menu: true
                    }
                },
                test_types: {
                    include: {
                        testType: true
                    }
                }
            }
        });

        return this.formatSubjectResponse(subject);
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
                test_types: {
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
    async findOne(id: string) {
        const subject = await this.prisma.subject.findUnique({
            where: { id },
            include: {
                menus: {
                    include: {
                        menu: true
                    },
                    orderBy: { order: 'asc' }
                },
                test_types: {
                    include: {
                        testType: true
                    },
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!subject) {
            throw new NotFoundException(`Subject with id ${id} not found`);
        }

        return this.formatSubjectResponse(subject);
    }

    // UPDATE - Subjectni yangilash
    async update(id: string, updateSubjectDto: UpdateSubjectDto) {
        const { menuIds, testTypeIds, ...subjectData } = updateSubjectDto;

        // Subject mavjudligini tekshirish
        const existingSubject = await this.prisma.subject.findUnique({
            where: { id }
        });

        if (!existingSubject) {
            throw new NotFoundException(`Subject with id ${id} not found`);
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
                    test_types: {
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
    private formatSubjectResponse(subject: any) {
        return {
            id: subject.id,
            title: subject.title,
            totalQuestions: subject.totalQuestions,
            timeLimitMinutes: subject.timeLimitMinutes,
            questionsPerTest: subject.questionsPerTest,
            menus: subject.menus?.map(sm => ({
                id: sm.menu.id,
                title: sm.menu.title,
                icon: sm.menu.icon,
                description: sm.menu.description,
                bgColor: sm.menu.bgColor,
                order: sm.order
            })) || [],
            test_types: subject.test_types?.map(st => ({
                id: st.testType.id,
                name: st.testType.name,
                description: st.testType.description,
                icon: st.testType.icon,
                order: st.order,
                questionCount: st.questionCount
            })) || []
        };
    }

    // Subjectga menu qo'shish
    async addMenu(subjectId: string, menuId: string, order?: number) {
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
    async removeMenu(subjectId: string, menuId: string) {
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
    async addTestType(subjectId: string, testTypeId: string, order?: number) {
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
    async removeTestType(subjectId: string, testTypeId: string) {
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
}