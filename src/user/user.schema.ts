import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { RoleTypes } from '../auth/enums/roles';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [RoleTypes.User] })
  roles: RoleTypes[];

  @Prop({ default: '', type: 'string' })
  refreshToken: string;

  @Prop({ default: Date.now() })
  createdAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
