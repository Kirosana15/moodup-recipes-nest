import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { RecipeDto } from './dto/recipe.dto';
import { Recipe, RecipeDocument } from './recipe.schema';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>) {}

  searchInTitle(query: string, paginatedQueryDto: PaginatedQueryDto): Promise<RecipeDto[]> {
    const page = paginatedQueryDto?.page || 1;
    const limit = paginatedQueryDto?.limit || 10;
    return this.recipeModel
      .find({ title: { $regex: query, $options: 'i' } })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
