import { Controller, Post, Body, Req, UnauthorizedException, Get, Param, Query, Put, Delete } from '@nestjs/common';
import { InvestorService } from 'src/service/businessprofileservice/investor.service';
import { Investor } from 'src/entities/businessprofileentities/investor.entity';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { UserService } from 'src/service/user.service';

@Controller('investors')
export class InvestorsController {
  constructor(
    private readonly investorService: InvestorService,
    private readonly userService: UserService, // inject UserService
  ) {}

  private getUserIdFromToken(authorizationHeader?: string): number {
    console.log('Authorization Header:', authorizationHeader);

    if (!authorizationHeader) {
        throw new UnauthorizedException('Authorization header is required');
    }

    // Replace 'Bearer ' with an empty string to get the JWT.
    const token = authorizationHeader.replace('Bearer ', '');
    console.log('Token:', token);

    // Decode the JWT to get the payload.
    const payload = jwt.verify(token, 'secretKey');
    console.log('Payload:', payload);

    // Return the user's ID from the payload.
    return payload.userId;
  }

  @Post('create')
  async create(@Req() request: Request, @Body() investorData: Investor): Promise<any> {
    const userId = this.getUserIdFromToken(request.headers['authorization']);
    await this.investorService.create(userId, investorData);
    return { message: 'Investor created successfully' };
  }

  @Get()
  findAll(@Req() request: Request) {
    const userId = this.getUserIdFromToken(request.headers['authorization']);
    return this.investorService.findAll(userId);
  }

  // // In InvestorsController
  // @Get()
  // findAll() {
  //   return this.investorService.findAll();
  // }

  // @Get()
  // findAll(@Query('userId') userId: number) {
  //   return this.investorService.findAll(userId);
  // }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.investorService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() investorData: Investor, @Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request.headers['authorization']);
    await this.investorService.update(userId, id, investorData);
    return { message: 'Investor updated successfully' };
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request.headers['authorization']);
    await this.investorService.delete(userId, id);
    return { message: 'Investor deleted successfully' };
  }
  // other methods...
}
