export const Select = Object.freeze({
  UserInfo: { id: true, username: true, roles: true, createdAt: true },
  User: {},
  UserWithRecipes: { recipes: { select: { title: true, imageUrl: true } } },
});
