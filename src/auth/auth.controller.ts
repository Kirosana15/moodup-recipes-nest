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

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local.strategy';
import { NoBearerAuth } from '../decorators/noBearer';
import { AuthorizedUser } from '../decorators/authorizedUser';
import { Prisma } from '@prisma/client';
import { UserCredentialsEntity, UserInfoEntity } from '../user/model/user.entity';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { TokensDto } from './dto/tokens.dto';

@ApiTags('Auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @NoBearerAuth()
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: 'User {username} already exists',
        error: 'Bad Request',
      },
    },
  })
  @Post('register')
  async register(@Body() userCredentialsDto: UserCredentialsEntity): Promise<UserInfoEntity> {
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
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(200)
  async login(@AuthorizedUser() user: UserInfoDto): Promise<TokensDto> {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.getNewTokens(user);
  }

  @ApiBearerAuth()
  @NoBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(RefreshAuthGuard)
  @Patch('/refresh-token')
  async refreshToken(@AuthorizedUser() user: TokensDto): Promise<TokensDto> {
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
