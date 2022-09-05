import { Body, Controller, Headers, HttpCode, Patch, Post, UseGuards } from '@nestjs/common';
import { UserCredentialsDto, UserInfoDto } from '../user/dto/user.dto';

import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { LocalAuthGuard } from './strategies/local.strategy';
import { NoBearerAuth } from '../decorators/noBearer';
import { AuthorizedUser } from '../decorators/authorizedUser';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @NoBearerAuth()
  @Post('register')
  async register(@Body() userCredentialsDto: UserCredentialsDto): Promise<UserInfoDto> {
    return this.authService.register(userCredentialsDto);
  }

  @NoBearerAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@AuthorizedUser() tokens: TokensDto): Promise<TokensDto> {
    return tokens;
  }

  @Patch('/refresh-token')
  async refreshToken(@Headers('Authorization') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
