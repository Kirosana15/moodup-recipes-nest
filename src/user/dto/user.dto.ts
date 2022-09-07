import { Prisma } from '@prisma/client';

export const UserAll = Prisma.validator<Prisma.UserArgs>()({
  select: { id: true, username: true, password: true, roles: true, refreshToken: true, createdAt: true },
});
export const UserCredentials = Prisma.validator<Prisma.UserArgs>()({
  select: { password: true, username: true },
});
const {
  select: { password: _p, refreshToken: _r, ...UserInfoSelect },
} = UserAll;
export const UserInfo = Prisma.validator<Prisma.UserArgs>()({ select: UserInfoSelect });

export type UserDto = Prisma.UserGetPayload<typeof UserAll>;
export type UserInfoDto = Prisma.UserGetPayload<typeof UserInfo>;
export type UserCredentialsDto = Prisma.UserGetPayload<typeof UserCredentials>;
