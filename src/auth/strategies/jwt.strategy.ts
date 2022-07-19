import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// El modelo que se implementa es JWT sin estado, cada llamada a la API se
// autoriza automáticamente en función de la presencia de un JWT válido y una
// pequeña información sobre el solicitante (userId y username)

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    // A diferencia de LocalStrategy, esta requiere inicialización.
    // Más opciones: https://github.com/mikenicholson/passport-jwt#configure-strategy
    constructor(
        public readonly configService: ConfigService
    ) {
        super({
            // Método por el que se extrae JWT del request
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Delega la responsabilidad de que un JWT no haya expirado a Passport
            ignoreExpiration: false,
            // Define que se usa para firmar el token
            secretOrKey: configService.get<string>('JWT_SECRET')
        });
    }

    // Passport realiza los siguientes pasos:
    //    1. Verifica la firma de JWT y decodifica el JSON.
    //    2. Si todo OK en paso 1, invoca al método validate(), pasando el JSON decodificado
    //       como su único parámetro y garantizando que recibimos un token válido.
    async validate(payload: any) {
        // La devolución es trivial.
        // Aquí se puede añadir más lógica, como:
        // - Hacer una búsqueda en base de datos (para extraer más info del usuario), 
        // dando una respuesta más enriquecida.
        // - Buscar un userId en una lista de tokens revocados
        return { userId: payload._id, username: payload.nickname };
    }
}