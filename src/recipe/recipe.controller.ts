import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RecipeDto } from './dto/recipe.dto';

import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @UseGuards(bearerAuthGuard)
  @Get('/search/:query')
  searchRecipeTitles(@Query('query') query: string): Promise<RecipeDto[]> {
    return this.recipeService.searchInTitle(query);
  }
}
