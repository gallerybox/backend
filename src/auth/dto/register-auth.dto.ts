import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { LoginAuthDto } from "./login-auth.dto";

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsNotEmpty()
    nickname: string;

    @IsBoolean()
    isPrivate: true;
}