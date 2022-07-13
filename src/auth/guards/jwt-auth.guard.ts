import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// También podemos usar una cadena de estrategias. Cualquier falla de autenticación 
// ...extends AuthGuard(['strategy_jwt_1', 'strategy_jwt_2', '...']) { ... }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // Hay ocasiones en los que se necesite extender el manejo de errores o la lógica de
    // autenticación predeterminada. Para ello, podemos sobrescribir anular los métodos
    // dentro de una subclase

    canActivate(context: ExecutionContext) {
        // Aquí podemos añadir nuestra autenticación personalizada.
        // Ejemplo: llamada a super.logIn(request) para establecer la sesión
        return super.canActivate(context);
    }
    
    handleRequest(err, user, info) {
        // Puede lanzar una excepción basada en argumentos "info" o "err"
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}