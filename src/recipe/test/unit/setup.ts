import { MongooseModule } from '@nestjs/mongoose';

import { rootMongooseTestModule } from '../../../../test/mock/db.mock';
import { CustomModuleMetadata, createModule } from '../../../../test/test.setup';
import { Recipe, RecipeSchema } from '../../recipe.schema';
import { RecipeService } from '../../recipe.service';

export const setupModule = (overrideMetadata?: CustomModuleMetadata) => {
  const metadata = {
    moduleMetadata: {
      providers: [RecipeService],
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
    },
    ...overrideMetadata,
  };
  return createModule(metadata);
};
