import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'os';
import { UserCredentialsDto } from '../user/dto/user-from-db.dto';
import { UserInfoDto } from '../user/dto/user-from-db.dto';
import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userCredentialsDto: UserCredentialsDto): Promise<UserInfoDto> {
    return this.authService.register(userCredentialsDto);
  }

  @Post('login')
  async login(@Body() userCredentialsDto: UserCredentialsDto): Promise<TokensDto> {
    return this.authService.login(userCredentialsDto);
  }
}
