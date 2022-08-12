import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './recipe.schema';
import { RecipeService } from './recipe.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
  providers: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
