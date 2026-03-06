// src/modules/questions/questions.service.ts
import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Prisma } from '@prisma/client';
import {PrismaService} from "../../prisma/prisma.service.";

@Injectable()
export class QuestionsService {
    constructor(private prisma: PrismaService) {}

    async create(createQuestionDto: CreateQuestionDto) {
        // Subject mavjudligini tekshirish
        const subject = await this.prisma.subject.findUnique({
            where: { id: createQuestionDto.subjectId }
        });

        if (!subject) {
            throw new BadRequestException(`Subject with id ${createQuestionDto.subjectId} not found`);
        }

        // correctIndex ni tekshirish
        if (createQuestionDto.correctIndex < 0 ||
            createQuestionDto.correctIndex >= createQuestionDto.options.length) {
            throw new BadRequestException(`correctIndex must be between 0 and ${createQuestionDto.options.length - 1}`);
        }

        // Savol matni unique ligini tekshirish
        const existingQuestion = await this.prisma.question.findFirst({
            where: { question: createQuestionDto.question }
        });

        if (existingQuestion) {
            throw new ConflictException(`Question "${createQuestionDto.question}" already exists`);
        }

        try {
            // Prisma.InputJsonValue formatiga o'tkazish
            const optionsJson = createQuestionDto.options as Prisma.InputJsonValue;

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
                    options: question.options as string[],
                    correctIndex: question.correctIndex
                }
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException(`Question "${createQuestionDto.question}" already exists`);
                }
            }
            throw error;
        }
    }

    async getBySubject(subjectId: string) {
        const subject = await this.prisma.subject.findUnique({
            where: { id: subjectId }
        });

        if (!subject) {
            throw new BadRequestException(`Subject with id ${subjectId} not found`);
        }

        const questions = await this.prisma.question.findMany({
            where: { subjectId },
            orderBy: { id: 'asc' }
        });

        const formattedQuestions = questions.map(q => ({
            id: q.id,
            subjectId: q.subjectId,
            question: q.question,
            options: q.options as string[],
            correctIndex: q.correctIndex
        }));

        return {
            success: true,
            subjectId,
            total: formattedQuestions.length,
            data: formattedQuestions
        };
    }

    // async findOne(id: number) {
    //     const question = await this.prisma.question.findUnique({
    //         where: { id },
    //         include: {
    //             subject: {
    //                 select: {
    //                     id: true,
    //                     title: true
    //                 }
    //             }
    //         }
    //     });
    //
    //     if (!question) {
    //         throw new NotFoundException(`Question with id ${id} not found`);
    //     }
    //
    //     return {
    //         success: true,
    //         data: {
    //             id: question.id,
    //             subjectId: question.subjectId,
    //             // subjectTitle: question.subject.title,
    //             question: question.question,
    //             options: question.options as string[],
    //             correctIndex: question.correctIndex
    //         }
    //     };
    // }
}