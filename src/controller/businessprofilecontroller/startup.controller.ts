import { Controller, Post, Body, Req, UnauthorizedException, Get, Param, Query, Put } from '@nestjs/common';
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
    const userId = this.getUserIdFromToken(request.headers['authorization']);
    await this.startupService.create(userId, startupData);
    return { message: 'Startup created successfully' };
  }

  @Get()
  findAll(@Req() request: Request) {
    const userId = this.getUserIdFromToken(request.headers['authorization']);
    return this.startupService.findAll(userId);
  }

    // In StartupsController
  // @Get()
  // findAll() {
  //   return this.startupService.findAll();
  // }

  // @Get()
  // findAll(@Query('userId') userId: number) {
  //   return this.startupService.findAll(userId);
  // }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.startupService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() startupData: Startup, @Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request.headers['authorization']);
    await this.startupService.update(userId, id, startupData);
    return { message: 'Startup updated successfully' };
  }  

  // other methods...
}
