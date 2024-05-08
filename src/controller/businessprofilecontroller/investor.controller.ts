import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
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
    // Extract the user's ID from the JWT in the Authorization header.
    const userId = this.getUserIdFromToken(request.headers['authorization']);
    // Fetch the user from the database.
    const user = await this.userService.findById(userId);
    // Add the user's ID to the investor data.
    investorData.user = user;
    // Create the investor.
    await this.investorService.create(investorData);
    // Return a success message.
    return { message: 'Investor created successfully' };
  }

  // other methods...
}
