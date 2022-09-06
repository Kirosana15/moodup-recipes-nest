import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BearerAuthGuard } from './auth/guards/bearer.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import configuration from './config/config';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configuration, cache: true }),
    MongooseModule.forRoot(process.env.DB_URI || 'mongodb://localhost:27017/test'),
    UserModule,
    RecipeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BearerAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
