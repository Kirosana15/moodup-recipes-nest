import { Controller, ForbiddenException, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BasicAuthGuard } from '../auth/strategies/basic.strategy';
import { BearerAuthGuard } from '../auth/strategies/bearer.strategy';
import { Roles, RoleTypes } from '../auth/enums/roles';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { UserInfoDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(BasicAuthGuard)
  @Roles(RoleTypes.Admin)
  @Get('/all')
  @UseGuards(BearerAuthGuard)
  getAllUsers(@Req() req: any, @Query() paginatedQueryDto?: PaginatedQueryDto): Promise<UserInfoDto[]> {
    if (req.user.isAdmin) {
      return this.userService.getAll(paginatedQueryDto);
    }
    throw new ForbiddenException();
  }
}
