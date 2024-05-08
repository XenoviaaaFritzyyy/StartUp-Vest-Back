import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Startup } from 'src/entities/businessprofileentities/startup.entity';
import { Investor } from './businessprofileentities/investor.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  firstName: string;

  @Column({ length: 500 })
  lastName: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  contactNumber: string;

  @Column({ length: 500 })
  gender: string;

  // @Column({ length: 500 })
  // password: string;
  @Column({ length: 500, nullable: true }) // Make the password property optional
  password?: string;

  @OneToMany(() => Startup, startup => startup.user)
  startups: Startup[];

  @OneToOne(() => Investor, investor => investor.user)
  investor: Investor;
}
