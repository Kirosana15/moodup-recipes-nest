import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfoDto } from './dto/user-from-db.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({ isArray: true })
  @Get('/all')
  getAllUsers(@Query('limit') limit?: number, @Query('page') page?: number): Promise<UserInfoDto[]> {
    return this.userService.getAll(limit, page);
  }
}
