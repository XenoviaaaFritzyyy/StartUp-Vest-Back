import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Startup } from 'src/entities/businessprofileentities/startup.entity';

@Injectable()
export class StartupService {
  constructor(
    @InjectRepository(Startup)
    private startupsRepository: Repository<Startup>,
  ) {}

  async create(startupData: Startup): Promise<Startup> {
    const startup = this.startupsRepository.create(startupData);
    return this.startupsRepository.save(startup);
  }

  // other methods...
}
