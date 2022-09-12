import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

@Module({
  imports: [PrismaModule],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class RecipeModule {}
