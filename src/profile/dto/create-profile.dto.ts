import { IsArray, IsOptional, IsString, Validate } from "class-validator"


export class CreateProfileDto {
  @IsString()
  @IsOptional()
  fullname?: string
  @IsString()
  @IsOptional()
  company?: string
  @IsString()
  @IsOptional()
  charge?: string
  @IsString()
  @IsOptional()
  description?: string
  @IsString()
  @IsOptional()
  mobile?: string
  @IsString()
  @IsOptional()
  location?: string
  @IsString()
  @IsOptional()
  profilePhoto?: string
  @IsOptional()
  @IsArray()
  social?: string[]
}
