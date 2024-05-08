import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { StartupService } from 'src/service/businessprofileservice/startup.service';
import { Startup } from 'src/entities/businessprofileentities/startup.entity';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { UserService } from 'src/service/user.service';

@Controller('startups')
export class StartupsController {
  constructor(
    private readonly startupService: StartupService,
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
    async create(@Req() request: Request, @Body() startupData: Startup): Promise<any> {
    // Extract the user's ID from the JWT in the Authorization header.
    const userId = this.getUserIdFromToken(request.headers['authorization']);
    // Fetch the user from the database.
    const user = await this.userService.findById(userId);
    // Add the user to the startup data.
    startupData.user = user;
    // Create the startup.
    await this.startupService.create(startupData);
    // Return a success message.
    return { message: 'Startup created successfully' };
    }

  // other methods...
}
