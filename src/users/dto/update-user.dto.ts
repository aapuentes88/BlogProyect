import { Post } from "src/posts/entities/post.entity"

export class UpdateUserDto {
    username?: string
    email?: string
    password?: string
    posts?: Post[]
}
