import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) { }

  create(createProfileDto: CreateProfileDto) {    
    // const { fullname, ...rest} = createProfileDto
    const profile = this.profileRepository.create({ ...createProfileDto})
    return this.profileRepository.save(profile);
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(id: number) {
    if(!id) return null
    return  await this.profileRepository.findOne({where: {
      id
    }});
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    let profile = await this.findOne(id)

    console.log('profile',profile)

    if(!profile) {
        throw new NotFoundException("profile not found");
        
    }

    // Object.assign(profile, updateProfileDto)
    profile = {...profile, ...updateProfileDto}

    return this.profileRepository.save(profile)
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
