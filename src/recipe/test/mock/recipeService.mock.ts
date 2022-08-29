import { generateRecipes } from './recipe.mock';

export const mockRecipeService = {
  searchInTitle: jest.fn().mockImplementation((query: string) => generateRecipes(5, { title: query })),
};
