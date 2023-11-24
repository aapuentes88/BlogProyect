import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { v4 as uuid } from 'uuid'
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ROLES_KEY } from 'src/common/constants/constants';
import { Role } from 'src/common/constants/enums/roles.enum';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  create(createUserDto: CreateUserDto) {
    const { /*username, email, password,*/ roles, ...rest } = createUserDto
    const user = this.userRepository.create({ ...rest, id: uuid()})
    if(roles)
     user[ROLES_KEY] = [...roles,Role.User]
    return this.userRepository.save(user);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email })
  }

  findUserByUserName(username: string) {
    return this.userRepository.findOneBy({ username })
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
