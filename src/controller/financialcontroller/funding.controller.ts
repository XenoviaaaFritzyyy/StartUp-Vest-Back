import { Controller, Post, Body, Get, Param, NotFoundException, UnauthorizedException, Req, InternalServerErrorException, HttpException, HttpStatus, Logger, Query } from '@nestjs/common';
import { FundingRoundService } from 'src/service/financialservice/funding.service';
import { FundingRound } from 'src/entities/financialentities/funding.entity';
import { StartupService } from 'src/service/businessprofileservice/startup.service';
import { UserService } from 'src/service/user.service';
import * as jwt from 'jsonwebtoken';
import { Investor } from 'src/entities/businessprofileentities/investor.entity';
import { InvestorService } from 'src/service/businessprofileservice/investor.service';

@Controller('funding-rounds')
export class FundingRoundController {
  private readonly logger = new Logger(FundingRoundController.name);

  constructor(
    private readonly startupService: StartupService,
    private readonly userService: UserService,
    private readonly investorService: InvestorService,
    private readonly fundingRoundService: FundingRoundService
  ) { }

  private getUserIdFromToken(authorizationHeader?: string): number {
    console.log('Authorization Header:', authorizationHeader);

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authorizationHeader.replace('Bearer ', '');
    console.log('Token:', token);

    const payload = jwt.verify(token, 'secretKey');
    console.log('Payload:', payload);

    return payload.userId;
  }

  @Get('by-ids')
  async getInvestorsByIds(@Query('ids') ids: string): Promise<Investor[]> {
    const idArray = ids.split(',').map(id => parseInt(id, 10));
    return this.investorService.findByIds(idArray);
  }

  @Post('createfund')
  async createFundingRound(@Body() fundingRoundData: FundingRound): Promise<FundingRound> {
    try {
      this.logger.log('Received funding round data:', JSON.stringify(fundingRoundData));

      const startupId = fundingRoundData.startup?.id;
      if (!startupId) {
        throw new HttpException('Startup ID is required', HttpStatus.BAD_REQUEST);
      }

      const investorIds = fundingRoundData.investors?.map(investor => investor.id) || [];
      this.logger.log('Extracted investor IDs:', investorIds);

      const createdFunding = await this.fundingRoundService.create(startupId, fundingRoundData, investorIds);

      this.logger.log('Funding round created:', JSON.stringify(createdFunding));
      return createdFunding;
    } catch (error) {
      this.logger.error('Failed to create funding round:', error);
      throw new HttpException('Failed to create funding round', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('all')
  async findAll() {
    try {
      const fundingRounds = await this.fundingRoundService.findAll();
      if (!fundingRounds || fundingRounds.length === 0) {
        throw new NotFoundException('No funding rounds found');
      }
      return fundingRounds;
    } catch (error) {
      this.logger.error('Failed to fetch funding rounds:', error);
      throw new HttpException('Failed to fetch funding rounds', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get(':id')
  async findById(@Param('id') id: number): Promise<FundingRound> {
    const fundingRound = await this.fundingRoundService.findById(id);
    if (!fundingRound) {
      throw new NotFoundException('Funding round not found');
    }
    return fundingRound;
  }


}

