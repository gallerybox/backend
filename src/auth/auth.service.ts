import { BadRequestException, Body, HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compare, hash } from "bcrypt";
import { LoginAuthDto } from './dto/login-auth.dto';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
    private readonly clientAppUrl: string;

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        this.clientAppUrl = this.configService.get<string>('');
    }

    // Registra un nuevo usuario en la base de datos
    async register(registerAuthDto: RegisterAuthDto) {
        // Encriptamos la password
        const { password } = registerAuthDto;
        const plainToHash = await hash(password, 10);

        // Sobrescribimos la password con su valor encriptado
        registerAuthDto = {...registerAuthDto, password: plainToHash };

        return this.usersService.create(registerAuthDto);
    }

    // Valida el usuario según usuario y contraseña (solo para LocalStrategy)
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByNickname(username);
        
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    // Loguea al usuario (signIn)
    async login(loginAuthDto: LoginAuthDto) {
        const { email, password } = loginAuthDto;
        
        // Comprobación de usuario existente
        
        const findUser = await this.usersService.findOneByEmail(email);
        if (!findUser) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        
        
        // Comprobación de contraseña correcta
        
        const checkPassword = await compare(password, findUser.password);
        if (!checkPassword) throw new HttpException('PASSWORD_INVALID', HttpStatus.BAD_REQUEST);
        
        const tokenPayload: ITokenPayload = {
             id: findUser._id.toString(),
             nickname: findUser.nickname
        }

        const token = await this.generateToken(tokenPayload)

        const data = {
            user: findUser,
            access_token: token // Firmando el token
        }
        
        return data;
    }

    private async generateToken(data: ITokenPayload, options?: JwtSignOptions) {
        return this.jwtService.sign(data, options);
    }
    
    async forgotPassword (forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;

        const user = await this.usersService.findOneByEmail(email);

        if(!user) {
            throw new BadRequestException('Invalid email');
        }

        const token = (await this.login({email: user.email, password: user.password})).access_token;
        const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token}`;

        // TODO: enviar el email con el enlace (forgotLink) --> mailService
    }


    async resetPassword(userId: string, token: string, changePasswordDto: ChangePasswordDto) {
        let tokenData; 

        // Verificación del token con el secret
        try {
            tokenData = await this.jwtService.verify(token);
        } catch (err) {
            if (err.name === "JsonWebTokenError")
                throw new BadRequestException('INVALID_SIGNATURE');
        }

        // Comprobación de usuario existente
        
        const userDb = await this.usersService.findOneById(userId);
        if (!userDb) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);

        // Actualizamos la contraseña en base de datos
        return await this.usersService.update(userId, {
            ...userDb,
            password: await hash(changePasswordDto.password, 10)
        });

        
    }

    // async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    //     const user = await this.usersService.findOneByEmail(forgotPasswordDto.email);

    //     if (!user) {
    //         throw new BadRequestException('Invalid email');
    //     }

    //     const token = await this.signUser(user);
    //     const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token}`;

    //     await this.mailService.send({
    //         from: this.configService.get<string>('MAIL_FROM'),
    //         to: user.email,
    //         subject: 'Contraseña olvidada',
    //         html: `
    //             <h3>Hola ${user.nombre}!</h3>
    //             <p>Por favor, usa este <a href="${forgotLink}">link</a> pra resetear tu contraseña.</p>
    //         `,
    //     });
    // }
}