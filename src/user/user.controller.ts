import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Roles } from '../decorators/roles';
import { RoleTypes } from '../auth/enums/roles';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { UserInfoDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  @Roles(RoleTypes.Admin)
  getAllUsers(@Req() req: any, @Query() paginatedQueryDto?: PaginatedQueryDto): Promise<UserInfoDto[]> {
    return this.userService.getAll(paginatedQueryDto);
  }
}
