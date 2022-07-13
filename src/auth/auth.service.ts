import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // Valida el usuario según usuario y contraseña
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // Loguea al usuario. Crea el access_token en función de un payload (en)
    // este caso, según username y userId (NO) el password)
    async login(user:any) {
        const payload = { username: user.username, sub: user.userId };
        
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}