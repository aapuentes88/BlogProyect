import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs'
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

import * as fs from 'fs';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class PostsService {

  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>,
              private readonly userService: UsersService
  ){}

  async findPost(category: string) {
  const arrMainPostEntity = await this.postRepository.findBy({ category });
  const arrASCIIText = [];

  for (const mainPostEntity of arrMainPostEntity) {
    const filePath = mainPostEntity.filePath;
    console.log(filePath);

    if (fs.existsSync(filePath)) {
      const mainPostBuffer = readFileSync(filePath);
      const arregloBytes = new Uint8Array(mainPostBuffer);
      const asciiText = String.fromCharCode.apply(null, arregloBytes);
      arrASCIIText.push(asciiText); // Agrega el texto ASCII al arreglo
    } else {
      throw new Error("No existe el post en la categoría");
    }
  }
  console.log(arrASCIIText.length)
  return arrASCIIText;
    // else {
    //   throw new Error("No existe la categoria");        
    // }    

    // const mainPostEntity = await this.postRepository.findOneBy({category: 'main'})    
    // // const filePath = join(process.cwd(), 'src', 'common', 'mdposts', 'blogpost.md' )

    // if(mainPostEntity){
    //   const filePath = mainPostEntity.filePath
    //   console.log(filePath)
    //   //const filePath = join(process.cwd(), 'src', mainPostEntity.filePath )
    //   //get mainPost from filePath
    //   if (fs.existsSync(filePath)) {
    //     const mainPostBuffer = readFileSync(filePath)
    //     const arregloBytes = new Uint8Array(mainPostBuffer);
    //     const asciiText = String.fromCharCode.apply(null, arregloBytes);  
    //     return asciiText
    //   } else {
    //     throw new Error("No existe el post en la categoria");        
    //   }      
    // } else {
    //   throw new Error("No existe la categoria");        
    // }    
  }

  async createPost(userId: string, file: Express.Multer.File, createPostDto: CreatePostDto) {

    // Ruta raiz donde guardar los post con ext .md
    let relativePath = join(process.cwd(),`src/common/mdposts/`);
        relativePath += `${createPostDto.category}`

    // Guarda el archivo en el almacenamiento deseado
    const arr = file.originalname.split('.')
    const ext = arr[arr.length-1]
    
    // Verifica si el directorio de subida existe, si no, créalo
    if (!fs.existsSync(relativePath)) {
      fs.mkdirSync(relativePath, { recursive: true });
    }    
    const filePath = `${relativePath}/${arr[0]}.${ext}`; // Ruta donde guardas los posts
    fs.writeFileSync(filePath, file.buffer);

    createPostDto.filePath = filePath
    // Crea el post
    let post: Post = null
    try {
      post = await this.postRepository.create(createPostDto)
      await this.postRepository.save(post)
    } catch (error) {
      throw new Error(`Error creating post: ${error.message}`);
    }
    let user: User = null
    // Actualiza el usuario con el nuevo post
    const updateUserDto: UpdateUserDto = { posts: [post] };
    try {
      await this.userService.update(userId, updateUserDto)
    }catch (error) {
      // Si ocurre un error, elimina el archivo guardado
      fs.unlinkSync(filePath);
      throw new Error(`Error associating post with user: ${error.message}`);
    }
    return post       
  }

}
