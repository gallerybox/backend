import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);       // Contiene todas las variables de entorno
  app.useGlobalPipes(new ValidationPipe());           // La aplicación completa hará uso de Pipes
  app.enableCors();
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");//"Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*")
    next();
  });
  /*
  app.enableCors({
    origin: [
      'http://localhost:3001',

    ],
    methods: ["*"],
    credentials: true,
  });
  */

  await app.listen(configService.get<number>('NESTJS_PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();