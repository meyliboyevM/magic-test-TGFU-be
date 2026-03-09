// src/modules/subjects/subjects.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {CreateSubjectDto, UpdateSubjectDto} from './dto/create-subject.dto';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class SubjectsService {
    constructor(private prisma: PrismaService) {}

    async create(createSubjectDto: CreateSubjectDto) {
        const { menuIds, testTypeIds, ...subjectData } = createSubjectDto;

        const existingSubject = await this.prisma.subject.findUnique({
            where: { id: subjectData.id },
        });

        if (existingSubject) {
            throw new BadRequestException(
                `Subject with id ${subjectData.id} already exists`,
            );
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

        } catch (error) {

            // Prisma foreign key xatosi
            if (
                error.code === 'P2003'
            ) {
                throw new BadRequestException(
                    'Invalid menuIds or testTypeIds. Related record not found.',
                );
            }

            // Prisma duplicate xatosi
            if (
                error.code === 'P2002'
            ) {
                throw new BadRequestException(
                    'Subject already exists or unique constraint failed.',
                );
            }

            throw error;
        }
    }

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

        return {
            success: true,
            total: subjects.map(subject => this.formatSubjectResponse(subject)).length,
            data: subjects.map(subject => this.formatSubjectResponse(subject))
        };

        // return subjects.map(subject => this.formatSubjectResponse(subject));
    }

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
                testTypes: {
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
    //             this.prisma.options.deleteMany({
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
    async remove(id: string) {
        // Subjectni key orqali qidirish
        const existingSubject = await this.prisma.subject.findFirst({
            where: {
                OR: [
                    { id: id },
                    { key: id }  // Agar key fieldi bo'lsa
                ]
            }
        });

        if (!existingSubject) {
            throw new NotFoundException(`Subject with id/key ${id} not found`);
        }

        // Subjectni o'chirish
        await this.prisma.subject.delete({
            where: { id: existingSubject.id }  // UUID bilan o'chirish
        });

        return {
            success: true,
            message: `Subject with id ${id} deleted successfully`
        };
    }

    // Helper function - subject responseni formatlash
    private formatSubjectResponse(subject: any) {
        return {
            id: subject.id,
            key: subject.key,
            title: subject.title,
            icon: subject.icon,
            bgColor: subject.bgColor,
            totalQuestions: subject.totalQuestions,
            timeLimitMinutes: subject.timeLimitMinutes,
            questionsPerTest: subject.questionsPerTest,
            menus: subject.menus?.map(sm => ({
                id: sm.menu.id,
                key: sm.menu.key,
                type: sm.menu.type,
                title: sm.menu.title,
                description: sm.menu.description,
                icon: sm.menu.icon,
                bgColor: sm.menu.bgColor,
                disabled: sm.menu.disabled,
                order: sm.order
            })) || [],
            testTypes: subject.testTypes?.map(st => ({
                id: st.testType.id,
                key: st.testType.key,
                type: st.testType.type,
                title: st.testType.title,
                description: st.testType.description,
                icon: st.testType.icon,
                bgColor: st.bgColor,
                disabled: st.disabled,
                order: st.order,
            })) || []
        };
    }

    // Subjectga menu qo'shish
    async addMenu(subjectId: string, menuId: number, order?: number) {
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
    async removeMenu(subjectId: string, menuId: number) {
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
    async addTestType(subjectId: string, testTypeId: number, order?: number) {
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
    async removeTestType(subjectId: string, testTypeId: number) {
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