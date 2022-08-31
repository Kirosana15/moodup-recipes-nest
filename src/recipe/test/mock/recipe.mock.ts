import { faker } from '@faker-js/faker';

import { generateMockId } from '../../../user/test/mock/user.model.mock';
import { RecipeDto } from '../../dto/recipe.dto';

export const mockTitle = () => faker.word.adverb() + faker.word.adjective() + faker.word.noun();
export const mockImageUrl = () => faker.image.food();
export const mockContent = () => faker.lorem.paragraph(4);

export const recipeMock = (recipe?: Partial<RecipeDto>): RecipeDto => ({
  ownerId: recipe?.ownerId || generateMockId(),
  title: recipe?.title || mockTitle(),
  imageUrl: recipe?.imageUrl || mockImageUrl(),
  content: recipe?.content || mockContent(),
  createdAt: recipe?.createdAt || faker.date.past().getTime(),
});

export const generateRecipes = (count: number, recipe?: Partial<RecipeDto>): RecipeDto[] => {
  return Array.from(new Array(count), () => recipeMock(recipe));
};
