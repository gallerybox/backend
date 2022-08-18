import { Body, Controller, Get, Param, Post, Request, Res, UseGuards, ValidationPipe } from '@nestjs/common';
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
    
    @Post('/register')
    registerUser(@Body() registerAuthDto: RegisterAuthDto) {
        return this.authService.register(registerAuthDto);
    }
    
    @Post('/login')
    login(@Body() loginAuthDto: LoginAuthDto) {
        return this.authService.login(loginAuthDto);
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
    
    @Get('verify-token/:token')
    async verifyToken(@Param('token') token: string){
        return this.authService.verifyToken(token);
    } 
}
