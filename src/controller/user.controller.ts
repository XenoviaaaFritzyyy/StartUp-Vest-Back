import { Controller, Post, Body, Get } from '@nestjs/common';
// import { UserService } from './user.service';
// import { User } from './user.entity';
import { UserService } from 'src/service/user.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() userData: User): Promise<void> {
    await this.userService.create(userData);
  }
  @Get()
  findAll(): string {
    return 'This action returns all users';
  }
}
