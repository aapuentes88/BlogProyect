import { Post } from 'src/posts/entities/post.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User {
    @Column({primary: true})
    id: string

    @Column()
    username: string

    @Column({unique: true, nullable: false})
    email: string

    @Column({nullable: true})
    password: string

    @Column({type: 'simple-array',  default: 'user' }/*{default: [Role.User]}*/)
    roles: string[]
    // roles: Role[]
    
    @OneToOne(() => Profile, profile => profile.user)
    @JoinColumn() // Colocado en User
    profile: Profile;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]
}
