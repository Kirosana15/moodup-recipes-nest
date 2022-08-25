import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BearerStrategy } from './auth/strategies/bearer.strategy';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/dev';
@Module({
  imports: [MongooseModule.forRoot(DB_URI), UserModule, RecipeModule, AuthModule],
  controllers: [AppController],
  providers: [BearerStrategy],
})
export class AppModule {}
