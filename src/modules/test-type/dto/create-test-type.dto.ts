import {IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsBoolean} from 'class-validator';

export class CreateTestTypeDto {

    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    icon?: string;

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

export class UpdateTestTypeDto extends CreateTestTypeDto {}