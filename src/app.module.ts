import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    MongooseModule.forRoot(config().database.uri),
    UserModule,
    RecipeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
