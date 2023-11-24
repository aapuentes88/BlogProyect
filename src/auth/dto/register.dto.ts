import { Transform } from "class-transformer"
import { IsArray, IsEmail, IsOptional, IsString, MinLength } from "class-validator"

export class RegisterDto {

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(3)
    username: string

    @IsEmail()
    email: string

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(8)
    password: string

    @IsOptional()
    @IsArray()
    roles?: string[]
}
