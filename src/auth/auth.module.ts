import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProfileModule } from 'src/profile/profile.module';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './utils/passport.serializer';

@Module({
  imports: [
    //  JwtModule.register({
    //  secret: configService.get('JWT_SECRET'),
    //  signOptions: { expiresIn: '1d' }
    //  })
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') ?? 'mysecret',
        signOptions: { expiresIn: '1d' }
      })
    }),
    TypeOrmModule.forFeature([User, Profile]),
    UsersModule,
    ProfileModule,
    // PassportModule//Default
    // PassportModule.register({ session: true })//Usando Sessiones
    PassportModule.register({ session: false })
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
    ProfileService,
    // {
    //   provide: 'APP_GUARD',
    //   useClass: RolesGuard,
    // },
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer
  ],
  exports: [
    GoogleStrategy
  ]
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(PassportSessionMiddleware).forRoutes('auth/google/redirect');
  // }
}
