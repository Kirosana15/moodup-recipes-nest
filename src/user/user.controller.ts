import { Controller, Delete, Get, NotFoundException, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Roles } from '../decorators/roles';
import { RoleTypes } from '../auth/enums/roles';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { UserInfoDto } from './dto/user.dto';
import { UserService } from './user.service';
import { OwnerGuard } from '../auth/guards/owner.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  @Roles(RoleTypes.Admin)
  getAllUsers(@Query() paginatedQueryDto: PaginatedQueryDto) {
    return this.userService.users(paginatedQueryDto);
  }

  @Delete('/:id')
  @UseGuards(OwnerGuard)
  deleteUser(@Param('id') id: string) {
    return this.userService.delete({ id });
  }

  @Get('/me')
  getUserProfile(@Req() req: any): UserInfoDto {
    const { id, username, roles, createdAt } = req.user;
    return { id, username, roles, createdAt };
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = this.userService.user({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
