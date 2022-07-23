import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);       // Contiene todas las variables de entorno
  app.useGlobalPipes(new ValidationPipe());           // La aplicación completa hará uso de Pipes
  app.enableCors();
  await app.listen(configService.get<number>('NESTJS_PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();