import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CapTable } from "src/entities/financialentities/cap.entity";
import { Repository } from "typeorm";
import { InvestorService } from "../businessprofileservice/investor.service";
import { CapTableInvestor } from "src/entities/financialentities/capInvestor.entity";

@Injectable()
export class CapTableService {
  constructor(
    @InjectRepository(CapTable)
    private readonly capTableRepository: Repository<CapTable>,
    private readonly investorService: InvestorService,
    @InjectRepository(CapTableInvestor)
    private readonly capTableInvestorRepository: Repository<CapTableInvestor>
  ) {}

  async create(capId: number, capTableData: CapTable, investorIds: number[], investorShares: number[], investorTitles: string[]): Promise<CapTable> {
    // Fetch investors by their IDs
    const investors = await this.investorService.findByIds(investorIds);

    // Create the CapTable entity
    const capTable = this.capTableRepository.create({
      ...capTableData,
      startup: { id: capId }, // Assuming startup ID needs to be assigned
    });

    // Save the CapTable entity
    const createdCapTable = await this.capTableRepository.save(capTable);

    // Create CapTableInvestor entities for each investor
    const capTableInvestors = investors.map((investor, index) => {
      const capTableInvestor = new CapTableInvestor();
      capTableInvestor.capTable = createdCapTable;
      capTableInvestor.investor = investor;
      capTableInvestor.title = investorTitles[index];
      capTableInvestor.shares = investorShares[index];
      return capTableInvestor;
    });

    // Save CapTableInvestor entities
    await Promise.all(capTableInvestors.map(async (capTableInvestor) => {
      await this.capTableInvestorRepository.save(capTableInvestor);
      return this.findById(createdCapTable.id);
    }));

    return createdCapTable;
  }

  async findById(id: number): Promise<CapTable> {
    return this.capTableRepository.findOne({
      where: { id },
      relations: ['startup', 'capTableInvestors', 'capTableInvestors.investor'],
    });
  }

  async findAll(): Promise<CapTable[]> {
    return this.capTableRepository.find({
      relations: ['startup', 'capTableInvestors', 'capTableInvestors.investor'],
    });
  }
}
