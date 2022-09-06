import { faker } from '@faker-js/faker';

import { RecipeDto } from '../../dto/recipe.dto';

export const mockTitle = () => faker.word.noun(20);
export const mockImageUrl = faker.image.food;
export const mockContent = () => faker.lorem.paragraph(4);
export const mockId = faker.database.mongodbObjectId;
export const mockPaginationQuery = (page = 1, limit = 10) => ({ page, limit });

export const recipeMock = (recipe?: Partial<RecipeDto>): RecipeDto => ({
  _id: recipe?._id || mockId(),
  ownerId: recipe?.ownerId || mockId(),
  title: recipe?.title || mockTitle(),
  imageUrl: recipe?.imageUrl || mockImageUrl(),
  content: recipe?.content || mockContent(),
  createdAt: recipe?.createdAt || faker.date.past().getTime(),
});

export const generateRecipes = (count: number, recipe?: Partial<RecipeDto>): RecipeDto[] => {
  return Array.from(Array(count), () => recipeMock(recipe));
};
