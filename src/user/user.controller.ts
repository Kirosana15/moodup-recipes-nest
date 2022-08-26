import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles, RoleTypes } from '../auth/enums/roles';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { UserInfoDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(RoleTypes.Admin)
  @Get('/all')
  getAllUsers(@Query() paginatedQueryDto?: PaginatedQueryDto): Promise<UserInfoDto[]> {
    return this.userService.getAll(paginatedQueryDto);
  }
}
