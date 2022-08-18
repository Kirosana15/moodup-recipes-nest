import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UserCredentialsDto, UserInfoDto } from '../user/dto/user.dto';

import { ApiTags } from '@nestjs/swagger';
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

  @Get('/refresh-token')
  async refreshToken(@Headers('Authorization') refreshToken: string) {
    return this.authService.getNewTokens(refreshToken);
  }
}
