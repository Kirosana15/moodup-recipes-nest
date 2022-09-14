import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCredentialsDto, UserDto, UserInfoDto } from '../user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from './dto/tokens.dto';
import { UserService } from '../user/user.service';

import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async register(userCredentialsDto: UserCredentialsDto): Promise<UserInfoDto> {
    const { username, password } = userCredentialsDto;
    try {
      const hashedPassword = await this.hashPassword(password);
      const {
        password: _password,
        refreshToken: _refreshToken,
        ...user
      } = await this.userService.create({ username, password: hashedPassword });
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
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async validateUser(userCredentialsDto: UserCredentialsDto): Promise<UserInfoDto> {
    const { username, password } = userCredentialsDto;
    const user = <UserDto>await this.userService.userWithCredentials({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isValid = await this.comparePassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    const { password: _password, refreshToken: _refresh, ...userData } = user;
    return userData;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async refreshTokens(id: string, refreshToken: string): Promise<TokensDto> {
    const user = <UserDto>await this.userService.userWithCredentials({ id });
    if (user?.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }
    const { refreshToken: _r, password: _p, ...userData } = user;
    return this.getNewTokens(userData);
  }

  async getNewTokens(user: UserInfoDto): Promise<TokensDto> {
    if (!user) {
      throw new UnauthorizedException();
    }
    const accessToken = this.jwtService.sign(user);
    const refreshToken = this.jwtService.sign({ id: user.id });
    await this.userService.update({ id: user.id }, { refreshToken });
    return { accessToken, refreshToken };
  }
}
