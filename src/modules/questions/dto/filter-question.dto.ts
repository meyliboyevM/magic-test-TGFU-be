import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class QuestionFilterDto {
    @IsString()
    @IsOptional()
    subjectId?: string;

    @IsString()
    @IsOptional()
    testTypeId?: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    limit?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    offset?: number;
}