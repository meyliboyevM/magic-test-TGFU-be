import { Injectable } from '@nestjs/common'
import {PrismaService} from "../../../prisma/prisma.service.";

@Injectable()
export class TestIntroMenuService {

    constructor(private prisma: PrismaService) {}

    async getMenu() {
        return this.prisma.testIntroMenu.findMany({
            orderBy: {
                id: 'asc'
            }
        })
    }

    async changeStatus(id: number, disabled: boolean) {

        return this.prisma.testIntroMenu.update({
            where: { id },
            data: { disabled }
        })

    }

}