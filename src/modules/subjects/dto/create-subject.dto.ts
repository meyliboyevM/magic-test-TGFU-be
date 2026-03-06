// src/modules/subjects/dto/create-subject.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateSubjectDto {
    @IsString()
    @IsNotEmpty()
    id: string; // "ai", "math", "physics"

    @IsString()
    @IsNotEmpty()
    title: string;

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
    menuIds?: string[]; // ["kirish-menu", "algoritm-menu"]

    @IsArray()
    @IsOptional()
    testTypeIds?: string[]; // ["kirish-testi", "asosiy-test"]
}

// src/modules/subjects/dto/update-subject.dto.ts

export class UpdateSubjectDto extends CreateSubjectDto {}