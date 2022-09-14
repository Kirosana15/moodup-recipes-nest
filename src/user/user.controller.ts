import { Controller, Delete, Get, NotFoundException, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../decorators/roles';
import { RoleTypes } from '../auth/enums/roles';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { UserInfoDto } from './dto/user.dto';
import { UserService } from './user.service';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { PaginatedResults } from '../dto/paginatedResults.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  @Roles(RoleTypes.Admin)
  getAllUsers(@Query() paginatedQueryDto: PaginatedQueryDto): Promise<PaginatedResults<UserInfoDto>> {
    return this.userService.users(paginatedQueryDto);
  }

  @Get('/me')
  getUserProfile(@Req() req: any): UserInfoDto {
    const { id, username, roles, createdAt } = req.user;
    return { id, username, roles, createdAt };
  }

  @Delete('/:id')
  @UseGuards(OwnerGuard)
  deleteUser(@Param('id') id: string): Promise<UserInfoDto> {
    return this.userService.delete({ id });
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
