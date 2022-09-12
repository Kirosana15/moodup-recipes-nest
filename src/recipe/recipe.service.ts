import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PaginatedQueryDto } from '../dto/queries.dto';
import { paginate } from '../helpers/paginate';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeCreateDto, RecipeDto, RecipeIdDto } from './dto/recipe.dto';
import { RecipeSelect } from './recipe.select';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async create(recipe: RecipeCreateDto): Promise<RecipeDto> {
    return this.prisma.recipe.create({ data: recipe });
  }

  recipe(id: string, select: Prisma.RecipeSelect = RecipeSelect.All): Promise<Partial<RecipeDto>> {
    return this.prisma.recipe.findUniqueOrThrow({ select, where: { id } });
  }

  async recipes(
    paginatedQueryDto: PaginatedQueryDto,
    select?: Prisma.RecipeSelect,
    where?: Prisma.RecipeWhereInput | string,
  ) {
    const { page, limit } = paginatedQueryDto;
    const take = limit;
    const skip = (page - 1) * take;
    if (typeof where === 'string') {
      where = { title: { search: where } };
    }
    const itemsQuery = this.prisma.recipe.findMany({
      select,
      skip,
      take,
      where,
      orderBy: { id: 'asc' },
    });
    const countQuery = this.prisma.recipe.count();

    const [items, count] = await Promise.all([itemsQuery, countQuery]);

    return paginate(page, limit, count, items);
  }

  delete(where: RecipeIdDto): Promise<RecipeDto | null> {
    return this.prisma.recipe.delete({ where });
  }

  update(where: RecipeIdDto, recipe: Prisma.RecipeUpdateInput): Promise<RecipeDto | null> {
    return this.prisma.recipe.update({ where, data: recipe });
  }
}
