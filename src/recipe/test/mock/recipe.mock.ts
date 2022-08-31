import { faker } from '@faker-js/faker';

import { generateMockId } from '../../../user/test/mock/user.model.mock';
import { RecipeDto } from '../../dto/recipe.dto';

export const mockTitle = faker.word.adverb() + faker.word.adjective() + faker.word.noun();
export const mockImageUrl = faker.image.food();
export const mockContent = faker.lorem.paragraph(4);

export const recipeMock: RecipeDto = {
  ownerId: generateMockId(),
  title: mockTitle,
  imageUrl: mockImageUrl,
  content: mockContent,
  createdAt: faker.date.past().getTime(),
};
