import { Controller, Delete, Get, NotFoundException, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

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

  @Roles(RoleTypes.Admin)
  @ApiOkPaginatedResults()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get('/all')
  getAllUsers(@Query() paginatedQueryDto: PaginatedQueryDto): Promise<PaginatedResults<UserInfoEntity>> {
    return this.userService.users(paginatedQueryDto);
  }

  @Get('/me')
  getUserProfile(@Req() req: any): UserInfoEntity {
    const { id, username, roles, createdAt } = req.user;
    return { id, username, roles, createdAt };
  }

  @UseGuards(OwnerGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<UserInfoEntity> {
    return this.userService.delete({ id });
  }

  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<UserInfoEntity> {
    const user = await this.userService.user({ id });
    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
