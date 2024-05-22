import { Controller, Post, Body, Get, Param, NotFoundException, InternalServerErrorException, HttpException, HttpStatus, Logger, Query } from '@nestjs/common';
import { Investor } from 'src/entities/businessprofileentities/investor.entity';
import { InvestorService } from 'src/service/businessprofileservice/investor.service';
import { CapTable } from 'src/entities/financialentities/cap.entity';
import { CapTableService } from 'src/service/financialservice/cap.service';

@Controller('cap-table')
export class CapTableController {
    private readonly logger = new Logger(CapTableController.name);

    constructor(
        private readonly investorService: InvestorService,
        private readonly capTableService: CapTableService
    ) { }

    @Get('by-ids')
    async getInvestorsByIds(@Query('ids') ids: string): Promise<Investor[]> {
        try {
            const idArray = ids.split(',').map(id => parseInt(id, 10));
            return await this.investorService.findByIds(idArray);
        } catch (error) {
            this.logger.error('Failed to fetch investors by IDs:', error);
            throw new HttpException('Failed to fetch investors', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('createcap')
    async createCapTable(@Body() capTableData: Partial<CapTable>, @Body('investors') investors: Investor[], @Body('shares') shares: number[], @Body('titles') titles: string[]): Promise<CapTable> {
        try {
            this.logger.log('Received cap table data:', JSON.stringify(capTableData));

            const startupId = capTableData.startup?.id;
            if (!startupId) {
                throw new HttpException('Startup ID is required', HttpStatus.BAD_REQUEST);
            }

            const investorIds = investors.map(investor => investor.id);
            this.logger.log('Extracted investor IDs:', investorIds);

            const createdCapTable = await this.capTableService.create(startupId, capTableData as CapTable, investorIds, shares, titles);

            this.logger.log('Cap Table created:', JSON.stringify(createdCapTable));
            return createdCapTable;
        } catch (error) {
            this.logger.error('Failed to create cap table:', error);
            throw new HttpException('Failed to create cap table', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('all')
    async findAll(): Promise<CapTable[]> {
        try {
            const capTables = await this.capTableService.findAll();
            if (!capTables || capTables.length === 0) {
                throw new NotFoundException('No cap tables found');
            }
            return capTables;
        } catch (error) {
            this.logger.error('Failed to fetch cap tables:', error);
            throw new HttpException('Failed to fetch cap tables', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<CapTable> {
        try {
            const capTable = await this.capTableService.findById(id);
            if (!capTable) {
                throw new NotFoundException('Cap table not found');
            }
            return capTable;
        } catch (error) {
            this.logger.error('Failed to fetch cap table by ID:', error);
            throw new HttpException('Failed to fetch cap table', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
