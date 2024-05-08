import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Investor } from 'src/entities/businessprofileentities/investor.entity';

@Injectable()
export class InvestorService {
  constructor(
    @InjectRepository(Investor)
    private investorsRepository: Repository<Investor>,
  ) {}

  async create(investorData: Investor): Promise<Investor> {
    const investor = this.investorsRepository.create(investorData);
    return this.investorsRepository.save(investor);
  }

  // other methods...
}
