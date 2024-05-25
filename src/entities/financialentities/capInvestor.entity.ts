// cap-table-investor.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CapTable } from './cap.entity';
import { Investor } from '../businessprofileentities/investor.entity';

@Entity()
export class CapTableInvestor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CapTable, capTable => capTable.capTableInvestors)
  @JoinColumn()
  capTable: CapTable;

  @ManyToOne(() => Investor)
  @JoinColumn()
  investor: Investor;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  shares: number;
}
