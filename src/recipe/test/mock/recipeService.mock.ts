import { PaginatedQueryDto } from '../../../dto/queries.dto';
import { paginate } from '../../../helpers/paginate';
import { RecipeContentDto, RecipeDto } from '../../dto/recipe.dto';
import { generateRecipes, recipeMock } from './recipe.mock';

export const mockRecipeService = {
  create: jest.fn().mockImplementation((recipe: RecipeContentDto) => {
    return recipeMock(recipe);
  }),
  getById: jest.fn().mockImplementation((_id: string) => recipeMock({ _id })),
  delete: jest.fn().mockImplementation((_id: string) => recipeMock({ _id })),
  searchInTitle: jest.fn().mockImplementation((query: string, paginatedQueryDto: PaginatedQueryDto) => {
    const { page, limit } = paginatedQueryDto;
    const items = generateRecipes(limit, { title: query });
    return paginate(page, limit, limit * page + 5, items);
  }),
  getAll: jest.fn().mockImplementation(async (paginatedQueryDto: PaginatedQueryDto) => {
    const { page, limit } = paginatedQueryDto;
    const items = generateRecipes(limit);
    return paginate(page, limit, limit * page + 5, items);
  }),
  update: jest.fn().mockImplementation((id: string, recipe: Partial<RecipeDto>) => recipeMock({ _id: id, ...recipe })),
};
