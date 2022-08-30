import { Controller, Delete, Get, Param, NotFoundException, Query } from '@nestjs/common';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { RecipeDto, RecipeIdDto } from './dto/recipe.dto';

import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Delete(':_id')
  async deleteRecipe(@Param() params: RecipeIdDto): Promise<RecipeDto> {
    const recipe = await this.recipeService.delete(params._id);
    if (recipe) {
      return recipe;
    }
    throw new NotFoundException('Recipe does not exist');
  }

  @Get('/search/:query')
  searchRecipeTitles(
    @Param('query') query: string,
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<RecipeDto[]> {
    return this.recipeService.searchInTitle(query, paginatedQueryDto);
  }
}
