import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Startup } from 'src/entities/businessprofileentities/startup.entity';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken

@Injectable()
export class StartupService {
  constructor(
    @InjectRepository(Startup)
    private startupsRepository: Repository<Startup>,
  ) {}

  // async create(startupData: Startup): Promise<Startup> {
  //   const startup = this.startupsRepository.create(startupData);
  //   return this.startupsRepository.save(startup);
  // }

  // In StartupService
  // async findAll(): Promise<Startup[]> {
  //   return this.startupsRepository.find();
  // }

  // async findAll(userId: number): Promise<Startup[]> {
  //   return this.startupsRepository.find({ where: { user: { id: userId } } });
  // }

  async findOne(id: number): Promise<Startup> {
    return this.startupsRepository.findOne({ where: { id } });
  }

  async create(userId: number, startupData: Startup): Promise<Startup> {
    const startup = this.startupsRepository.create({ ...startupData, user: { id: userId } });
    return this.startupsRepository.save(startup);
  }

  async findAll(userId: number): Promise<Startup[]> {
    return this.startupsRepository.find({ where: { user: { id: userId } } });
  }


  // other methods...
}
