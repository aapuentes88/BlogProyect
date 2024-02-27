import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  filePath: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  publishedAt: Date; 

  @ManyToOne(() => User, user => user.posts)
  user: User

}