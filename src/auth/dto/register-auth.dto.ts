import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { LoginAuthDto } from "./login-auth.dto";

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    // Email, Password extienden de LoginAuthDto
    @IsNotEmpty()
    nickname: string;

    @IsBoolean()
    hasConsented: boolean;
}