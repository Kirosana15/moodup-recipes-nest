export const DB = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: parseInt(process.env.DB_PORT || '5432'),
  USER: process.env.DB_USER || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || 'postgres',
  NAME: process.env.DB_NAME || 'recipesApi',
};
