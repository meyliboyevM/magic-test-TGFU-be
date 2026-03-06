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
exports.QuestionsService = void 0;
// src/modules/questions/questions.service.ts
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service.");
let QuestionsService = class QuestionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createQuestionDto) {
        // Subject mavjudligini tekshirish
        const subject = await this.prisma.subject.findUnique({
            where: { id: createQuestionDto.subjectId }
        });
        if (!subject) {
            throw new common_1.BadRequestException(`Subject with id ${createQuestionDto.subjectId} not found`);
        }
        // correctIndex ni tekshirish
        if (createQuestionDto.correctIndex < 0 ||
            createQuestionDto.correctIndex >= createQuestionDto.options.length) {
            throw new common_1.BadRequestException(`correctIndex must be between 0 and ${createQuestionDto.options.length - 1}`);
        }
        // Savol matni unique ligini tekshirish
        const existingQuestion = await this.prisma.question.findFirst({
            where: { question: createQuestionDto.question }
        });
        if (existingQuestion) {
            throw new common_1.ConflictException(`Question "${createQuestionDto.question}" already exists`);
        }
        try {
            // Prisma.InputJsonValue formatiga o'tkazish
            const optionsJson = createQuestionDto.options;
            const question = await this.prisma.question.create({
                data: {
                    subjectId: createQuestionDto.subjectId,
                    question: createQuestionDto.question,
                    options: optionsJson,
                    correctIndex: createQuestionDto.correctIndex
                }
            });
            return {
                success: true,
                message: 'Question created successfully',
                data: {
                    id: question.id,
                    subjectId: question.subjectId,
                    question: question.question,
                    options: question.options,
                    correctIndex: question.correctIndex
                }
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException(`Question "${createQuestionDto.question}" already exists`);
                }
            }
            throw error;
        }
    }
    async getBySubject(subjectId) {
        const subject = await this.prisma.subject.findUnique({
            where: { id: subjectId }
        });
        if (!subject) {
            throw new common_1.BadRequestException(`Subject with id ${subjectId} not found`);
        }
        const questions = await this.prisma.question.findMany({
            where: { subjectId },
            orderBy: { id: 'asc' }
        });
        const formattedQuestions = questions.map(q => ({
            id: q.id,
            subjectId: q.subjectId,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex
        }));
        return {
            success: true,
            subjectId,
            total: formattedQuestions.length,
            data: formattedQuestions
        };
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionsService);
