import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(userId: number, id: number, startupData: Startup): Promise<void> {
    // Ensure the startup exists and belongs to the user
    const startup = await this.startupsRepository.findOne({ where: { id, user: { id: userId }, isDeleted: false } });
    if (!startup) {
      throw new NotFoundException('Startup not found');
    }
  
    // Update the startup
    await this.startupsRepository.update(id, startupData);
  }

  async findOne(id: number): Promise<Startup> {
    return this.startupsRepository.findOne({ where: { id, isDeleted: false } });
  }

  async create(userId: number, startupData: Startup): Promise<Startup> {
    const startup = this.startupsRepository.create({ ...startupData, user: { id: userId }, isDeleted: false });
    return this.startupsRepository.save(startup);
  }

  async findAll(userId: number): Promise<Startup[]> {
    return this.startupsRepository.find({ where: { user: { id: userId }, isDeleted: false  } });
  }

  async delete(userId: number, id: number): Promise<void> {
    const startup = await this.startupsRepository.findOne({ where: { id, user: { id: userId }, isDeleted: false } });
    if (!startup) {
      throw new NotFoundException('Startup not found');
    }
    await this.startupsRepository.update(id, { isDeleted: true });
  }

  // other methods...
}
