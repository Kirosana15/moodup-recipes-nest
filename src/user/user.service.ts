import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PaginatedResults } from '../dto/paginatedResults.dto';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { paginate } from '../helpers/paginate';
import { PrismaService } from '../prisma/prisma.service';
import { UserAll, UserCredentialsDto, UserDto, UserInfo, UserInfoDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(userCredentialsDto: UserCredentialsDto): Promise<UserDto> {
    return this.prisma.user.create({ data: userCredentialsDto });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<UserInfoDto> {
    return this.prisma.user.delete({ select: UserInfo.select, where });
  }

  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<UserInfoDto> {
    return this.prisma.user.update({ select: UserInfo.select, data, where });
  }

  async user(where: Prisma.UserWhereUniqueInput): Promise<UserInfoDto | null> {
    return this.prisma.user.findUnique({ ...UserInfo, where });
  }
  async userWithCredentials(where: Prisma.UserWhereUniqueInput): Promise<UserDto | null> {
    return this.prisma.user.findUnique({ ...UserAll, where });
  }

  async users(
    paginatedQueryDto: PaginatedQueryDto,
    where: Prisma.UserWhereInput = {},
  ): Promise<PaginatedResults<UserInfoDto>> {
    const { page, limit } = paginatedQueryDto;
    const take = limit;
    const skip = (page - 1) * take;
    const itemsQuery = this.prisma.user.findMany({
      select: UserInfo.select,
      skip,
      take,
      where,
      orderBy: { id: 'asc' },
    });
    const countQuery = this.prisma.user.count();

    const [items, count] = await Promise.all([itemsQuery, countQuery]);

    return paginate(page, limit, count, items);
  }
}
