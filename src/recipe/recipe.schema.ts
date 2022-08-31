import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true, type: 'string' })
  ownerId: string;

  @Prop({ required: true, type: 'string' })
  title: string;

  @Prop({ default: 'https://picsum.photos/id/1062/350/150?blur=1', type: 'string' })
  imageUrl: string;

  @Prop({ required: true, type: 'string' })
  content: string;

  @Prop({ default: Date.now(), type: 'number' })
  createdAt: number;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
