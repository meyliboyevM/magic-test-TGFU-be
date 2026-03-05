import {Body, Controller, Get, Param, Patch} from '@nestjs/common'
import {TestIntroMenuService} from "./testIntroMenu.service";

@Controller('test-intro-menu')
export class TestIntroMenuController {

    constructor(private service: TestIntroMenuService) {}

    @Get()
    getMenu() {
        return this.service.getMenu()
    }

    @Patch(':id')
    changeStatus(
        @Param('id') id: string,
        @Body('disabled') disabled: boolean
    ) {
        return this.service.changeStatus(+id, disabled)
    }

}