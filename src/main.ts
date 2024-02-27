import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'
// import * as passport from 'passport';
// import * as session from 'express-session';

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
  const corsOptions = {
    origin: 'http://localhost:3000', // URL del frontend
    credentials: true,
  };
  app.use(cors(corsOptions))

  //Trabajo con sessines en passport -- USO JWT Mejor
  // app.use(session({
  //   secret: 'my-secret-albe',
  //   saveUninitialized: false,
  //   resave: false,
  //   cookie: {
  //     maxAge: 60000,
  //   },
  // }))
  // app.use(passport.initialize())
  // app.use(passport.session())

  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
