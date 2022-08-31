import { faker } from '@faker-js/faker';

import { RecipeDto } from '../../dto/recipe.dto';

export const mockTitle = () => faker.word.adverb() + faker.word.adjective() + faker.word.noun();
export const mockImageUrl = faker.image.food;
export const mockContent = () => faker.lorem.paragraph(4);
export const mockId = faker.database.mongodbObjectId;

export const recipeMock = (recipe?: Partial<RecipeDto>): RecipeDto => ({
  _id: recipe?._id || mockId(),
  ownerId: recipe?.ownerId || mockId(),
  title: recipe?.title || mockTitle(),
  imageUrl: recipe?.imageUrl || mockImageUrl(),
  content: recipe?.content || mockContent(),
  createdAt: recipe?.createdAt || faker.date.past().getTime(),
});

export const generateRecipes = (count: number, recipe?: Partial<RecipeDto>): RecipeDto[] => {
  return Array.from(new Array(count), () => recipeMock(recipe));
};
