import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { compare, hash } from 'bcrypt'; // Import bcrypt

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: User): Promise<User> {
    const hashedPassword = await hash(userData.password, 10); // Hash the password
    const user = this.usersRepository.create({ ...userData, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
  
    if (user && await compare(password, user.password)) { // Compare the hashed password
      return user;
    }
  
    return null;
  }
}
