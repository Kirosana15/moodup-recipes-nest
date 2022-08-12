import { Module } from '@nestjs/common';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/dev';
@Module({
  imports: [MongooseModule.forRoot(DB_URI), UserModule, RecipeModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
