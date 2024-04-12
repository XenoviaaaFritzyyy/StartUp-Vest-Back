import { Controller, Post, Body } from '@nestjs/common';
// import { UserService } from './user.service';
// import { User } from './user.entity';
import { UserService } from 'src/service/user.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData: User): Promise<void> {
    await this.userService.create(userData);
  }
}
