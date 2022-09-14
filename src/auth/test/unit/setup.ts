import { JwtModule } from '@nestjs/jwt';

import { CustomModuleMetadata, createModule } from '../../../../test/test.setup';
import { mockUserService } from '../../../user/test/mock/user.service.mock';
import { UserService } from '../../../user/user.service';
import { TOKEN_KEY } from '../../auth.constants';
import { AuthService } from '../../auth.service';

export const setupModule = (overrideMetadata?: CustomModuleMetadata) => {
  const metadata = {
    moduleMetadata: {
      imports: [
        JwtModule.register({ secret: TOKEN_KEY, signOptions: { expiresIn: '60m' } }),
        {
          module: class FakeModule {},
          providers: [{ provide: UserService, useValue: mockUserService }],
          exports: [UserService],
        },
      ],
      providers: [AuthService],
    },
    ...overrideMetadata,
  };
  return createModule(metadata);
};
