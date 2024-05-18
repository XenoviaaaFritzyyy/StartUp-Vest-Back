import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';
// import { User } from './user.entity';

@Entity()
export class ProfilePicture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumblob' })
  data: Buffer;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
