// src/modules/subjects/dto/create-subject.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateSubjectDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    icon: string;

    @IsString()
    @IsOptional()
    bgColor?: string;

    @IsNumber()
    @IsNotEmpty()
    totalQuestions: number;

    @IsNumber()
    @IsNotEmpty()
    timeLimitMinutes: number;

    @IsNumber()
    @IsNotEmpty()
    questionsPerTest: number;

    @IsArray()
    @IsOptional()
    menuIds?: number[]; // ["kirish-menu", "algoritm-menu"]

    @IsArray()
    @IsOptional()
    testTypeIds?: number[]; // ["kirish-testi", "asosiy-test"]
}

// src/modules/subjects/dto/update-subject.dto.ts

export class UpdateSubjectDto extends CreateSubjectDto {}