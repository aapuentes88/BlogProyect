import { Profile } from 'src/profile/entities/profile.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class User {
    @Column({primary: true})
    id: string

    @Column()
    username: string

    @Column({unique: true, nullable: false})
    email: string

    @Column({nullable: false})
    password: string

    @Column({type: 'simple-array',  default: 'user' }/*{default: [Role.User]}*/)
    roles: string[]
    // roles: Role[]
    
    @OneToOne(() => Profile, profile => profile.user)
    @JoinColumn() // Colocado en User
    profile: Profile;
}
