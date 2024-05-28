import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundingRound } from 'src/entities/financialentities/funding.entity';
import { InvestorService } from '../businessprofileservice/investor.service';
import { CapTableInvestor } from 'src/entities/financialentities/capInvestor.entity';
import { title } from 'process';

export interface InvestorData {
  id: number;
  name: string;
  title: string;
  totalShares: number;
  percentage: number;
}

@Injectable()
export class FundingRoundService {

  private readonly logger = new Logger(FundingRoundService.name);

  constructor(
    @InjectRepository(FundingRound)
    private readonly fundingRoundRepository: Repository<FundingRound>,
    private readonly investorService: InvestorService,
    @InjectRepository(CapTableInvestor)
    private readonly capTableInvestorRepository: Repository<CapTableInvestor>
  ) { }

  async create(fundingId: number, fundingRoundData: FundingRound, investorIds: number[], investorShares: number[], investorTitles: string[]): Promise<FundingRound> {
    console.log('Investor IDs:', investorIds);
    // Fetch investors by their IDs
    const investors = await this.investorService.findByIds(investorIds);
    console.log('Fetched Investors:', investors);

    // Calculate moneyRaised from investorShares array
    const moneyRaised = investorShares.reduce((acc, shares) => acc + shares, 0);

    // Create the funding round entity
    const funding = this.fundingRoundRepository.create({
      ...fundingRoundData,
      startup: { id: fundingId },
      investors,
      moneyRaised // Associate investors with the funding round
    });

    const createdCapTable = await this.fundingRoundRepository.save(funding);
    console.log('Created Cap Table:', createdCapTable);

    const capTableInvestors = investors.map((investor, index) => {
      const capTableInvestor = new CapTableInvestor();
      capTableInvestor.capTable = createdCapTable;
      capTableInvestor.investor = investor;
      capTableInvestor.title = investorTitles[index];
      capTableInvestor.shares = investorShares[index];
      return capTableInvestor;
    });

    await Promise.all(capTableInvestors.map(async (capTableInvestor) => {
      await this.capTableInvestorRepository.save(capTableInvestor);
      return this.findById(createdCapTable.id);
    }));

    return createdCapTable;
  }

  async findById(id: number): Promise<FundingRound> {
    const fundingRound = await this.fundingRoundRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['startup', 'capTableInvestors', 'capTableInvestors.investor'],
    });
    if (!fundingRound) {
      throw new NotFoundException('Funding round not found');
    }
    return fundingRound;
  }

  async findAll(): Promise<FundingRound[]> {
    return this.fundingRoundRepository.find({
      where: { isDeleted: false },
      relations: ['startup', 'capTableInvestors', 'capTableInvestors.investor'],
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

  async getTotalMoneyRaisedForStartup(startupId: number): Promise<number> {
    try {
      // Find all funding rounds for the specified startup that are not deleted
      const fundingRounds = await this.fundingRoundRepository.find({
        where: { startup: { id: startupId }, isDeleted: false },
      });

      // Initialize a variable to hold the total money raised
      let totalMoneyRaised = 0;

      // Iterate through each funding round and sum up the money raised
      fundingRounds.forEach((round) => {
        // Ensure that moneyRaised is treated as a number
        totalMoneyRaised += round.moneyRaised;
      });

      return totalMoneyRaised;
    } catch (error) {
      // Handle any errors that might occur during the process
      console.error('Error calculating total money raised:', error);
      throw error;
    }
  }

  async getTotalSharesForInvestor(investorId: number, companyId: number): Promise<number> {
    try {
      // Find all funding rounds where the specified investor has participated
      const capTableInvestors = await this.capTableInvestorRepository.find({
        where: {
          investor: { id: investorId },
          capTable: { startup: { id: companyId } }
        },
        relations: ['capTable', 'capTable.startup'],
      });

      // Initialize a variable to hold the total shares
      let totalShares = 0;

      // Iterate through each cap table investor entry and sum up the shares
      capTableInvestors.forEach((capTableInvestor) => {
        totalShares += capTableInvestor.shares;
      });

      return totalShares;
    } catch (error) {
      // Handle any errors that might occur during the process
      console.error('Error calculating total shares for investor:', error);
      throw error;
    }
  }

  async getAllInvestorData(companyId: number): Promise<InvestorData[]> {
    try {
      // Fetch total money raised for the company
      const totalMoneyRaised = await this.getTotalMoneyRaisedForStartup(companyId);

      // Fetch all cap table investors for the specified company
      const capTableInvestors = await this.capTableInvestorRepository.find({
        where: {
          capTable: { startup: { id: companyId } },
        },
        relations: ['investor', 'capTable', 'capTable.startup'],
      });

      if (capTableInvestors.length === 0) {
        throw new Error('No investors found for this company');
      }

      // Aggregate data for each investor
      const investorDataMap: Map<number, InvestorData> = new Map();

      capTableInvestors.forEach((capTableInvestor) => {
        const investorId = capTableInvestor.investor.id;
        const investorName = `${capTableInvestor.investor.firstName} ${capTableInvestor.investor.lastName}`;
        const investorTitle = capTableInvestor.title;
        const shares = capTableInvestor.shares;

        if (investorDataMap.has(investorId)) {
          // Update existing entry
          const existingData = investorDataMap.get(investorId);
          existingData.totalShares += shares;
          existingData.percentage = (existingData.totalShares / totalMoneyRaised) * 100;
        } else {
          // Create new entry
          const percentage = (shares / totalMoneyRaised) * 100;
          investorDataMap.set(investorId, {
            id: investorId,
            name: investorName,
            title: investorTitle,
            totalShares: shares,
            percentage: percentage,
          });
        }
      });

      // Convert map values to an array and return
      const investorData = Array.from(investorDataMap.values());
      return investorData;
    } catch (error) {
      // Handle any errors that might occur during the process
      console.error('Error fetching all investor data:', error);
      throw error;
    }
  }


}

