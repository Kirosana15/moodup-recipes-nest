import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { RoleTypes } from '../auth/enums/roles';
import { generateCheck } from './helpers/generateCheck';


export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
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
