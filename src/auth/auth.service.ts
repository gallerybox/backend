import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compare, hash } from "bcrypt";
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

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

    // Loguea al usuario. Crea el access_token en función de un payload (en)
    // este caso, según userId y nickname (NO el password))
    async login(loginAuthDto: LoginAuthDto) {
        const { email, password } = loginAuthDto;

        // Comprobación de usuario existente

        const findUser = await this.usersService.findOneByEmail(email);     // Casca antes de continuar
        if (!findUser) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        

        // Comprobación de contraseña correcta

        const checkPassword = await compare(password, findUser.password);
        if (!checkPassword) throw new HttpException('PASSWORD_INVALID', HttpStatus.FORBIDDEN);
  

        // Cuidado: los datos del payload son publicos
        
        const payload = {
             id: findUser._id,
             nickname: findUser.nickname
        }

        // Datos del usuario + Token de acceso

        const data = {
            user: findUser,
            access_token: this.jwtService.sign(payload) // Firmando el token
        }
        
        return data;
    }
}