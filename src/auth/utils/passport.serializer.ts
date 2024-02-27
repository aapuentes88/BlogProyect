import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable() //Implementacion que se habilita si se usa session en passport
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {
    console.log('Init SessionPassportSerializer')
    super();
    console.log('End SessionPassportSerializer')
  }

  serializeUser(user: User, done: Function) {
    console.log('Serializer User');
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.userService.findOne(payload.id);
    console.log('Deserialize User');
    console.log(user);
    return user ? done(null, user) : done(null, null);
  }
}