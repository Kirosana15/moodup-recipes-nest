import { Body, Controller, Headers, HttpCode, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserCredentialsDto, UserInfoDto } from '../user/dto/user.dto';

import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { LocalAuthGuard } from './strategies/local.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userCredentialsDto: UserCredentialsDto): Promise<UserInfoDto> {
    return this.authService.register(userCredentialsDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: any): Promise<TokensDto> {
    return req.user;
  }

  @Patch('/refresh-token')
  async refreshToken(@Headers('Authorization') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
