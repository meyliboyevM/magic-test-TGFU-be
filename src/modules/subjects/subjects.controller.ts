// src/modules/subjects/subjects.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    ParseIntPipe
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import {CreateSubjectDto, UpdateSubjectDto} from './dto/create-subject.dto';

@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) {}

    // POST /subjects - Yangi subject yaratish
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createSubjectDto: CreateSubjectDto) {
        return this.subjectsService.create(createSubjectDto);
    }

    // GET /subjects - Barcha subjectlarni olish
    @Get()
    findAll() {
        return this.subjectsService.findAll();
    }

    // GET /subjects/:id - Bitta subjectni olish
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.subjectsService.findOne(id);
    }

    // PATCH /subjects/:id - Subjectni yangilash
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
        return this.subjectsService.update(id, updateSubjectDto);
    }

    // DELETE /subjects/:id - Subjectni o'chirish
    // @Delete(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // remove(@Param('id') id: string) {
    //     return this.subjectsService.remove(id);
    // }

    // POST /subjects/:subjectId/menus/:menuId - Subjectga menu qo'shish
    @Post(':subjectId/menus/:menuId')
    addMenu(
        @Param('subjectId') subjectId: string,
        @Param('menuId') menuId: string,
        @Body('order') order?: number
    ) {
        return this.subjectsService.addMenu(subjectId, menuId, order);
    }

    // DELETE /subjects/:subjectId/menus/:menuId - Subjectdan menu o'chirish
    @Delete(':subjectId/menus/:menuId')
    removeMenu(
        @Param('subjectId') subjectId: string,
        @Param('menuId') menuId: string
    ) {
        return this.subjectsService.removeMenu(subjectId, menuId);
    }

    // POST /subjects/:subjectId/test-types/:testTypeId - Subjectga test type qo'shish
    @Post(':subjectId/test-types/:testTypeId')
    addTestType(
        @Param('subjectId') subjectId: string,
        @Param('testTypeId') testTypeId: string,
        @Body('order') order?: number
    ) {
        return this.subjectsService.addTestType(subjectId, testTypeId, order);
    }

    // DELETE /subjects/:subjectId/test-types/:testTypeId - Subjectdan test type o'chirish
    @Delete(':subjectId/test-types/:testTypeId')
    removeTestType(
        @Param('subjectId') subjectId: string,
        @Param('testTypeId') testTypeId: string
    ) {
        return this.subjectsService.removeTestType(subjectId, testTypeId);
    }
}