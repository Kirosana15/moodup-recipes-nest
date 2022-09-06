import { registerAs } from '@nestjs/config';

export const paginationConfig = registerAs('pagination', () => ({
  defaultPage: 1,
  defaultLimit: 10,
}));
