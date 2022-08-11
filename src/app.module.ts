import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import config from '../config/config';

@Module({
  imports: [ConfigModule.forRoot({ load: [config], isGlobal: true }), UserModule, RecipeModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
