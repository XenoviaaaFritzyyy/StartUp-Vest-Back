import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundingRoundService } from 'src/service/financialservice/funding.service';
import { FundingRound } from 'src/entities/financialentities/funding.entity';
import { StartupService } from 'src/service/businessprofileservice/startup.service'; // Import the StartupService
import { FundingRoundController } from 'src/controller/financialcontroller/funding.controller';
import { Startup } from 'src/entities/businessprofileentities/startup.entity';
import { Investor } from 'src/entities/businessprofileentities/investor.entity';
import { UserService } from 'src/service/user.service';
import { User } from 'src/entities/user.entity';
import { InvestorService } from 'src/service/businessprofileservice/investor.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([FundingRound]),
    TypeOrmModule.forFeature([Investor]),
    TypeOrmModule.forFeature([Startup]),
    TypeOrmModule.forFeature([User]), // Import the Startup entity
  ],
  controllers: [FundingRoundController],
  providers: [FundingRoundService, StartupService,UserService,InvestorService], // Add StartupService to providers
})
export class FundingModule {}
