import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PaginatedQueryDto } from '../dto/queries.dto';
import { paginate } from '../helpers/paginate';
import { PrismaService } from '../prisma/prisma.service';
import { UserSelect } from './user.select';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(userCredentialsDto: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: userCredentialsDto });
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({ select: UserSelect.Info, where });
  }

  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ data, where });
  }

  async user(where: Prisma.UserWhereUniqueInput, select: Prisma.UserSelect = UserSelect.Info) {
    return this.prisma.user.findUnique({ select, where });
  }

  async users(
    paginatedQueryDto: PaginatedQueryDto,
    select: Prisma.UserSelect = UserSelect.Info,
    where: Prisma.UserWhereInput = {},
  ) {
    const { page, limit } = paginatedQueryDto;
    const take = limit;
    const skip = (page - 1) * take;
    const itemsQuery = this.prisma.user.findMany({ select, skip, take, where, orderBy: { id: 'asc' } });
    const countQuery = this.prisma.user.count();

    const [items, count] = await Promise.all([itemsQuery, countQuery]);

    return paginate(page, limit, count, items);
  }
}
