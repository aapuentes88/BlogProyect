import { Role } from 'src/common/constants/enums/roles.enum';
import { Column, Entity } from 'typeorm';

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
    

}
