import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { UserCredentialsDto, UserDto, UserInfoDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { RefreshTokenDto, TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async register(userCredentialsDto: UserCredentialsDto): Promise<UserInfoDto> {
    const { username, password } = userCredentialsDto;
    try {
      const hashedPassword = await this.hashPassword(password);
      const {
        password: _password,
        check: _check,
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

  async validateUser(userCredentialsDto: UserCredentialsDto): Promise<UserDto | null> {
    const { username, password } = userCredentialsDto;
    const user = await this.userService.getByUsername(username);
    if (user) {
      const isValid = await this.comparePassword(password, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async refreshTokens(payload: RefreshTokenDto): Promise<TokensDto> {
    try {
      const { _id, check } = payload;
      const user = await this.userService.getById(_id);
      if (user?.check === check) {
        return this.getNewTokens(user);
      }
    } catch (err) {
      throw new UnauthorizedException('Invalid Token ');
    }
    throw new UnauthorizedException('Invalid Token ');
  }

  async getNewTokens(user: UserDto): Promise<TokensDto> {
    const updatedUser = await this.userService.updateCheck(user);
    if (!updatedUser) {
      throw new UnauthorizedException();
    }
    const { password: _password, check: _check, ...userData } = updatedUser;
    const accessToken = this.jwtService.sign(userData);
    const refreshToken = this.jwtService.sign({ _id: updatedUser._id, check: updatedUser.check });
    return { accessToken, refreshToken };
  }
}
