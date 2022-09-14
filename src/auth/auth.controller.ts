import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Logger,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserInfoDto } from '../user/dto/user.dto';

import { ApiBearerAuth, ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RefreshTokenDto, TokensDto } from './dto/tokens.dto';
import { LocalAuthGuard } from './strategies/local.strategy';
import { NoBearerAuth } from '../decorators/noBearer';
import { AuthorizedUser } from '../decorators/authorizedUser';
import { Prisma } from '@prisma/client';
import { UserCredentialsEntity } from '../user/model/user.entity';
import { RefreshAuthGuard } from './guards/refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @NoBearerAuth()
  @Post('register')
  async register(@Body() userCredentialsDto: UserCredentialsEntity): Promise<UserInfoDto> {
    try {
      const newUser = await this.authService.register(userCredentialsDto);
      return newUser;
    } catch (err) {
      Logger.error(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException(`User '${userCredentialsDto.username}' already exists`);
        }
      }
      throw err;
    }
  }

  @NoBearerAuth()
  @ApiBody({ schema: { $ref: getSchemaPath(UserCredentialsEntity) } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@AuthorizedUser() user: UserInfoDto): Promise<TokensDto> {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.getNewTokens(user);
  }

  @ApiBearerAuth()
  @NoBearerAuth()
  @UseGuards(RefreshAuthGuard)
  @Patch('/refresh-token')
  async refreshToken(@AuthorizedUser() user: RefreshTokenDto) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
