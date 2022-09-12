import { Prisma } from '@prisma/client';

export const RecipeAll = Prisma.validator<Prisma.RecipeArgs>()({
  select: { id: true, ownerId: true, title: true, imageUrl: true, content: true, createdAt: true },
});

export const RecipeInfo = Prisma.validator<Prisma.RecipeArgs>()({
  select: { ownerId: true, title: true, imageUrl: true, content: true, createdAt: true },
});

export const RecipeId = Prisma.validator<Prisma.RecipeArgs>()({
  select: { id: true },
});

export const RecipeContent = Prisma.validator<Prisma.RecipeArgs>()({
  select: { title: true, imageUrl: true, content: true },
});

export const RecipeCreate = Prisma.validator<Prisma.RecipeArgs>()({
  select: { ownerId: true, title: true, imageUrl: true, content: true },
});

export type RecipeDto = Prisma.RecipeGetPayload<typeof RecipeAll>;
export type UserInfoDto = Prisma.RecipeGetPayload<typeof RecipeInfo>;
export type RecipeIdDto = Prisma.RecipeGetPayload<typeof RecipeId>;
export type RecipeContentDto = Prisma.RecipeGetPayload<typeof RecipeContent>;
export type RecipeCreateDto = Prisma.RecipeGetPayload<typeof RecipeCreate>;
