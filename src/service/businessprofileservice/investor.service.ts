import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Investor } from 'src/entities/businessprofileentities/investor.entity';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken

@Injectable()
export class InvestorService {
  [x: string]: any;
  constructor(
    @InjectRepository(Investor)
    private investorsRepository: Repository<Investor>,
  ) {}

  // async create(investorData: Investor): Promise<Investor> {
  //   const investor = this.investorsRepository.create(investorData);
  //   return this.investorsRepository.save(investor);
  // }

  // // In InvestorService
  // // async findAll(): Promise<Investor[]> {
  // //   return this.investorsRepository.find();
  // // }

  // async findAll(userId: number): Promise<Investor[]> {
  //   return this.investorsRepository.find({ where: { user: { id: userId } } });
  // }

  async findOne(id: number): Promise<Investor> {
    return this.investorsRepository.findOne({ where: { id } });
  }

  async create(userId: number, investorData: Investor): Promise<Investor> {
    const investor = this.investorsRepository.create({ ...investorData, user: { id: userId } });
    return this.investorsRepository.save(investor);
  }

  async findAll(userId: number): Promise<Investor[]> {
    return this.investorsRepository.find({ where: { user: { id: userId } } });
  }
  async findAllInvestors(): Promise<Investor[]> {
    return this.investorsRepository.find();
  }

  async update(id: number, investorData: Partial<Investor>): Promise<Investor> {
    const existingInvestor = await this.findOne(id);
    if (!existingInvestor) {
      throw new NotFoundException('Investor not found');
    }
    const updatedInvestor = await this.investorsRepository.save({ ...existingInvestor, ...investorData });
    return updatedInvestor;
  }

  // other methods...
}
