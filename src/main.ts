import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      //No esta disponible en esta version de NestJs, 
      //esto me permite no tener que validar todas los propiedades del DTO
      // validateUsingMetaTypes: true, 
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const configService = app.get(ConfigService)
  app.use(cors())
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
