import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsDto } from '../user/dto/user.credentials.dto';
import { User } from '../user/user.schema';
import { Error, MongooseError } from 'mongoose';
import { UserDto } from '../user/dto/user.from.db.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async register(userCredentialsDto: UserCredentialsDto): Promise<UserDto | undefined> {
    const { username, password } = userCredentialsDto;
    try {
      const hashedPassword = await this.hashPassword(password);
      const user = await this.userService.create({ username, password: hashedPassword });
      return user;
    } catch (err: unknown) {
      if ((err as { code: number }).code === 11000) {
        throw new ConflictException('Username taken');
      } else {
        throw err;
      }
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
