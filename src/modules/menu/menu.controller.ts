// src/modules/menus/menus.controller.ts
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
import {CreateMenuDto, UpdateMenuDto} from './dto/create-menu.dto';
import {MenusService} from "./menu.service";

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    // POST /menus - Yangi menu yaratish
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createMenuDto: CreateMenuDto) {
        return this.menusService.create(createMenuDto);
    }

    // GET /menus - Barcha menularni olish
    @Get()
    findAll() {
        return this.menusService.findAll();
    }

    // GET /menus/unused - Hech qanday subjectda ishlatilmagan menular
    @Get('unused')
    getUnusedMenus() {
        return this.menusService.getUnusedMenus();
    }

    // GET /menus/popular - Eng ko'p ishlatilgan menular
    @Get('popular')
    getPopularMenus(
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number
    ) {
        return this.menusService.getPopularMenus(limit);
    }

    // GET /menus/by-ids?ids=id1,id2,id3 - Bir nechta ID lar bo'yicha olish
    // @Get('by-ids')
    // findByIds(@Query('ids') ids: string) {
    //     const idArray = ids.split(',').map(id => id.trim());
    //     return this.menusService.findByIds(idArray);
    // }

    // GET /menus/:id - Bitta menuni olish
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.menusService.findOne(id);
    }

    // PATCH /menus/:id - Menuni yangilash
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateMenuDto: any[]) {
        return this.menusService.update(id, updateMenuDto);
    }

    // DELETE /menus/:id - Menuni o'chirish
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: number) {
        return this.menusService.remove(id);
    }
}