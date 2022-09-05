import { faker } from '@faker-js/faker';

import { RecipeDto as RecipeFullDto } from '../../dto/recipe.dto';

export const mockTitle = () => faker.word.adverb() + faker.word.adjective() + faker.word.noun();
<<<<<<< HEAD
export const mockImageUrl = faker.image.food;
export const mockContent = () => faker.lorem.paragraph(4);
export const mockId = faker.database.mongodbObjectId;

export const recipeMock = (recipe?: Partial<RecipeFullDto>): RecipeFullDto => ({
  _id: recipe?._id || mockId(),
  ownerId: recipe?.ownerId || mockId(),
=======
export const mockImageUrl = () => faker.image.food();
export const mockContent = () => faker.lorem.paragraph(4);

export const recipeMock = (recipe?: Partial<RecipeDto>): RecipeDto => ({
  ownerId: recipe?.ownerId || generateMockId(),
>>>>>>> 602f588 (extend functionality of recipeMock)
  title: recipe?.title || mockTitle(),
  imageUrl: recipe?.imageUrl || mockImageUrl(),
  content: recipe?.content || mockContent(),
  createdAt: recipe?.createdAt || faker.date.past().getTime(),
});

export const generateRecipes = (count: number, recipe?: Partial<RecipeFullDto>): RecipeFullDto[] => {
  return Array.from(new Array(count), () => recipeMock(recipe));
};
