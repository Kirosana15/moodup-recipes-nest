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
  getAllUsers(@Req() req: any, @Query() paginatedQueryDto?: PaginatedQueryDto): Promise<UserInfoDto[]> {
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
}
