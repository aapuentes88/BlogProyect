import { Transform } from "class-transformer"
import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreatePostDto {

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(4)
    category: string;
  
    @IsString()
    @MinLength(4)
    title: string;
  
    @IsString()
    @MinLength(15)
    @MaxLength(100)
    content: string;
  
    @IsString()
    @IsOptional()
    filePath: string

    @IsDateString()
    @IsOptional()
    createdAt: Date;

    @IsDateString()
    @IsOptional()
    publishedAt: Date; 

}