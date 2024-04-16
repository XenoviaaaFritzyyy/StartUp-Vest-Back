import { Controller, Post, Body, Get, UnauthorizedException } from '@nestjs/common';
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

  @Post('login')
  async login(@Body() loginData: { email: string, password: string }): Promise<any> {
    const user = await this.userService.validateUser(loginData.email, loginData.password);

    if (!user) {
      throw new UnauthorizedException();
    }

    // TODO: Implement JWT or session here for user authentication
    // For now, let's just return a success message
    return { message: 'Login successful' };
  }
}
