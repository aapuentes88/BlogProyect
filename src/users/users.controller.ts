import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/constants/enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('profile/photo')
  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)    
  @UseInterceptors(FileInterceptor('photo'))
  async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File, @Request() req) {
    console.log('Entro aqui uploadProfilePhoto')
    const userId = req.user.id;
    return this.usersService.uploadProfilePhoto(userId, file);
  }

  @Get('profile/photo')
  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)    
  async profilePhotoUrl(@Request() req) {
    console.log('Entro aqui profilePhotoUrl')
    const userId = req.user.id;
    const url = await this.usersService.profilePhotoUrl(userId);
    console.log('url', url)
    return url
  }
}
