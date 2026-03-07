// src/modules/menus/dto/create-menu.dto.ts
import {IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsBoolean} from 'class-validator';

export class CreateMenuDto {

    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    bgColor?: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsBoolean()
    @IsNotEmpty()
    disabled: boolean = false;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    order: number;
}


export class UpdateMenuDto extends CreateMenuDto {}