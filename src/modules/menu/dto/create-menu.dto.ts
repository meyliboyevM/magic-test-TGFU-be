// src/modules/menus/dto/create-menu.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMenuDto {
    @IsString()
    @IsNotEmpty()
    id: string; // "kirish-menu", "algoritm-menu"

    @IsString()
    @IsNotEmpty()
    icon: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    bgColor?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    order?: number;
}


export class UpdateMenuDto extends CreateMenuDto {}