import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/entities/user.entity';
// import { StartupProfilePicture } from '../profilepictureentities/startupprofilepicture.entity';
import { FundingRound } from '../financialentities/funding.entity';

@Entity()
export class Startup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  companyName: string;

  @Column({ length: 500 })
  companyDescription: string;

  @Column({ length: 500 })
  foundedDate: string;

  @Column({ length: 500 })
  typeOfCompany: string;

  @Column({ length: 500 })
  numberOfEmployees: string;

  @Column({ length: 500 })
  phoneNumber: string;

  @Column({ length: 500 })
  contactEmail: string;

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
  industry: string;

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

  @OneToMany(() => FundingRound, fundingRound => fundingRound.startup)
  fundingRounds: FundingRound[];

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => User, user => user.startups)
  user: User;

  // @OneToMany(() => StartupProfilePicture, profilePicture => profilePicture.user)
  // profilePictures: StartupProfilePicture[];
}
