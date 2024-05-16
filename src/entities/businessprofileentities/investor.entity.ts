import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { FundingRound } from '../financialentities/funding.entity';
@Entity()
export class Investor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  firstName: string;

  @Column({ length: 500 })
  lastName: string;

  @Column({ length: 500 })
  emailAddress: string;

  @Column({ length: 500 })
  contactInformation: string;

  @Column({ length: 500 })
  gender: string;

  @Column({ length: 1000 })
  biography: string;

  @Column({ length: 500 })
  streetAddress: string;

  @Column({ length: 500 })
  country: string;

  @Column({ length: 500 })
  city: string;

  @Column({ length: 500 })
  state: string;

  @Column({ length: 500 })
  postalCode: string;

  @Column({ length: 500 })
  website: string;

  @Column({ length: 500 })
  facebook: string;

  @Column({ length: 500 })
  twitter: string;

  @Column({ length: 500 })
  instagram: string;

  @Column({ length: 500 })
  linkedIn: string;

  @ManyToMany(() => FundingRound)
  fundingRounds: FundingRound[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
