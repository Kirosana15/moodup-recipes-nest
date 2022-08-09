export default () => ({
  database: { uri: process.env.DB_URI || 'mongodb://localhost:27017/dev' },
  port: process.env.PORT || 300,
  token: { key: process.env.TOKEN_KEY || 'secret' },
});
