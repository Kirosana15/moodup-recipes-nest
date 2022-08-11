import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 'https://picsum.photos/id/1062/350/150?blur=1' })
  imageUrl: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
