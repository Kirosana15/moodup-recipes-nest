import { RecipeInfoDto } from '../../dto/recipe.dto';
import { generateRecipes, recipeMock } from './recipe.mock';

export const mockRecipeService = {
  create: jest.fn().mockImplementation((recipe: Partial<RecipeInfoDto>) => {
    return recipeMock(recipe);
  }),
  getById: jest.fn().mockImplementation((_id: string) => recipeMock({ _id })),
  delete: jest.fn().mockImplementation((_id: string) => recipeMock({ _id })),
  searchInTitle: jest.fn().mockImplementation((query: string) => generateRecipes(5, { title: query })),
  update: jest
    .fn()
    .mockImplementation((id: string, recipe: Partial<RecipeInfoDto>) => recipeMock({ _id: id, ...recipe })),
};
