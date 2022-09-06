import { PaginatedQueryDto } from '../../../dto/queries.dto';
import { RecipeContentDto, RecipeDto } from '../../dto/recipe.dto';
import { generateRecipes, recipeMock } from './recipe.mock';

export const mockRecipeService = {
  create: jest.fn().mockImplementation((recipe: RecipeContentDto) => {
    return recipeMock(recipe);
  }),
  getById: jest.fn().mockImplementation((_id: string) => recipeMock({ _id })),
  delete: jest.fn().mockImplementation((_id: string) => recipeMock({ _id })),
  searchInTitle: jest.fn().mockImplementation((query: string) => generateRecipes(5, { title: query })),
  getAll: jest.fn().mockImplementation(async (paginatedQueryDto: PaginatedQueryDto): Promise<RecipeDto[]> => {
    const limit = paginatedQueryDto.limit;
    return generateRecipes(limit);
  }),
  update: jest.fn().mockImplementation((id: string, recipe: Partial<RecipeDto>) => recipeMock({ _id: id, ...recipe })),
};
