import { Controller, Get, Param } from '@nestjs/common';
import { RecipeDto } from './dto/recipe.dto';

import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Get('/search/:query')
  searchRecipeTitles(@Param('query') query: string): Promise<RecipeDto[]> {
    return this.recipeService.searchInTitle(query);
  }
}
