import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedResults } from '../dto/paginatedResults.dto';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { paginate } from '../helpers/paginate';
import { RecipeDto, RecipeInfoDto } from './dto/recipe.dto';
import { Recipe, RecipeDocument } from './recipe.schema';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>) {}

  async create(recipe: Omit<RecipeInfoDto, 'createdAt'>): Promise<RecipeDto> {
    const newRecipe = new this.recipeModel(recipe);
    return (await newRecipe.save()).toObject();
  }

  getById(id: string): Promise<RecipeDto | null> {
    return this.recipeModel.findById(id).lean().exec();
  }

  async getAll(paginatedQueryDto: PaginatedQueryDto): Promise<PaginatedResults<RecipeDto>> {
    const page = paginatedQueryDto.page;
    const limit = paginatedQueryDto.limit;
    const countQuery = this.recipeModel.count();
    const recipesQuery = this.recipeModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();

    const [count, recipes] = await Promise.all([countQuery, recipesQuery]);

    return paginate<RecipeDto>(page, limit, count, recipes);
  }

  async getByOwnerId(id: string, paginatedQueryDto: PaginatedQueryDto): Promise<PaginatedResults<Recipe>> {
    const { page, limit } = paginatedQueryDto;
    const countQuery = this.recipeModel.count({ ownerId: id });
    const recipeQuery = this.recipeModel
      .find({ ownerId: id })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const [count, recipes] = await Promise.all([countQuery, recipeQuery]);

    return paginate<RecipeDto>(page, limit, count, recipes);
  }

  delete(id: string): Promise<RecipeDto | null> {
    return this.recipeModel.findByIdAndDelete(id).lean().exec();
  }

  async searchInTitle(query: string, paginatedQueryDto: PaginatedQueryDto): Promise<PaginatedResults<RecipeDto>> {
    const page = paginatedQueryDto.page;
    const limit = paginatedQueryDto.limit;
    if (!query.match(/^[\w'-]*$/)) {
      throw new BadRequestException('query cannot contain special characters');
    }
    const countQuery = this.recipeModel.count({ title: { $regex: query, $options: 'i' } });
    const searchQuery = this.recipeModel
      .find({ title: { $regex: query, $options: 'i' } })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const [count, recipes] = await Promise.all([countQuery, searchQuery]);

    return paginate<RecipeDto>(page, limit, count, recipes);
  }

  update(id: string, recipe: Partial<RecipeDto>): Promise<RecipeDto | null> {
    return this.recipeModel.findByIdAndUpdate(id, recipe, { new: true }).lean().exec();
  }
}
