// import { UserCredentialsDto, UserDto, UserInfoDto } from "./dto/user.dto";

import { Prisma } from '@prisma/client';

// export function UserSelect<T extends UserDto>(): Select<T> {

// };

// export type Select<T> = {
//   [Property in keyof T]: true;
// };

// export function getSelect<T>(type: { new (): Select<T> }): Prisma.UserSelect {
//   return new type();
// }

export const UserSelect: { [key: string]: Prisma.UserSelect } = {
  All: {
    id: true,
    username: true,
    password: true,
    refreshToken: true,
    roles: true,
    createdAt: true,
  },
  Info: {
    id: true,
    username: true,
    roles: true,
    createdAt: true,
  },
  Credentials: {
    username: true,
    password: true,
  },
};
