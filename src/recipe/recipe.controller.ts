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
import { Prisma } from '@prisma/client';
import { RoleTypes } from '../auth/enums/roles';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { AuthorizedUser } from '../decorators/authorizedUser';
import { Roles } from '../decorators/roles';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { UserInfoDto } from '../user/dto/user.dto';
import { RecipeDto, RecipeContentDto, RecipeIdDto } from './dto/recipe.dto';

import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Roles(RoleTypes.Admin)
  @Get('/all')
  getAllRecipes(@Query() query: PaginatedQueryDto) {
    return this.recipeService.recipes(query);
  }

  @Post('/')
  async createRecipe(
    @Body() recipeContents: RecipeContentDto,
    @AuthorizedUser() user: UserInfoDto,
  ): Promise<RecipeDto> {
    let createdRecipe: RecipeDto;
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
  @Delete(':id')
  async deleteRecipe(@Param() params: RecipeIdDto): Promise<RecipeDto | null> {
    const recipe = await this.recipeService.delete({ id: params.id });
    if (!recipe) {
      throw new NotFoundException('Recipe does not exist');
    }
    return recipe;
  }

  @Get('/search/:query')
  searchRecipeTitles(@Param('query') query: string, @Query() paginatedQueryDto: PaginatedQueryDto) {
    return this.recipeService.recipes(paginatedQueryDto, undefined, query);
  }

  @UseGuards(OwnerGuard)
  @Patch(':id')
  async updateRecipe(@Param() param: RecipeIdDto, @Body() recipe: Partial<RecipeDto>): Promise<RecipeDto> {
    const id = param.id;
    const updatedRecipe = await this.recipeService.update({ id }, recipe);
    if (!updatedRecipe) {
      throw new NotFoundException('Recipe does not exist');
    }
    return updatedRecipe;
  }
}
