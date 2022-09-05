import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { RecipeDto } from './dto/recipe.dto';
import { Recipe, RecipeDocument } from './recipe.schema';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>) {}

  async create(recipe: Omit<RecipeDto, 'createdAt'>): Promise<RecipeDto> {
    const newRecipe = new this.recipeModel(recipe);
    return (await newRecipe.save()).toObject();
  }

  getById(id: string): Promise<RecipeDto | null> {
    return this.recipeModel.findById(id).lean().exec();
  }

  delete(id: string): Promise<RecipeDto | null> {
    return this.recipeModel.findByIdAndDelete(id).lean().exec();
  }

  searchInTitle(query: string, paginatedQueryDto?: PaginatedQueryDto): Promise<RecipeDto[]> {
    const page = paginatedQueryDto?.page || 1;
    const limit = paginatedQueryDto?.limit || 10;
    if (!query.match(/^[\w'-]*$/)) {
      throw new BadRequestException('query cannot contain special characters');
    }
    return this.recipeModel
      .find({ title: { $regex: query, $options: 'i' } })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  update(id: string, recipe: Partial<RecipeDto>): Promise<RecipeDto | null> {
    return this.recipeModel.findByIdAndUpdate(id, recipe, { new: true }).lean().exec();
  }
}
