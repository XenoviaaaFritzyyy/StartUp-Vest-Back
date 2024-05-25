import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Startup } from '../businessprofileentities/startup.entity';
import { Investor } from '../businessprofileentities/investor.entity';
import { CapTableInvestor } from './capInvestor.entity';

@Entity()
export class CapTable {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({ type: 'decimal', precision: 20, scale: 2 })
  totalShares: number;

  @ManyToOne(() => Startup, startup => startup.capTables)
  @JoinColumn()
  startup: Startup;

  
  @OneToMany(() => CapTableInvestor, capTableInvestor => capTableInvestor.capTable, { cascade: true })
  capTableInvestors: CapTableInvestor[];
  

}
