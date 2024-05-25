import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FundingRound } from 'src/entities/financialentities/funding.entity';
import { Investor } from 'src/entities/businessprofileentities/investor.entity';
import { InvestorService } from '../businessprofileservice/investor.service';

@Injectable()
export class FundingRoundService {
  constructor(

    @InjectRepository(FundingRound)
    private readonly fundingRoundRepository: Repository<FundingRound>,
    private readonly investorService: InvestorService,

  ) { }

  async create(fundingId: number, fundingRoundData: FundingRound, investorIds: number[]): Promise<FundingRound> {
    const startup = { id: fundingId };
    console.log('Investor IDs:', investorIds);
    // Fetch investors by their IDs
    const investors = await this.investorService.findByIds(investorIds);
    console.log('Fetched Investors:', investors);

    // Create the funding round entity
    const funding = this.fundingRoundRepository.create({
      ...fundingRoundData,
      startup,
      investors, // Associate investors with the funding round
    });

    return this.fundingRoundRepository.save(funding);
  }

  async findById(id: number): Promise<FundingRound> {
    const fundingRound = await this.fundingRoundRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['startup'],
    });
    if (!fundingRound) {
      throw new NotFoundException('Funding round not found');
    }
    return fundingRound;
  }

  async findAll(): Promise<FundingRound[]> {
    return this.fundingRoundRepository.find({
      where: { isDeleted: false },
      relations: ['startup'],
    });
  }

  async update(id: number, updateData: Partial<FundingRound>, investorIds: number[]): Promise<FundingRound> {
    const fundingRound = await this.findById(id);
    if (!fundingRound) {
      throw new NotFoundException('Funding round not found');
    }

    const investors = await this.investorService.findByIds(investorIds);
    const updatedFundingRound = Object.assign(fundingRound, updateData, { investors });

    return this.fundingRoundRepository.save(updatedFundingRound);
  }
  
  async softDelete(id: number): Promise<void> {
    const fundingRound = await this.fundingRoundRepository.findOne({ where: { id } });

    if (!fundingRound) {
      throw new NotFoundException('Funding round not found');
    }

    fundingRound.isDeleted = true;

    await this.fundingRoundRepository.save(fundingRound);
  }

}
