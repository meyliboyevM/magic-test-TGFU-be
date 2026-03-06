// src/modules/test-types/dto/create-test-type.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTestTypeDto {
    @IsString()
    @IsNotEmpty()
    id: string; // "kirish-testi", "asosiy-test"

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    order?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    defaultQuestionCount?: number;
}

export class UpdateTestTypeDto extends CreateTestTypeDto {}