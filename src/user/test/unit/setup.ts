import { MongooseModule } from '@nestjs/mongoose';

import { rootMongooseTestModule } from '../../../../test/mock/db.mock';
import { CustomModuleMetadata, createModule } from '../../../../test/test.setup';
import { User, UserSchema } from '../../user.schema';
import { UserService } from '../../user.service';

export const setupModule = (overrideMetadata?: CustomModuleMetadata) => {
  const metadata = {
    moduleMetadata: {
      providers: [UserService],
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    },
    ...overrideMetadata,
  };
  return createModule(metadata);
};
