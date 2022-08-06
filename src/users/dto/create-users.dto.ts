import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUsersDto {
    @IsNotEmpty()
    nickname: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
