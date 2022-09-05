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
  getAllUsers(@Query() paginatedQueryDto?: PaginatedQueryDto): Promise<UserInfoDto[]> {
    return this.userService.getAll(paginatedQueryDto);
  }

  @Delete('/:_id')
  @UseGuards(OwnerGuard)
  deleteUser(@Param('_id') id: string): Promise<UserInfoDto | null> {
    const deletedUser = this.userService.delete(id);
    if (!deletedUser) {
      throw new NotFoundException('User with this id does not exist');
    }
    return deletedUser;
  }

  @Get('/me')
  getUserProfile(@Req() req: any): UserInfoDto {
    const { _id, username, roles, createdAt } = req.user;
    const user: UserInfoDto = { _id, username, roles, createdAt };
    return user;
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }
    return user;
  }
}
