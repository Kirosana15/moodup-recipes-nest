import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCredentialsDto, UserInfoDto } from '../user/dto/user.dto';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';
import { AccessTokenDto, RefreshTokenDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async register(userCredentialsDto: UserCredentialsDto): Promise<UserInfoDto> {
    const { username, password } = userCredentialsDto;
    try {
      const hashedPassword = await this.hashPassword(password);
      const { password: _password, check: _check, ...user } = await this.userService.create({ username, password: hashedPassword });
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

  async validateUser(userCredentialsDto: UserCredentialsDto): Promise<UserInfoDto | null> {
    const { username, password } = userCredentialsDto;
    const user = await this.userService.getByUsername(username);
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const { password: _password, check: _check, ...userData } = user;
        return userData;
      }
    }
    return null;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async login(userCredentialsDto: UserCredentialsDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(userCredentialsDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { username, _id, isAdmin, ..._ } = user;
    const payload = { _id, username, isAdmin };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getNewTokens(refreshToken: string): Promise<{ access_token: string; refresh_token: string } | null> {
    const { _id, check } = <RefreshTokenDto>this.jwtService.verify(refreshToken);
    const user = await this.userService.getById(_id);
    if (user?.check === check) {
      const newCheck = await this.userService.refreshToken(_id);
      const newRefresh = this.jwtService.sign({ _id, check: newCheck });
      const payload = user as AccessTokenDto;
      const newAccess = this.jwtService.sign(payload);
      return { access_token: newAccess, refresh_token: newRefresh };
    }
    return null;
  }
}
