import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { ProfileModule } from './profile/profile.module';
import { User } from './users/entities/user.entity';
import { Profile } from './profile/entities/profile.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Post } from './posts/entities/post.entity';
import { PostModule } from './posts/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Ruta a la carpeta "uploads" relativa al directorio del módulo
      serveRoot: '/uploads',
    }),
    MulterModule.register({dest: './uploads',}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST_P') ?? 'localhost' ,
        port: configService.get('DB_PORT_P') ?? 5432,
        username: configService.get('DB_USER_P') ?? 'postgres',
        password: configService.get('DB_PASSWORD_P') ?? 'postgres',
        database: configService.get('DB_NAME_P') ?? 'testing',
        retryDelay: 3000,
        autoLoadEntities: true,
        entities: [User, Profile, Post],
        synchronize: true,
      })
    }),
    // TypeOrmModule.forRoot({
    //   type: "mysql",
    //   host: "localhost",
    //   port: 3307,
    //   username: "alberto",
    //   password: "alberto",
    //   database: "db_demo", 
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    UsersModule,
    AuthModule,
    ProfileModule,
    PostModule
  ],
  controllers: [/*PostsController*/],
  providers: [/*PostsService*/],
})
export class AppModule { }
