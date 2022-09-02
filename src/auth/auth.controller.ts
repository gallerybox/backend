import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Request, Res, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {    
    constructor(
        private authService: AuthService
    ) {}
    
    // @UseInterceptors(ClassSerializerInterceptor)
    @Post('/register')
    async registerUser(@Body() registerAuthDto: RegisterAuthDto) {
        // return plainToClass(UserSerializerRegister, await this.authService.register(registerAuthDto), { excludeExtraneousValues: true });
        return await this.authService.register(registerAuthDto);
    }
    
    @Post('/login')
    async login(@Body() loginAuthDto: LoginAuthDto) {
        return await this.authService.login(loginAuthDto);
    }

    @Post('/forgot-password')
    async forgotPassword(@Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto) {
        return await this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password/:userId/:token')
    async resetPassword(
        @Body() changePasswordDto: ChangePasswordDto, 
        @Param('userId') userId: string, 
        @Param('token') token: string)
    {
        return await this.authService.resetPassword(userId, token, changePasswordDto);
    }
    
    @Post('verify-token')
    async verifyToken(@Body() request: {token: string}){
        return this.authService.verifyToken(request.token);
    } 
}
