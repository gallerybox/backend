import { Request, Response, NextFunction } from 'express';

export function ErrorInterceptor(req: Request, res: Response, next: NextFunction) {
    if(res.statusCode>=500){
        res.status(418)
        res.send({message:"Sorry, I'am a teapot, go find a coffe maker.", statusCode: 418});
    }
    next();
};

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        //const request = ctx.getRequest<Request>();

        response
            .status(418)
            .json({
                statusCode: 418,
                message:"Sorry, I'am a teapot, go find a coffe maker.",
            });
    }
}