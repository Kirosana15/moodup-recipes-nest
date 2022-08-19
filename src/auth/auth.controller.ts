import { Body, Controller, Headers, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserCredentialsDto, UserInfoDto } from '../user/dto/user.dto';

import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { BasicAuthGuard } from './strategies/basic.strategy';
import { generateMockToken } from '../user/test/mock/user.model.mock';

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
  async login(@Req() req: any): Promise<UserInfoDto> {
    return req.user;
  }

  @Patch('/refresh-token')
  async refreshToken(@Headers('Authorization') refreshToken: string) {
    return this.authService.getNewTokens(refreshToken);
  }
}
