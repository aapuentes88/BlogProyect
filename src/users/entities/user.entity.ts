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

    @Column({default: 'user'})
    rol: string

}
