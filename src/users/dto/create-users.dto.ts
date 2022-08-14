import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUsersDto {
    @IsNotEmpty()
    nombre: string

    @IsNotEmpty()
    apellidos: string;

    @IsNotEmpty()
    nickname: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsBoolean()
    hasConsented: boolean;

    @IsOptional()
    profilePhoto: string
}
