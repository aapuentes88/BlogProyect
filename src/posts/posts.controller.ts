import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {

  constructor(private readonly postsService: PostsService) {}

  @Get(':category')
  findPost(@Param('category') category: string) {
    return this.postsService.findPost(category);
  }

  @Post()
  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)    
  @UseInterceptors(FileInterceptor('post'))
  createPost(@UploadedFile() file: Express.Multer.File, @Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postsService.createPost(req.user.id, file, createPostDto);
  }

}
