// src/modules/questions/questions.controller.ts
import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @Post()
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionsService.create(createQuestionDto);
    }

    @Get('subject/:subjectId')
    getBySubject(@Param('subjectId') subjectId: string) {
        return this.questionsService.getBySubject(subjectId);
    }

    // @Get(':id')
    // findOne(@Param('id', ParseIntPipe) id: number) {
    //     return this.questionsService.findOne(id);
    // }

    // @Patch(':id')
    // update(
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body() updateData: Partial<CreateQuestionDto>
    // ) {
    //     return this.questionsService.update(id, updateData);
    // }

    // @Delete(':id')
    // remove(@Param('id', ParseIntPipe) id: number) {
    //     return this.questionsService.remove(id);
    // }
}