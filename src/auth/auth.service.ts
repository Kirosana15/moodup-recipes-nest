import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsDto } from '../user/dto/user.credentials.dto';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async register(userCredentialsDto: UserCredentialsDto): Promise<User> {
    const { username, password } = userCredentialsDto;
    if (await this.userService.getByUsername(username)) {
      throw new ConflictException('Username taken');
    }
    const hashedPassword = await this.hashPassword(password);
    return this.userService.create({ username, password: hashedPassword });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
