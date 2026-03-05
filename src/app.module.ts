import { Module } from '@nestjs/common'
import {TestIntroMenuController} from "./modules/test-intro-menu/testIntroMenu.controller";
import {TestIntroMenuService} from "./modules/test-intro-menu/testIntroMenu.service";
import {PrismaService} from "./prisma/prisma.service.";

@Module({
    controllers: [TestIntroMenuController],
    providers: [TestIntroMenuService, PrismaService],
})
export class AppModule {}