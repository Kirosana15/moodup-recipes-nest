import {
  Controller,
  Delete,
  Get,
  Param,
  NotFoundException,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { BearerAuthGuard } from '../auth/strategies/bearer.strategy';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { RecipeDto, RecipeIdDto } from './dto/recipe.dto';

import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @UseGuards(BearerAuthGuard)
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
