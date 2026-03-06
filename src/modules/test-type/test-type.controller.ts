// src/modules/test-types/test-types.controller.ts
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
    Query,
    ParseIntPipe,
    DefaultValuePipe
} from '@nestjs/common';
import {CreateTestTypeDto, UpdateTestTypeDto} from './dto/create-test-type.dto';
import {TestTypesService} from "./test-type.service";

@Controller('test-types')
export class TestTypesController {
    constructor(private readonly testTypesService: TestTypesService) {}

    // POST /test-types - Yangi test type yaratish
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createTestTypeDto: CreateTestTypeDto) {
        return this.testTypesService.create(createTestTypeDto);
    }

    // GET /test-types - Barcha test turlarini olish
    @Get()
    findAll() {
        return this.testTypesService.findAll();
    }

    // GET /test-types/with-count - Savollar soni bilan
    // @Get('with-count')
    // findAllWithQuestionsCount() {
    //     return this.testTypesService.findAllWithQuestionsCount();
    // }

    // GET /test-types/unused - Ishlatilmagan test turlari
    @Get('unused')
    getUnusedTestTypes() {
        return this.testTypesService.getUnusedTestTypes();
    }

    // GET /test-types/popular - Eng ko'p ishlatilgan test turlari
    @Get('popular')
    getPopularTestTypes(
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number
    ) {
        return this.testTypesService.getPopularTestTypes(limit);
    }

    // GET /test-types/by-subject/:subjectId - Subject bo'yicha test turlari
    @Get('by-subject/:subjectId')
    getBySubject(@Param('subjectId') subjectId: string) {
        return this.testTypesService.getBySubject(subjectId);
    }

    // GET /test-types/by-ids?ids=id1,id2,id3 - Bir nechta ID lar bo'yicha
    @Get('by-ids')
    findByIds(@Query('ids') ids: string) {
        const idArray = ids.split(',').map(id => id.trim());
        return this.testTypesService.findByIds(idArray);
    }

    // GET /test-types/:id - Bitta test turni olish
    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.testTypesService.findOne(id);
    // }

    // PATCH /test-types/:id - Test turni yangilash
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTestTypeDto: UpdateTestTypeDto) {
        return this.testTypesService.update(id, updateTestTypeDto);
    }

    // DELETE /test-types/:id - Test turni o'chirish
    // @Delete(':id')
    // @HttpCode(HttpStatus.OK)
    // remove(@Param('id') id: string) {
    //     return this.testTypesService.remove(id);
    // }
}