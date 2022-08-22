import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UpdatePersonalDataDto {
    @IsNotEmpty()
    nombre: string

    @IsNotEmpty()
    apellidos: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    biography?: string;
}
