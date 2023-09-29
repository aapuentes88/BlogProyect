import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true
    }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
