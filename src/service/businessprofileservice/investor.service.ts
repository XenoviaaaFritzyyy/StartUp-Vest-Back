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
    return this.investorsRepository.findOne({ where: { id, isDeleted: false } });
  }

  async create(userId: number, investorData: Investor): Promise<Investor> {
    const investor = this.investorsRepository.create({ ...investorData, user: { id: userId } });
    return this.investorsRepository.save(investor);
  }

  async findAll(userId: number): Promise<Investor[]> {
    return this.investorsRepository.find({ where: { user: { id: userId }, isDeleted: false } });
  }

  async update(userId: number, id: number, investorData: Investor): Promise<void> {
    // Ensure the investor exists and belongs to the user
    const investor = await this.investorsRepository.findOne({ where: { id, user: { id: userId }, isDeleted: false } });
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }

    // Update the investor
    await this.investorsRepository.update(id, investorData);
  }

  async delete(userId: number, id: number): Promise<void> {
    const investor = await this.investorsRepository.findOne({ where: { id, user: { id: userId }, isDeleted: false } });
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    investor.isDeleted = true;
    await this.investorsRepository.save(investor);
  }

  // other methods...
}
