import { Controller, Delete, Get, NotFoundException, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../decorators/roles';
import { RoleTypes } from '../auth/enums/roles';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { UserService } from './user.service';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { PaginatedResults } from '../dto/paginatedResults.dto';
import { ApiDefaultResponses } from '../swagger/default';
import { ApiOkPaginatedResults } from '../swagger/paginated';
import { UserInfoEntity } from './model/user.entity';

@ApiTags('User')
@ApiBearerAuth()
@ApiDefaultResponses()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  @ApiOkPaginatedResults()
  @Roles(RoleTypes.Admin)
  getAllUsers(@Query() paginatedQueryDto: PaginatedQueryDto): Promise<PaginatedResults<UserInfoEntity>> {
    return this.userService.users(paginatedQueryDto);
  }

  @Get('/me')
  getUserProfile(@Req() req: any): UserInfoEntity {
    const { id, username, roles, createdAt } = req.user;
    return { id, username, roles, createdAt };
  }

  @Delete('/:id')
  @UseGuards(OwnerGuard)
  deleteUser(@Param('id') id: string): Promise<UserInfoEntity> {
    return this.userService.delete({ id });
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<UserInfoEntity> {
    const user = await this.userService.user({ id });
    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
