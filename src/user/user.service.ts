import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PaginatedResults } from '../dto/paginatedResults.dto';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { paginate } from '../helpers/paginate';
import { PrismaService } from '../prisma/prisma.service';
import { Select } from './constants';
import { UserInfoDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(userCredentialsDto: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: userCredentialsDto });
  }

  async delete(where: Prisma.UserWhereUniqueInput, select = Select.UserInfo): Promise<UserInfoDto> {
    return this.prisma.user.delete({ select, where });
  }

  async user(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUniqueOrThrow({ where });
  }

  async refreshToken(id: string, newToken: string): Promise<User> {
    return this.prisma.user.update({ data: { refreshToken: newToken }, where: { id } });
  }

  users(paginatedQueryDto: PaginatedQueryDto, select?: Prisma.UserSelect, where?: Prisma.UserWhereInput) {
    const { page, limit } = paginatedQueryDto;
    const take = limit || 10;
    const skip = (page - 1) * take;
    return this.prisma.user.findMany({ select, skip, take, where, orderBy: { id: 'asc' } });
  }
}
