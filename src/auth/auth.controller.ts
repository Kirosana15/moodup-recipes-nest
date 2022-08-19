import { Body, Controller, HttpCode, Patch, Post, Req, UseGuards, Req, UseGuards } from '@nestjs/common';
import { UserCredentialsDto, UserInfoDto } from '../user/dto/user.dto';

import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { BasicAuthGuard } from './strategies/basic.strategy';
import { RefreshBearerGuard } from './strategies/refresh.bearer.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userCredentialsDto: UserCredentialsDto): Promise<UserInfoDto> {
    return this.authService.register(userCredentialsDto);
  }
  @UseGuards(BasicAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: any): Promise<TokensDto> {
    return req.user;
  }

  @UseGuards(RefreshBearerGuard)
  @Patch('/refresh-token')
  async refreshToken(@Req() req: any) {
    return req.user;
  }
}
