import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { RecipeDto, RecipeIdDto } from './dto/recipe.dto';

import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @UseGuards(OwnerGuard)
  @Get(':_id')
  async getRecipeById(@Param() param: RecipeDto): Promise<RecipeDto> {
    const recipe = await this.recipeService.getById(param._id);
    if (!recipe) {
      throw new NotFoundException('Recipe does not exist');
    }
    return recipe;
  }

  @UseGuards(OwnerGuard)
  @Delete(':_id')
  async deleteRecipe(@Req() req: any, @Param() params: RecipeIdDto): Promise<RecipeDto | null> {
    const user = req.user;
    const recipe = await this.recipeService.getById(params._id);
    if (!recipe) {
      throw new NotFoundException('Recipe does not exist');
    }
    if (user._id !== recipe.ownerId && !user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.recipeService.delete(params._id);
  }

  @Get('/search/:query')
  searchRecipeTitles(
    @Param('query') query: string,
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<RecipeDto[]> {
    return this.recipeService.searchInTitle(query, paginatedQueryDto);
  }
}
