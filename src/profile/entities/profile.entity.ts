import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    fullname: string

    @Column({ nullable: true })
    company: string

    @Column({ nullable: true })
    charge: string

    @Column({ nullable: true })
    description: string

    @Column({ nullable: true })
    mobile: string

    @Column({ nullable: true })
    location: string

    @Column({type: 'simple-array',  default: 'www.facebook.com'})
    social: string[]

    @Column({ nullable: true })
    profilePhoto: string;

    @OneToOne(() => User, user => user.profile)
    user: User;
}
