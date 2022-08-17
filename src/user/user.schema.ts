import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, type: 'string' })
  username: string;

  @Prop({ required: true, type: 'string' })
  password: string;

  @Prop({ default: false, type: 'boolean' })
  isAdmin: boolean;

  @Prop({ default: '', type: 'string' })
  check: string;

  @Prop({ default: Date.now(), type: 'number' })
  createdAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
