import { BadRequestException, Body, HttpCode, HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { MailService } from 'src/mail/mail.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compare, hash } from "bcrypt";
import { LoginAuthDto } from './dto/login-auth.dto';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Users } from 'src/users/schema/users.schema';


@Injectable()
export class AuthService {
    private readonly clientAppUrl: string;

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ) {
        this.clientAppUrl = this.configService.get<string>('CLIENT_APP_URL');
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
    async login(loginAuthDto: LoginAuthDto, resetPassword?: boolean) {
        const { email, password } = loginAuthDto;
  

        // Comprobación de usuario existente
        
        const userDb = await this.usersService.findOneByEmail(email) as unknown as Users;
        if (!userDb) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        
        
        // Comprobación de contraseña correcta
        
        const checkPassword = await compare(password, userDb.password);
        if (!checkPassword) throw new HttpException('PASSWORD_INVALID', HttpStatus.BAD_REQUEST);

        const data = {
            user: userDb,
            access_token: await this.getAccessToken(userDb) // Firmando el token
        }
        
        return data;
    }

    private async getAccessToken(user: Users, options?: JwtSignOptions) {
        const tokenPayload: ITokenPayload = {
            id: user._id.toString(),
            nickname: user.nickname
        }

        return await this.generateToken(tokenPayload, options)
    }

    private async generateToken(data: ITokenPayload, options?: JwtSignOptions) {
        return this.jwtService.sign(data, options);
    }

    async verifyToken(token: string){
        try {
            await this.jwtService.verify(token)

            return {
                status: HttpStatus.OK,
                message: 'VALID_TOKEN'
            }

        } catch (error) {
            throw new HttpException('UNAUTHORIZED_COFFEE', HttpStatus.I_AM_A_TEAPOT)
        }
    }
    
    async forgotPassword (forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;

        // Comprobación de email existente
        const userDb = await this.usersService.findOneByEmail(email) as unknown as Users
        if (userDb === null) throw new BadRequestException("INVALID_EMAIL")

        const token = await this.getAccessToken((userDb) , {
            expiresIn: '900s'   // 15 minutos
        });

        const forgotLink = `${this.clientAppUrl}/reset-password?resetToken=%22${token}%22`;

        this.mailService.sendPlainTextEmail(
            email,
            "noreply@galleryboxapp.com",
            "Recuperación de la contraseña",
            `<h1>Hola, ${userDb.nickname}: </h1>\n
            <p>Lamentamos que tengas problemas para iniciar sesión en GalleryBox. Hemos 
            recibido un mensaje conforme has olvidado tu contraseña. Si has sido tú,
            puedes cambiar la contraseña haciendo clic en el siguiente <a href="${forgotLink}">enlace</a></p>`
            
        );

        return {
            status: HttpStatus.OK,
            message: "EMAIL_SENT"
        }
    }


    async resetPassword(userId: string, token: string, changePasswordDto: ChangePasswordDto) {
        let tokenData: any; 

        // Verificación del token con el secret

        try {
            tokenData = await this.jwtService.verify(token);
        } catch (err) {
            if (err.name === "JsonWebTokenError")
                throw new BadRequestException('INVALID_SIGNATURE');
        }

        // Comprobación si otro usuario está usando el token

        if ((this.jwtService.decode(token) as ITokenPayload).id !== userId)
            throw new BadRequestException('USER_NOT_OWNER_TOKEN')
   

        // Comprobación de usuario existente
        
        const userDb = await this.usersService.findOneById(userId);
        if (!userDb) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);

        // Actualizamos la contraseña en base de datos
        return await this.usersService.update(userId, {
            ...userDb,
            password: await hash(changePasswordDto.password, 10)
        });
    }
}