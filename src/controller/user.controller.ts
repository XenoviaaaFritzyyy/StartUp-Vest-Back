import { Controller, Post, Body, Get, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/service/user.service';
import { User } from 'src/entities/user.entity';
import { sign } from 'jsonwebtoken'; // Import jsonwebtoken

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

    const jwt = sign({ userId: user.id }, 'secretKey'); // Sign the JWT with the user's ID

    return { message: 'Login successful', jwt };
  }
}
