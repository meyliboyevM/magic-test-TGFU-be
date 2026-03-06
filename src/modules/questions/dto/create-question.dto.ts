// src/modules/questions/dto/create-question.dto.ts
import {IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsNumber, Min} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOptionDto {
    @IsString()
    @IsOptional() // ID ixtiyoriy qilamiz
    id?: string;

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsNotEmpty()
    isCorrect: boolean;
}

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    subjectId: string;

    @IsString()
    @IsNotEmpty()
    question: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    options: string[]; // ["Faktdan xulosaga", "Maqsaddan faktga", ...]

    @IsNumber()
    @Min(0)
    correctIndex: number; // 0, 1, 2, 3
}

export class UpdateQuestionDto extends CreateQuestionDto {}