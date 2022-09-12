import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { RoleTypes } from '../auth/enums/roles';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { AuthorizedUser } from '../decorators/authorizedUser';
import { Roles } from '../decorators/roles';
import { PaginatedResults } from '../dto/paginatedResults.dto';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { UserInfoDto } from '../user/dto/user.dto';
import { RecipeContentEntity, RecipeEntity } from './model/recipe.entity';

import { RecipeService } from './recipe.service';
import { ApiDefaultResponses } from './swagger/default';
import { ApiOkPaginatedResults } from './swagger/paginated';

@ApiTags('Recipe')
@ApiBearerAuth()
@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Roles(RoleTypes.Admin)
  @ApiOkPaginatedResults()
  @ApiDefaultResponses()
  @Get('/all')
  getAllRecipes(@Query() query: PaginatedQueryDto): Promise<PaginatedResults<RecipeEntity>> {
    return this.recipeService.recipes(query);
  }

  @Post('/')
  @ApiDefaultResponses()
  async createRecipe(
    @Body() recipeContents: RecipeContentEntity,
    @AuthorizedUser() user: UserInfoDto,
  ): Promise<RecipeEntity> {
    let createdRecipe: RecipeEntity;
    try {
      const recipe = { ...recipeContents, ownerId: user.id };
      createdRecipe = await this.recipeService.create(recipe);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(err);
      }
      throw new BadRequestException();
    }
    return createdRecipe;
  }

  @UseGuards(OwnerGuard)
  @ApiDefaultResponses()
  @Delete(':id')
  async deleteRecipe(@Param('id') id: string): Promise<RecipeEntity> {
    const recipe: RecipeEntity | null = await this.recipeService.delete({ id });
    if (!recipe) {
      throw new NotFoundException('Recipe does not exist');
    }
    return recipe;
  }

  @ApiOkPaginatedResults()
  @ApiDefaultResponses()
  @Get('/search/:query')
  searchRecipeTitles(
    @Param('query') query: string,
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedResults<RecipeEntity>> {
    return this.recipeService.recipes(paginatedQueryDto, query);
  }

  @UseGuards(OwnerGuard)
  @ApiBody({ type: RecipeContentEntity })
  @ApiDefaultResponses()
  @Patch(':id')
  async updateRecipe(@Param('id') id: string, @Body() recipe: Partial<RecipeContentEntity>): Promise<RecipeEntity> {
    const updatedRecipe = await this.recipeService.update({ id }, recipe);
    if (!updatedRecipe) {
      throw new NotFoundException('Recipe does not exist');
    }
    return updatedRecipe;
  }
}
