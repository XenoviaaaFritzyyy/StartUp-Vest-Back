import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Startup } from '../businessprofileentities/startup.entity';
import { Investor } from '../businessprofileentities/investor.entity';

@Entity()
export class FundingRound {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  fundingType: string;

  @Column({ length: 500 })
  announcedDate: string;

  @Column({ length: 500 , nullable: true })
  closedDate: string;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  moneyRaised: number;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  targetFunding: number;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  preMoneyValuation: number;
  
  @Column({ length: 500 })
  moneyRaisedCurrency: string;

  @ManyToOne(() => Startup, startup => startup.fundingRounds)
  @JoinColumn()
  startup: Startup;

  @ManyToMany(() => Investor)
  @JoinTable()
  investors: Investor[];
  

}
