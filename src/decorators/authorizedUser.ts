import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserInfoDto } from '../user/dto/user.dto';

export const AuthorizedUser = createParamDecorator((data, context: ExecutionContext): UserInfoDto => {
  const req = context.switchToHttp().getRequest();
  return req.user;
});
