import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs'

@Injectable()
export class PostsService {

  findMainPost() {
    const filePath = join(process.cwd(), 'src', 'common', 'mdposts', `blogpost.md`)
    //get mainPost from filePath
    const mainPost = readFileSync(filePath)
    const arregloBytes = new Uint8Array(mainPost);
    const asciiText = String.fromCharCode.apply(null, arregloBytes);

    return asciiText
  }

}
