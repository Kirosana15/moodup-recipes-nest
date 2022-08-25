import { Controller, ForbiddenException, Get, Logger, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BearerAuthGuard } from '../auth/strategies/bearer.strategy';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { UserInfoDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  @UseGuards(BearerAuthGuard)
  getAllUsers(@Req() req: any, @Query() paginatedQueryDto?: PaginatedQueryDto): Promise<UserInfoDto[]> {
    Logger.log(req.user);
    if (req.user.isAdmin) {
      return this.userService.getAll(paginatedQueryDto);
    }
    throw new ForbiddenException();
  }
}
