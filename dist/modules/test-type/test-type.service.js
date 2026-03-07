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
exports.TestTypesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TestTypesService = class TestTypesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTestTypeDto) {
        const testType = await this.prisma.testType.create({
            data: createTestTypeDto
        });
        return {
            success: true,
            message: 'Test type created successfully',
            data: testType
        };
    }
    // GET ALL - Barcha test turlarini olish
    async findAll() {
        const testTypes = await this.prisma.testType.findMany({
            orderBy: { order: 'asc' }
        });
        return {
            success: true,
            total: testTypes.length,
            data: testTypes
        };
    }
    // GET ONE - Bitta test turni olish
    // async findOne(id: string) {
    //     const testType = await this.prisma.testType.findUnique({
    //         where: { id },
    //         include: {
    //             subjects: {
    //                 include: {
    //                     subject: {
    //                         select: {
    //                             id: true,
    //                             title: true
    //                         }
    //                     }
    //                 },
    //                 orderBy: { order: 'asc' }
    //             }
    //         }
    //     });
    //
    //     if (!testType) {
    //         throw new NotFoundException(`Test type with id ${id} not found`);
    //     }
    //
    //     // Test type ishlatilayotgan subjectlar
    //     const usedInSubjects = testType.subjects.map(st => ({
    //         subjectId: st.subjectId,
    //         subjectTitle: st.subject.title,
    //         order: st.order,
    //         customName: st.customName,
    //         questionCount: st.questionCount
    //     }));
    //
    //     // Ushbu test type ga tegishli savollar soni
    //     const questionsCount = await this.prisma.question.count({
    //         where: { testTypeId: id }
    //     });
    //
    //     return {
    //         success: true,
    //         data: {
    //             ...testType,
    //             usedInSubjects,
    //             totalQuestions: questionsCount
    //         }
    //     };
    // }
    // UPDATE - Test turni yangilash
    async update(id, updateTestTypeDto) {
        // TestType mavjudligini tekshirish
        const existingTestType = await this.prisma.testType.findUnique({
            where: { id }
        });
        if (!existingTestType) {
            throw new common_1.NotFoundException(`Test type with id ${id} not found`);
        }
        // Agar ID o'zgartirilayotgan bo'lsa, yangi ID mavjudligini tekshirish
        // if (updateTestTypeDto.id && updateTestTypeDto.id !== id) {
        //     const duplicateTestType = await this.prisma.testType.findUnique({
        //         where: { id: updateTestTypeDto.id }
        //     });
        //
        //     if (duplicateTestType) {
        //         throw new BadRequestException(`Test type with id ${updateTestTypeDto.id} already exists`);
        //     }
        // }
        const updatedTestType = await this.prisma.testType.update({
            where: { id },
            data: updateTestTypeDto
        });
        return {
            success: true,
            message: 'Test type updated successfully',
            data: updatedTestType
        };
    }
    // DELETE - Test turni o'chirish
    // async remove(id: string) {
    //     // TestType mavjudligini tekshirish
    //     const existingTestType = await this.prisma.testType.findUnique({
    //         where: { id },
    //         include: {
    //             subjects: {
    //                 take: 1
    //             }
    //         }
    //     });
    //
    //     if (!existingTestType) {
    //         throw new NotFoundException(`Test type with id ${id} not found`);
    //     }
    //
    //     // Agar test type subject ga bog'langan bo'lsa, o'chirishga ruxsat bermaslik
    //     if (existingTestType.subjects.length > 0) {
    //         throw new BadRequestException(
    //             `Cannot delete test type because it is used in subjects. Remove from subjects first.`
    //         );
    //     }
    //
    //     // Test type ga tegishli savollar borligini tekshirish
    //     const questionsCount = await this.prisma.question.count({
    //         where: { testTypeId: id }
    //     });
    //
    //     if (questionsCount > 0) {
    //         throw new BadRequestException(
    //             `Cannot delete test type because it has ${questionsCount} questions. Delete questions first.`
    //         );
    //     }
    //
    //     await this.prisma.testType.delete({
    //         where: { id }
    //     });
    //
    //     return {
    //         success: true,
    //         message: `Test type with id ${id} deleted successfully`
    //     };
    // }
    // GET BY IDS - Bir nechta test type ID lar bo'yicha olish
    async findByIds(ids) {
        const testTypes = await this.prisma.testType.findMany({
            where: {
                id: {
                    in: ids
                }
            },
            orderBy: { order: 'asc' }
        });
        // Berilgan ID larning hammasi topilganligini tekshirish
        const foundIds = testTypes.map(t => t.id);
        const missingIds = ids.filter(id => !foundIds.includes(id));
        return {
            success: true,
            data: testTypes,
            missingIds: missingIds.length > 0 ? missingIds : undefined
        };
    }
    // GET UNUSED - Hech qanday subjectda ishlatilmagan test turlari
    async getUnusedTestTypes() {
        const testTypes = await this.prisma.testType.findMany({
            where: {
                subjects: {
                    none: {} // Hech qanday subject bog'lanmagan
                }
            },
            orderBy: { order: 'asc' }
        });
        return {
            success: true,
            total: testTypes.length,
            data: testTypes
        };
    }
    // GET POPULAR - Eng ko'p subjectda ishlatilgan test turlari
    async getPopularTestTypes(limit = 5) {
        const testTypes = await this.prisma.testType.findMany({
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
            data: testTypes.map(type => ({
                ...type,
                usageCount: type._count.subjects
            }))
        };
    }
    // GET WITH_QUESTIONS_COUNT - Har bir test type dagi savollar soni bilan
    // async findAllWithQuestionsCount() {
    //     const testTypes = await this.prisma.testType.findMany({
    //         orderBy: { order: 'asc' }
    //     });
    //
    //     const result = await Promise.all(
    //         testTypes.map(async (type) => {
    //             const questionsCount = await this.prisma.question.count({
    //                 where: { testTypeId: type.id }
    //             });
    //
    //             return {
    //                 ...type,
    //                 questionsCount
    //             };
    //         })
    //     );
    //
    //     return {
    //         success: true,
    //         total: result.length,
    //         data: result
    //     };
    // }
    // GET BY_SUBJECT - Subject bo'yicha test turlarini olish
    async getBySubject(subjectId) {
        const subjectTestTypes = await this.prisma.subjectTestType.findMany({
            where: { subjectId },
            include: {
                testType: true
            },
            orderBy: { order: 'asc' }
        });
        return {
            success: true,
            subjectId,
            total: subjectTestTypes.length,
            data: subjectTestTypes.map(st => ({
                ...st.testType,
                customName: st.customName,
                questionCount: st.questionCount,
                order: st.order
            }))
        };
    }
};
exports.TestTypesService = TestTypesService;
exports.TestTypesService = TestTypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestTypesService);
